"use client";

import { ArrowDownUp, RefreshCw } from "lucide-react";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useFreighter } from "@/contexts/FreighterContext";
import { TransactionHistoryRow } from "./TransactionHistoryRow";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "./TransactionHistoryStates";

export function TransactionHistoryList() {
  const { address } = useFreighter();
  const { items, loading, error, refresh } = useTransactionHistory({
    account: address,
  });

  return (
    <div className="bg-card border border-border p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-primary" />
          Recent Transactions
        </h3>
        {!loading && !error && items.length > 0 && (
          <button
            onClick={refresh}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Refresh transactions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && items.length === 0 && <EmptyState />}
      {!loading && !error && items.length > 0 && (
        <div>
          {items.map((tx) => (
            <TransactionHistoryRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
