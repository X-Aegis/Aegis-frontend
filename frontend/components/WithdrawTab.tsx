"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Contract,
    TransactionBuilder,
    SorobanRpc,
    TimeoutInfinite,
    nativeToScVal,
} from "@stellar/stellar-sdk";
import {
    isConnected,
    requestAccess,
    signTransaction,
} from "@stellar/freighter-api";

const CONTRACT_ID = "CCWHG2Q4VFY6XCQB4S4A4R6XYLFXSFTNQQYJAY4GZRXF2WYYX3F5YRP";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export function WithdrawTab() {
    const [address, setAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [estimatedFee, setEstimatedFee] = useState<string>("Loading...");

    const mockUserBalance = 1000.0;

    useEffect(() => {
        async function checkConnection() {
            try {
                const connected = await isConnected();
                if (connected) {
                    const addr = await requestAccess();
                    if (addr && typeof addr === "string") setAddress(addr);
                }
            } catch (e) {
                console.error("Connection check failed:", e);
            }
        }
        async function fetchFee() {
            try {
                const server = new SorobanRpc.Server(RPC_URL);
                const feeStats = await server.getFeeStats();
                setEstimatedFee(`${feeStats.sorobanInclusionFee.min} stroops`);
            } catch {
                setEstimatedFee("100 stroops (fallback)");
            }
        }
        checkConnection();
        fetchFee();
    }, []);

    const handleConnect = async () => {
        try {
            if (!(await isConnected())) {
                toast.error("Please install Freighter wallet extension!");
                return;
            }
            const addr = await requestAccess();
            if (addr && typeof addr === "string") {
                setAddress(addr);
                toast.success("Wallet connected successfully.");
            }
        } catch (e: unknown) {
            toast.error("Failed to connect: " + (e instanceof Error ? e.message : String(e)));
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            toast.warning("Please connect your wallet first.");
            return;
        }

        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            toast.warning("Please enter a valid amount greater than 0.");
            return;
        }

        if (withdrawAmount > mockUserBalance) {
            toast.error(`Insufficient balance. (Available: ${mockUserBalance})`);
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Initiating withdrawal...");

        try {
            const server = new SorobanRpc.Server(RPC_URL);

            toast.loading("Fetching account details...", { id: toastId });
            const account = await server.getAccount(address);

            toast.loading("Building transaction...", { id: toastId });
            const contract = new Contract(CONTRACT_ID);

            const tx = new TransactionBuilder(account, {
                fee: "1000",
                networkPassphrase: NETWORK_PASSPHRASE,
            })
                .addOperation(
                    contract.call(
                        "withdraw",
                        nativeToScVal(address, { type: "address" }),
                        nativeToScVal(
                            (BigInt(Math.floor(withdrawAmount * 10_000_000))).toString(),
                            { type: "i128" }
                        )
                    )
                )
                .setTimeout(TimeoutInfinite)
                .build();

            toast.loading("Simulating transaction...", { id: toastId });
            const sim = await server.simulateTransaction(tx);
            if (!SorobanRpc.Api.isSimulationSuccess(sim)) {
                toast.error("Simulation failed. Check console for details.", { id: toastId });
                console.error("Simulation failed:", sim);
                return;
            }

            toast.loading("Assembling transaction...", { id: toastId });
            const preparedTxBuilder = SorobanRpc.assembleTransaction(tx, sim);

            toast.loading("Please sign the transaction in Freighter...", { id: toastId });
            const signedXdr = await signTransaction(preparedTxBuilder.build().toXDR(), {
                networkPassphrase: NETWORK_PASSPHRASE,
            });

            toast.loading("Submitting to network...", { id: toastId });
            const txToSubmit = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
            const result = await server.sendTransaction(txToSubmit);

            if (result.status !== "PENDING") {
                toast.error("Transaction submission failed.", { id: toastId });
                console.error("Submission failed:", result);
                return;
            }

            toast.success(`Withdrawal successful! Hash: ${result.hash}`, { id: toastId });
            setAmount("");
        } catch (error: unknown) {
            console.error(error);
            toast.error("Error: " + (error instanceof Error ? error.message : String(error)), { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-8 p-6 bg-card border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Withdraw Funds
            </h2>

            {!address && (
                <button
                    onClick={handleConnect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors mb-4"
                >
                    Connect Freighter Wallet
                </button>
            )}

            {address && (
                <p className="text-sm text-muted-foreground mb-6 break-all">
                    Connected: {address}
                </p>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-1">
                        Amount (USDC)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isLoading || !address}
                        className="w-full border rounded p-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0.00"
                        required
                    />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Available Balance:</span>
                        <span>{mockUserBalance} USDC</span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground bg-secondary/20 p-2 rounded">
                    <span>Estimated Network Fee:</span>
                    <span>{estimatedFee}</span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !amount || !address}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors"
                >
                    {isLoading ? "Processing..." : "Withdraw"}
                </button>
            </form>
        </div>
    );
}
