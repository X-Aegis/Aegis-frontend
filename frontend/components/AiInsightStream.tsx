"use client";

import React, { useEffect, useRef, useState } from "react";

type InsightType = "REBALANCE" | "INFO" | "WARNING";

interface Insight {
  id: string;
  timestamp: string;
  message: string;
  type: InsightType;
}

const mockInsights: Insight[] = [
  {
    id: "1",
    timestamp: "2024-03-07 16:30:12",
    message: "Analyzing market volatility...",
    type: "INFO",
  },
  {
    id: "2",
    timestamp: "2024-03-07 16:31:05",
    message: "Rebalance Triggered: Allocating 30% to Synthetic Hedges",
    type: "REBALANCE",
  },
  {
    id: "3",
    timestamp: "2024-03-07 16:32:00",
    message: "Inflation trend detected in NGN pairs.",
    type: "WARNING",
  },
  {
    id: "4",
    timestamp: "2024-03-07 16:33:15",
    message: "Optimizing yield for USDC reserves.",
    type: "INFO",
  },
  {
    id: "5",
    timestamp: "2024-03-07 16:34:45",
    message: "Rebalance Triggered: Shifted 10% from LP to USDC",
    type: "REBALANCE",
  },
  {
    id: "6",
    timestamp: "2024-03-07 16:35:10",
    message: "Monitoring Central Bank interest rate updates.",
    type: "INFO",
  },
];

export const AiInsightStream: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>(mockInsights);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [insights]);

  const getMessageStyle = (type: InsightType) => {
    switch (type) {
      case "REBALANCE":
        return "text-primary font-bold border-l-2 border-primary pl-2 bg-primary/10";
      case "WARNING":
        return "text-yellow-600 dark:text-yellow-400 font-medium";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="w-full max-w-2xl bg-card rounded-xl border border-border overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">AI Insight Stream</h2>
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">LIVE_FEED_v1.0</div>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-48 sm:h-56 md:h-[300px] overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar"
      >
        {insights.map((insight) => (
            <div className={`p-2 rounded transition-all duration-300 hover:bg-accent/50 ${getMessageStyle(insight.type)}`}
            >
            <div className="flex justify-between items-start gap-4">
              <span className="flex-1">{insight.message}</span>
              <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap shrink-0">{insight.timestamp}</span>
            </div>
            {insight.type === "REBALANCE" && (
              <div className="mt-1 flex items-center gap-1">
                <span className="w-3 h-[1px] bg-primary" />
                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/70">Execution Confirmed</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.3);
        }
      `}</style>
    </div>
  );
};
