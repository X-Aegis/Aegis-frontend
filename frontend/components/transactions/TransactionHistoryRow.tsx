"use client";

import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import type { TransactionItem, TransactionKind } from "@/types/transactions";
import { formatRelativeTime } from "@/lib/utils";

const KIND_STYLE: Record<
  TransactionKind,
  { Icon: typeof ArrowDownLeft; label: string; iconBg: string; iconColor: string; amountColor: string; sign: string }
> = {
  DEPOSIT: {
    Icon: ArrowDownLeft,
    label: "Deposit",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    amountColor: "text-green-500",
    sign: "+",
  },
  WITHDRAW: {
    Icon: ArrowUpRight,
    label: "Withdraw",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    amountColor: "text-red-400",
    sign: "−",
  },
  REBALANCE: {
    Icon: RefreshCw,
    label: "Rebalance",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    amountColor: "text-muted-foreground",
    sign: "",
  },
};

interface TransactionHistoryRowProps {
  tx: TransactionItem;
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
  const { Icon, label, iconBg, iconColor, amountColor, sign } = KIND_STYLE[tx.kind];

  const showTimeline = tx.status && tx.status !== "confirmed" && tx.status !== "failed";

  return (
    <div className="flex flex-col border-b border-border last:border-0 py-2.5">
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold leading-tight">{label}</p>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
            {shortenHash(tx.txHash)} &middot; {formatRelativeTime(tx.timestampISO)}
          </p>
        </div>

        <p className={`text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${amountColor}`}>
          {sign}{formatAmount(tx.amount)} {tx.asset}
        </p>
      </div>
      
      {showTimeline && (
        <div className="mt-2 ml-10 flex items-center gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${tx.status === "signed" || tx.status === "submitted" ? "bg-emerald-500" : "bg-muted"}`} />
            <span className={`ml-1 ${tx.status === "signed" || tx.status === "submitted" ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>Signed</span>
          </div>
          <div className={`flex-1 h-px ${tx.status === "submitted" ? "bg-emerald-500" : "bg-muted"}`} />
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${tx.status === "submitted" ? "bg-emerald-500" : "bg-muted"}`} />
            <span className={`ml-1 ${tx.status === "submitted" ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>Submitted</span>
          </div>
          <div className="flex-1 h-px bg-muted" />
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <span className="ml-1 text-muted-foreground">Confirmed</span>
          </div>
        </div>
      )}
    </div>
  );
}
