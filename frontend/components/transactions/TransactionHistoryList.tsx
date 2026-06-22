"use client";

import { ArrowDownUp, RefreshCw, Download } from "lucide-react";
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

  const handleExportCSV = () => {
    if (items.length === 0) return;
    
    const headers = ["ID", "Type", "Amount", "Asset", "Date", "Transaction Hash", "Account"];
    const csvRows = items.map(tx => [
      tx.id,
      tx.kind,
      tx.amount,
      tx.asset,
      new Date(tx.timestampISO).toLocaleString(),
      tx.txHash,
      tx.account || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transaction_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card border border-border p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="font-bold flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-primary" />
          Recent Transactions
        </h3>
        {!loading && !error && items.length > 0 && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCSV}
              className="text-xs sm:text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 flex items-center gap-2 transition-colors"
              aria-label="Download CSV"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              CSV
            </button>
            <button
              onClick={refresh}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Refresh transactions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
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
