'use client';

import React from 'react';

interface RiskChartProps {
  data?: { date: string; risk: number }[];
  height?: number;
}

const defaultMockData = [
  { time: '00:00', value: 30 },
  { time: '04:00', value: 45 },
  { time: '08:00', value: 25 },
  { time: '12:00', value: 60 },
  { time: '16:00', value: 40 },
  { time: '20:00', value: 55 },
  { time: '23:59', value: 42 },
];

export const RiskChart: React.FC<RiskChartProps> = ({ data: propData, height: propHeight }) => {
  const width = 400;
  const height = propHeight || 200;
  const padding = 40;

  const chartData = propData 
    ? propData.map(d => ({ time: d.date, value: d.risk })) 
    : defaultMockData;

  const maxVal = Math.max(...chartData.map(d => d.value));
  const minVal = 0;

  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d.value - minVal) / (maxVal - minVal)) * (height - padding * 2) - padding;
    return { x, y };
  });

  const pathData = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaData = pathData
    ? `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="bg-card/50 p-6 rounded-2xl border border-border backdrop-blur-sm">
      <h3 className="text-muted-foreground text-sm font-medium mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        AI Risk Forecast (24h)
      </h3>
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={i}
              x1={padding}
              y1={height - padding - p * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - p * (height - padding * 2)}
              stroke="currentColor"
              className="text-border/50"
              strokeWidth="0.5"
            />
          ))}

          {/* Area Fill */}
          <path
            d={areaData}
            fill="url(#riskGradient)"
            className="opacity-30"
          />

          {/* Line Path */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-primary stroke-background stroke-2"
            />
          ))}

          {/* Defs */}
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
