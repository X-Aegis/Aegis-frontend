'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RiskLevel = 'low' | 'medium' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const config = {
    low: {
      label: 'Low Risk',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      icon: ShieldCheck,
      glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
    },
    medium: {
      label: 'Medium Risk',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      icon: Info,
      glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]',
    },
    critical: {
      label: 'Critical Risk',
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      icon: ShieldAlert,
      glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]',
    },
  }[level];

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105",
      config.color,
      config.glow
    )}>
      <Icon size={14} className="animate-pulse" />
      {config.label}
    </div>
  );
};
