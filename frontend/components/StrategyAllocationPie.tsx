"use client";

import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import * as StellarSdk from "@stellar/stellar-sdk";

interface AllocationData {
    name: string;
    value: number;
    color: string;
}

const MOCK_ALLOCATION: AllocationData[] = [
    { name: "USDC Reserves", value: 40, color: "hsl(var(--primary))" },
    { name: "Stellar LP", value: 35, color: "hsl(var(--primary) / 0.7)" },
    { name: "Synthetic Hedges", value: 25, color: "hsl(var(--primary) / 0.4)" },
];

export function StrategyAllocationPie() {
    const [data, setData] = useState<AllocationData[]>(MOCK_ALLOCATION);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAllocation() {
            const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;

            if (!contractId) {
                // Fallback to mock data if no contract is configured
                setData(MOCK_ALLOCATION);
                setIsLoading(false);
                return;
            }

            try {
                const server = new StellarSdk.SorobanRpc.Server(
                    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org"
                );

                // Example invocation to a hypothetical get_allocations method
                const txBuilder = new StellarSdk.TransactionBuilder(
                    new StellarSdk.Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "1"),
                    { fee: "100", networkPassphrase: StellarSdk.Networks.TESTNET }
                );

                // This simulates a contract simulation to fetch data (read-only)
                const call = new StellarSdk.Contract(contractId).call("get_allocations");

                // For demonstration, we simply fallback to mock data as parsing actual XDR
                // depends heavily on the specific contract structure.
                setData(MOCK_ALLOCATION);
            } catch (error) {
                console.error("Failed to fetch allocation from contract:", error);
                // Fallback to mock data on failure
                setData(MOCK_ALLOCATION);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllocation();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-sm">
                    <p className="font-medium text-sm">{`${payload[0].name}: ${payload[0].value}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
