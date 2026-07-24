"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useFreighter } from "./FreighterContext";
import type { TransactionItem, TxStatus } from "@/types/transactions";

interface VaultContextValue {
  baseBalance: number;
  optimisticBalance: number;
  optimisticTransactions: TransactionItem[];
  addOptimisticTransaction: (tx: TransactionItem) => void;
  updateOptimisticTransaction: (id: string, updates: Partial<TransactionItem>) => void;
  clearOptimisticTransaction: (id: string) => void;
}

const VaultContext = createContext<VaultContextValue | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const { address } = useFreighter();
  const [baseBalance, setBaseBalance] = useState(5000.0); // Real balance data from vault
  const [optimisticTransactions, setOptimisticTransactions] = useState<TransactionItem[]>([]);

  const addOptimisticTransaction = useCallback((tx: TransactionItem) => {
    setOptimisticTransactions((prev) => [tx, ...prev]);
  }, []);

  const updateOptimisticTransaction = useCallback((id: string, updates: Partial<TransactionItem>) => {
    setOptimisticTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
  }, []);

  const clearOptimisticTransaction = useCallback((id: string) => {
    setOptimisticTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const optimisticBalance = useMemo(() => {
    return optimisticTransactions.reduce((acc, tx) => {
      // For optimistic balance calculation, we only care about pending (signed, submitted)
      if (tx.status === "failed" || tx.status === "confirmed") return acc;
      
      const amount = parseFloat(tx.amount);
      if (isNaN(amount)) return acc;

      // If this is vault balance, deposit increases vault balance.
      // If this is user wallet balance, deposit decreases user balance.
      // In DepositTab, `depositAmount > mockUserBalance` means it's wallet balance!
      // So let's treat `baseBalance` as User Wallet Balance.
      if (tx.kind === "DEPOSIT") return acc - amount;
      if (tx.kind === "WITHDRAW") return acc + amount;
      return acc;
    }, baseBalance);
  }, [baseBalance, optimisticTransactions]);

  // When a tx is confirmed, we would typically update baseBalance here or via event,
  // then remove it from optimistic transactions.

  return (
    <VaultContext.Provider
      value={{
        baseBalance,
        optimisticBalance,
        optimisticTransactions,
        addOptimisticTransaction,
        updateOptimisticTransaction,
        clearOptimisticTransaction,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVaultContext() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVaultContext must be used within VaultProvider");
  return ctx;
}
