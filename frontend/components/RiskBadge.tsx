"use client";

import { cn } from "@/lib/utils";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

interface RiskBadgeProps {
    level: RiskLevel;
    className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
    const levelStyles = {
        Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        Critical: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                levelStyles[level],
                className
            )}
        >
            <span className="mr-1.5 flex h-2 w-2 items-center">
                <span className={cn("animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75", {
                    "bg-emerald-400": level === "Low",
                    "bg-amber-400": level === "Medium",
                    "bg-orange-400": level === "High",
                    "bg-rose-400": level === "Critical",
                })} />
                <span className={cn("relative inline-flex rounded-full h-2 w-2", {
                    "bg-emerald-500": level === "Low",
                    "bg-amber-500": level === "Medium",
                    "bg-orange-500": level === "High",
                    "bg-rose-500": level === "Critical",
                })} />
            </span>
            {level} Risk
        </div>
    );
}
