"use client";

import { Activity, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BridgeTransactionRow } from "./BridgeTransactionRow";
import type { BridgeTransaction } from "@/types/bridge";

interface BridgeTransactionMonitorProps {
  transactions: BridgeTransaction[];
  onRemove: (id: string) => void;
  onClearTerminal: () => void;
}

export function BridgeTransactionMonitor({
  transactions,
  onRemove,
  onClearTerminal,
}: BridgeTransactionMonitorProps) {
  const hasTerminal = transactions.some(
    (tx) => tx.status === "complete" || tx.status === "failed"
  );
  const activeCount = transactions.filter(
    (tx) => tx.status === "pending" || tx.status === "in_progress"
  ).length;

  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            Bridge Monitor
            {activeCount > 0 && (
              <span
                className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground"
                aria-label={`${activeCount} active transaction${activeCount !== 1 ? "s" : ""}`}
              >
                {activeCount}
              </span>
            )}
          </CardTitle>

          {hasTerminal && (
            <button
              type="button"
              onClick={onClearTerminal}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear completed and failed transactions"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
              Clear done
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No bridge transactions yet.</p>
            <p className="text-xs text-muted-foreground/70">
              Submitted transfers will appear here and update in real time.
            </p>
          </div>
        ) : (
          <div
            role="list"
            aria-label="Bridge transactions"
            className="flex flex-col gap-3"
          >
            {transactions.map((tx) => (
              <BridgeTransactionRow key={tx.id} tx={tx} onRemove={onRemove} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
