"use client";

import { useState, useEffect } from "react";
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

// Assuming we are on testnet for the scope of this frontend
const CONTRACT_ID = "CCWHG2Q4VFY6XCQB4S4A4R6XYLFXSFTNQQYJAY4GZRXF2WYYX3F5YRP"; // Placeholder contract ID
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export function DepositTab() {
    const [address, setAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // In a real dApp, you would fetch this from the contract directly using a read-only transaction.
    // For the UI logic scope, we mock a sufficient balance validation.
    const mockUserBalance = 5000.0;

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
        checkConnection();
    }, []);

    const handleConnect = async () => {
        try {
            if (!(await isConnected())) {
                setStatus("Please install Freighter wallet extension!");
                return;
            }
            const addr = await requestAccess();
            if (addr && typeof addr === "string") setAddress(addr);
            setStatus("");
        } catch (e: any) {
            setStatus("Failed to connect: " + e.message);
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            setStatus("Please connect your wallet first.");
            return;
        }

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setStatus("Please enter a valid amount greater than 0.");
            return;
        }

        if (depositAmount > mockUserBalance) {
            setStatus(`Insufficient balance. (Available: ${mockUserBalance})`);
            return;
        }

        setIsLoading(true);
        setStatus("Initiating deposit...");

        try {
            const server = new SorobanRpc.Server(RPC_URL);

            setStatus("Fetching account details...");
            const account = await server.getAccount(address);

            setStatus("Building transaction...");
            const contract = new Contract(CONTRACT_ID);

            // Building XDR for the deposit call.
            // E.g., fn deposit(from: Address, amount: i128)
            const tx = new TransactionBuilder(account, {
                fee: "1000", // A static fee for the builder, actual fee is calculated during simulation
                networkPassphrase: NETWORK_PASSPHRASE,
            })
                .addOperation(
                    contract.call("deposit",
                        nativeToScVal(address, { type: "address" }),
                        // Assuming the contract counts amount in stroops (1 XLM = 10_000_000 stroops).
                        // Wrapping string so bigints handle correctly
                        nativeToScVal(
                            (BigInt(Math.floor(depositAmount * 10_000_000))).toString(),
                            { type: "i128" }
                        )
                    )
                )
                .setTimeout(TimeoutInfinite)
                .build();

            setStatus("Simulating transaction for fees and structure...");
            const sim = await server.simulateTransaction(tx);
            if (!SorobanRpc.Api.isSimulationSuccess(sim)) {
                setStatus("Simulation failed. Check console for details.");
                console.error("Simulation failed:", sim);
                return;
            }

            setStatus("Assembling transaction...");
            const preparedTxBuilder = SorobanRpc.assembleTransaction(tx, sim);

            setStatus("Please sign the transaction in Freighter...");
            const signedXdr = await signTransaction(preparedTxBuilder.build().toXDR(), {
                networkPassphrase: NETWORK_PASSPHRASE,
            });

            setStatus("Submitting to network...");
            const txToSubmit = TransactionBuilder.fromXDR(
                signedXdr,
                NETWORK_PASSPHRASE
            );
            const result = await server.sendTransaction(txToSubmit);

            if (result.status !== "PENDING") {
                setStatus("Transaction submission failed.");
                console.error("Submission failed:", result);
                return;
            }

            setStatus(`Transaction broadcasted successfully! Hash: ${result.hash}`);
            setAmount(""); // reset form
        } catch (error: any) {
            console.error(error);
            setStatus("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-8 p-6 bg-card border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Deposit Funds
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

            <form onSubmit={handleDeposit} className="space-y-4">
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

                <button
                    type="submit"
                    disabled={isLoading || !amount || !address}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors"
                >
                    {isLoading ? "Processing..." : "Deposit"}
                </button>
            </form>

            {status && (
                <div
                    className={`mt-4 p-3 rounded text-sm ${status.includes("Error") || status.includes("failed") || status.includes("Insufficient")
                        ? "bg-red-500/10 text-red-500"
                        : status.includes("successfully")
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                >
                    {status}
                </div>
            )}
        </div>
    );
}
