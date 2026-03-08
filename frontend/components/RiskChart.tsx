"use client";

import { useMemo } from "react";

interface RiskDataPoint {
    date: string;
    risk: number;
}

interface RiskChartProps {
    data: RiskDataPoint[];
    height?: number;
}

export function RiskChart({ data, height = 200 }: RiskChartProps) {
    const points = useMemo(() => {
        if (data.length === 0) return "";

        const maxRisk = Math.max(...data.map(d => d.risk), 100);
        const width = 400;

        return data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d.risk / maxRisk) * height;
            return `${x},${y}`;
        }).join(" ");
    }, [data, height]);

    return (
        <div className="w-full h-full min-h-[200px] flex flex-col">
            <div className="flex-1 relative">
                <svg
                    viewBox={`0 0 400 ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="400" y2="0" stroke="currentColor" strokeOpacity="0.1" />
                    <line x1="0" y1={height / 2} x2="400" y2={height / 2} stroke="currentColor" strokeOpacity="0.1" />
                    <line x1="0" y1={height} x2="400" y2={height} stroke="currentColor" strokeOpacity="0.1" />

                    {/* Main Area */}
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <path
                        d={`M 0,${height} L ${points} L 400,${height} Z`}
                        fill="url(#areaGradient)"
                    />

                    {/* Main Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {data.map((d, i) => {
                        const maxRisk = Math.max(...data.map(d => d.risk), 100);
                        const x = (i / (data.length - 1)) * 400;
                        const y = height - (d.risk / maxRisk) * height;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                className="fill-primary border-4 border-background"
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Date labels */}
            <div className="flex justify-between mt-4">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground uppercase font-medium">
                        {d.date}
                    </span>
                ))}
            </div>
        </div>
    );
}
