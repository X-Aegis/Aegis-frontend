"use client";

import { ExternalLink, Loader2, CheckCircle2, XCircle, Clock, ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildExplorerUrl, BRIDGE_CHAINS } from "@/lib/bridge/allbridge";
import type { BridgeTransaction, BridgeTxStatus } from "@/types/bridge";

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  className: string;
}

function getStatusConfig(status: BridgeTxStatus): StatusConfig {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        icon: <Clock className="h-3.5 w-3.5" />,
        className: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
      };
    case "in_progress":
      return {
        label: "In Progress",
        icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
        className: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
      };
    case "complete":
      return {
        label: "Complete",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
      };
    case "failed":
      return {
        label: "Failed",
        icon: <XCircle className="h-3.5 w-3.5" />,
        className: "text-destructive bg-destructive/10 border-destructive/20",
      };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function truncateHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BridgeTransactionRowProps {
  tx: BridgeTransaction;
  onRemove: (id: string) => void;
}

export function BridgeTransactionRow({ tx, onRemove }: BridgeTransactionRowProps) {
  const status = getStatusConfig(tx.status);
  const srcChain = BRIDGE_CHAINS[tx.sourceChain];
  const dstChain = BRIDGE_CHAINS[tx.destChain];
  const isTerminal = tx.status === "complete" || tx.status === "failed";

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 transition-colors",
        tx.status === "complete" && "border-emerald-500/20 bg-emerald-500/5",
        tx.status === "failed" && "border-destructive/20 bg-destructive/5",
        tx.status === "pending" && "border-amber-500/20 bg-amber-500/5",
        tx.status === "in_progress" && "border-blue-500/20 bg-blue-500/5"
      )}
      role="listitem"
      aria-label={`Bridge transaction: ${tx.amount} ${tx.token} from ${srcChain.label} to ${dstChain.label}, status: ${status.label}`}
    >
      {/* Top row: route + status + remove */}
      <div className="flex items-center justify-between gap-3">
        {/* Route */}
        <div className="flex items-center gap-2 text-sm font-medium min-w-0">
          <span className="shrink-0 text-foreground">{srcChain.label}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="shrink-0 text-foreground">{dstChain.label}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
              status.className
            )}
            aria-live="polite"
          >
            {status.icon}
            {status.label}
          </span>

          {/* Remove button — only for terminal transactions */}
          {isTerminal && (
            <button
              type="button"
              onClick={() => onRemove(tx.id)}
              className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Remove transaction"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Amount row */}
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <div>
          <span className="font-semibold text-foreground">{tx.amount}</span>
          <span className="ml-1 text-muted-foreground">{tx.token}</span>
          <span className="mx-1.5 text-muted-foreground">→</span>
          <span className="font-semibold text-foreground">{tx.receiveAmount}</span>
          <span className="ml-1 text-muted-foreground">{tx.token}</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {formatRelativeTime(tx.createdAt)}
        </span>
      </div>

      {/* TX hash links */}
      <div className="flex flex-wrap gap-3 text-xs">
        <a
          href={buildExplorerUrl(tx.sourceChain, tx.sourceTxHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          aria-label={`View source transaction on ${srcChain.label} explorer`}
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Source: {truncateHash(tx.sourceTxHash)}
        </a>

        {tx.destTxHash && (
          <a
            href={buildExplorerUrl(tx.destChain, tx.destTxHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label={`View destination transaction on ${dstChain.label} explorer`}
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            Destination: {truncateHash(tx.destTxHash)}
          </a>
        )}
      </div>
    </div>
  );
}
