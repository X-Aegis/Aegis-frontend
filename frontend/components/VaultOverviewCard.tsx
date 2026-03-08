"use client";

import { useEffect, useState } from "react";
import { getProvider, activeNetwork } from "../lib/network";
import { Contract, TransactionBuilder, Account, xdr } from "@stellar/stellar-sdk";
import { isConnected, requestAccess } from "@stellar/freighter-api";

// The contract ID should ideally come from an .env file or config
const VAULT_CONTRACT_ID = "CCWHG2Q4VFY6XCQB4S4A4R6XYLFXSFTNQQYJAY4GZRXF2WYYX3F5YRP";

export function VaultOverviewCard() {
    const [totalAssets, setTotalAssets] = useState<number | null>(null);
    const [totalShares, setTotalShares] = useState<number | null>(null);
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [address, setAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            setIsLoading(true);
            try {
                const connected = await isConnected();
                let currentAddress = "";
                if (connected) {
                    const addr = await requestAccess();
                    if (addr && typeof addr === "string") {
                        currentAddress = addr;
                        setAddress(addr);
                    }
                }
                await fetchVaultData(currentAddress);
            } catch (err: any) {
                console.error("Initialization error:", err);
                setError("Failed to connect or fetch data.");
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, []);

    const fetchVaultData = async (userAddr: string) => {
        try {
            // Create RPC provider based on network.ts
            const server = getProvider("testnet");

            // For reading data via simulation, we can use a dummy account
            const dummyAccount = new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0");
            const contract = new Contract(VAULT_CONTRACT_ID);

            // In a real scenario, you'd build actual XDR and simulate to read states like total_assets()
            // Since we don't have the exact contract ABI loaded here, we mock the RPC response values
            // based on typical vault implementations (e.g., ERC-4626 equivalent on Soroban).

            // Simulate fetching total_assets and total_shares
            // E.g., const tx = new TransactionBuilder(dummyAccount, { fee: "100", networkPassphrase: activeNetwork.networkPassphrase })
            //          .addOperation(contract.call("total_assets")).build();
            // const sim = await server.simulateTransaction(tx);
            // const decodedAssets = sim.result.retval...

            // MOCK DATA for demonstration (since there is no live contract to query right now)
            setTotalAssets(1500000);
            setTotalShares(1200000);

            // Simulate fetching user's share balance if connected
            if (userAddr) {
                // E.g., contract.call("balance", [nativeToScVal(userAddr, { type: 'address' })])
                setUserBalance(5000);
            } else {
                setUserBalance(0);
            }

        } catch (e: any) {
            console.error("Error fetching vault data:", e);
            setError("Error connecting to network/contract.");
        }
    };

    // Calculate share price (Total Assets / Total Shares)
    const sharePrice = totalAssets && totalShares && totalShares > 0
        ? (totalAssets / totalShares).toFixed(4)
        : "1.0000";

    return (
        <div className="w-full max-w-lg p-6 mx-auto bg-card border rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                    <span>🏦</span> Vault Overview
                </h2>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full uppercase font-medium">
                    {activeNetwork.network}
                </span>
            </div>

            {error ? (
                <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">{error}</div>
            ) : isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Total Assets (TVL)</p>
                            <p className="text-2xl font-bold tracking-tight">
                                {totalAssets ? `$${totalAssets.toLocaleString()}` : "--"}
                            </p>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Share Price</p>
                            <p className="text-2xl font-bold tracking-tight text-emerald-600">
                                ${sharePrice}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-b border-border/50">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Shares Minted</p>
                            <p className="text-lg font-semibold">{totalShares ? totalShares.toLocaleString() : "--"} SHRS</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Your Balance</p>
                            <p className="text-lg font-semibold">
                                {address ? (userBalance ? `${userBalance.toLocaleString()} SHRS` : "0 SHRS") : "Not Connected"}
                            </p>
                        </div>
                    </div>

                    {!address && (
                        <p className="text-xs text-center text-muted-foreground">
                            Connect your wallet to see your specific balance in the vault.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
