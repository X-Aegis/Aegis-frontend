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
        return "text-[#00ffcc] font-bold border-l-2 border-[#00ffcc] pl-2 bg-[#00ffcc]/10";
      case "WARNING":
        return "text-yellow-400 font-medium";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#0a0a0b] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">AI Insight Stream</h2>
        </div>
        <div className="text-[10px] text-gray-500 font-mono">LIVE_FEED_v1.0</div>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-[300px] overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar"
      >
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`p-2 rounded transition-all duration-300 hover:bg-white/5 ${getMessageStyle(insight.type)}`}
          >
            <div className="flex justify-between items-start gap-4">
              <span className="flex-1">{insight.message}</span>
              <span className="text-[10px] text-gray-600 whitespace-nowrap">{insight.timestamp}</span>
            </div>
            {insight.type === "REBALANCE" && (
              <div className="mt-1 flex items-center gap-1">
                <span className="w-3 h-[1px] bg-[#00ffcc]" />
                <span className="text-[9px] uppercase tracking-tighter opacity-80">Execution Confirmed</span>
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
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
