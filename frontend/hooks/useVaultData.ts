"use client";

import { useState, useEffect } from "react";

export interface ChartDataPoint {
  date: string;
  price: number;
}

export function useVaultData(vaultId: string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const mockData: ChartDataPoint[] = generateMockData();
      setData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [vaultId]);

  return { data, loading };
}

function generateMockData(): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  const now = new Date();
  
  // Create 30 days of historical data
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Simulate a growing price with some volatility
    const basePrice = 1.0;
    const growth = (30 - i) * 0.005; // 0.5% growth per day
    const volatility = (Math.random() - 0.4) * 0.02; // Small random fluctuation
    
    points.push({
      date: d.toISOString().split('T')[0],
      price: parseFloat((basePrice + growth + volatility).toFixed(4)),
    });
  }
  
  return points;
}
