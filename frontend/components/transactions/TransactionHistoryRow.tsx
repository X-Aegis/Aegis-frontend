"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { TransactionItem } from "@/types/transactions";

interface TransactionHistoryRowProps {
  tx: TransactionItem;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3_600_000);

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function shortenHash(hash: string): string {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function TransactionHistoryRow({ tx }: TransactionHistoryRowProps) {
  const isDeposit = tx.kind === "DEPOSIT";
  const Icon = isDeposit ? ArrowDownLeft : ArrowUpRight;
  const kindLabel = isDeposit ? "Deposit" : "Withdraw";
  const iconBg = isDeposit ? "bg-green-500/10" : "bg-red-500/10";
  const iconColor = isDeposit ? "text-green-500" : "text-red-500";
  const amountColor = isDeposit ? "text-green-500" : "text-red-400";
  const sign = isDeposit ? "+" : "−";

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{kindLabel}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          {shortenHash(tx.txHash)} &middot; {formatTimestamp(tx.timestampISO)}
        </p>
      </div>

      <p className={`text-sm font-bold tabular-nums whitespace-nowrap ${amountColor}`}>
        {sign}{formatAmount(tx.amount)} {tx.asset}
      </p>
    </div>
  );
}
