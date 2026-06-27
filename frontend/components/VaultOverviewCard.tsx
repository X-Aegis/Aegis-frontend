"use client";

import { useEffect, useState, useRef } from "react";
import { getProvider, activeNetwork } from "../lib/network";
import { Contract, TransactionBuilder, Account, xdr, SorobanRpc } from "@stellar/stellar-sdk";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import { useCurrency } from "@/contexts/CurrencyContext";

// The contract ID should ideally come from an .env file or config
const VAULT_CONTRACT_ID = "CCWHG2Q4VFY6XCQB4S4A4R6XYLFXSFTNQQYJAY4GZRXF2WYYX3F5YRP";

export function VaultOverviewCard() {
    const { formatAmount } = useCurrency();
    const [totalAssets, setTotalAssets] = useState<number | null>(null);
    const [totalShares, setTotalShares] = useState<number | null>(null);
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [address, setAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const addressRef = useRef(address);
    useEffect(() => {
        addressRef.current = address;
    }, [address]);

    useEffect(() => {
        let isMounted = true;
        let pollInterval: NodeJS.Timeout;
        const server = getProvider("testnet");

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
                if (!isMounted) return;
                await fetchVaultData(currentAddress);

                // Setup Soroban events polling
                const latestLedgerResponse = await server.getLatestLedger();
                if (!isMounted) return;
                let lastLedger = latestLedgerResponse.sequence;

                pollInterval = setInterval(async () => {
                    if (!isMounted) return;
                    try {
                        const eventsResponse = await server.getEvents({
                            startLedger: lastLedger,
                            filters: [
                                {
                                    type: "contract",
                                    contractIds: [VAULT_CONTRACT_ID]
                                }
                            ],
                            limit: 100
                        });

                        if (eventsResponse.events && eventsResponse.events.length > 0) {
                            console.log("New vault events received:", eventsResponse.events);
                            // On new events (Deposit, Withdraw, Rebalance), refetch vault data
                            fetchVaultData(addressRef.current);
                        }

                        const newLedgerInfo = await server.getLatestLedger();
                        lastLedger = newLedgerInfo.sequence;
                    } catch (pollErr) {
                        console.error("Error polling for events:", pollErr);
                    }
                }, 5000); // Poll every 5 seconds

            } catch (err: any) {
                console.error("Initialization error:", err);
                if (isMounted) setError("Failed to connect or fetch data.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        init();

        return () => {
            isMounted = false;
            if (pollInterval) clearInterval(pollInterval);
        };
    }, []);

    const fetchVaultData = async (userAddr: string) => {
        try {
            // MOCK DATA for demonstration (since there is no live contract to query right now)
            // Adding a small random variation to simulate real-time updates when events trigger a refetch
            const variation = Math.floor(Math.random() * 1000);
            setTotalAssets(1500000 + variation);
            setTotalShares(1200000 + Math.floor(variation * 0.8));

            if (userAddr) {
                setUserBalance(5000 + Math.floor(variation * 0.05));
            } else {
                setUserBalance(0);
            }

        } catch (e: any) {
            console.error("Error fetching vault data:", e);
            setError("Error connecting to network/contract.");
        }
    };

    // Calculate share price (Total Assets / Total Shares) in USD
    const sharePriceUsd = totalAssets && totalShares && totalShares > 0
        ? totalAssets / totalShares
        : 1.0;

    return (
        <div className="w-full max-w-lg p-6 mx-auto bg-card border rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                    <span>🏦</span> Vault Overview
                </h2>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full uppercase font-medium">
                    {activeNetwork.network}
                </span>
                <span className="flex h-3 w-3 relative ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" title="Real-time Events Connected"></span>
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
                            <p className="text-2xl font-bold tracking-tight transition-all duration-500">
                                {totalAssets ? formatAmount(totalAssets) : "--"}
                            </p>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Share Price</p>
                            <p className="text-2xl font-bold tracking-tight text-emerald-600 transition-all duration-500">
                                {formatAmount(sharePriceUsd)}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-b border-border/50">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Shares Minted</p>
                            <p className="text-lg font-semibold transition-all duration-500">{totalShares ? totalShares.toLocaleString() : "--"} SHRS</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Your Balance</p>
                            <p className="text-lg font-semibold transition-all duration-500">
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
