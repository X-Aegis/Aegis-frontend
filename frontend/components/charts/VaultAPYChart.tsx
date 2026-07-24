"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useVaultData, Timeframe } from "../../hooks/useVaultData";

interface VaultAPYChartProps {
  vaultId: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-xl">
        <p className="text-sm font-medium text-muted-foreground">{formattedDate}</p>
        <p className="text-lg font-bold text-foreground">
          ${payload[0].value.toFixed(4)}
        </p>
      </div>
    );
  }
  return null;
};

export const VaultAPYChart = React.memo(function VaultAPYChart({ vaultId }: VaultAPYChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const { data, loading } = useVaultData(vaultId, timeframe);

  if (loading) {
    return (
      <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[400px] flex items-center justify-center bg-card/50 rounded-xl border border-border animate-pulse">
        <p className="text-muted-foreground">Loading historical data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[400px] p-4 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Vault Performance</h3>
          <p className="text-sm text-muted-foreground">Historical share price</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          {(["1D", "1W", "1M", "1Y"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === tf
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="text-left md:text-right">
          <span className="text-2xl font-bold text-primary">
            +{( ((data[data.length-1]?.price || 0) / (data[0]?.price || 1) - 1) * 100 ).toFixed(2)}%
          </span>
          <p className="text-xs text-muted-foreground tracking-wider uppercase">Period ROI</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="hsl(var(--muted-foreground))" 
            opacity={0.1} 
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            minTickGap={30}
            tickFormatter={(value) => {
              const date = new Date(value);
              if (timeframe === "1D") {
                return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
              } else if (timeframe === "1Y") {
                return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
              }
              return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
