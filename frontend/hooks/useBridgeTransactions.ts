"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchBridgeTxStatus,
  generateBridgeTxId,
} from "@/lib/bridge/allbridge";
import type { BridgeChain, BridgeTransaction, BridgeTxStatus } from "@/types/bridge";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** How often to poll for status updates on pending/in_progress transactions (ms) */
const POLL_INTERVAL_MS = 12_000;

/** localStorage key for persisting bridge transactions across page reloads */
const STORAGE_KEY = "aegis_bridge_transactions";

/** Terminal statuses — transactions in these states are never re-polled */
const TERMINAL: Set<BridgeTxStatus> = new Set(["complete", "failed"]);

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadFromStorage(): BridgeTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BridgeTransaction[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(txs: BridgeTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
  } catch {
    // Storage write failures are non-fatal
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface AddTransactionParams {
  sourceChain: BridgeChain;
  destChain: BridgeChain;
  token: string;
  amount: string;
  receiveAmount: string;
  sourceTxHash: string;
}

interface UseBridgeTransactionsResult {
  transactions: BridgeTransaction[];
  /** Register a newly submitted bridge transaction for monitoring */
  addTransaction: (params: AddTransactionParams) => BridgeTransaction;
  /** Remove a single transaction from the monitor list */
  removeTransaction: (id: string) => void;
  /** Clear all completed / failed transactions */
  clearTerminal: () => void;
}

/**
 * Manages the local list of bridge transactions and polls Allbridge for
 * status updates on any that are not yet in a terminal state.
 */
export function useBridgeTransactions(): UseBridgeTransactionsResult {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>(
    loadFromStorage
  );

  // Keep storage in sync whenever the list changes
  useEffect(() => {
    saveToStorage(transactions);
  }, [transactions]);

  // -------------------------------------------------------------------------
  // Status polling
  // -------------------------------------------------------------------------

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollPending = useCallback(async () => {
    setTransactions((prev) => {
      // Identify transactions that still need polling
      const watchable = prev.filter((tx) => !TERMINAL.has(tx.status));
      if (watchable.length === 0) return prev;

      // Fire status checks in parallel (no await inside setState — schedule
      // them outside and update state when results arrive)
      Promise.all(
        watchable.map(async (tx) => {
          const result = await fetchBridgeTxStatus(
            tx.sourceChain,
            tx.sourceTxHash
          );
          return { id: tx.id, ...result };
        })
      ).then((updates) => {
        setTransactions((current) =>
          current.map((tx) => {
            const update = updates.find((u) => u.id === tx.id);
            if (!update) return tx;
            return {
              ...tx,
              status: update.status,
              destTxHash: update.destTxHash ?? tx.destTxHash,
              receivedAmount: update.receivedAmount ?? tx.receivedAmount,
              updatedAt: new Date().toISOString(),
            };
          })
        );
      });

      // Return prev unchanged — the inner .then() handles the real update
      return prev;
    });
  }, []);

  // Start / stop the poller based on whether watchable transactions exist
  useEffect(() => {
    const hasWatchable = transactions.some((tx) => !TERMINAL.has(tx.status));

    if (hasWatchable && !pollRef.current) {
      pollRef.current = setInterval(pollPending, POLL_INTERVAL_MS);
      // Kick off an immediate first poll
      pollPending();
    } else if (!hasWatchable && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [transactions, pollPending]);

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  const addTransaction = useCallback(
    ({
      sourceChain,
      destChain,
      token,
      amount,
      receiveAmount,
      sourceTxHash,
    }: AddTransactionParams): BridgeTransaction => {
      const now = new Date().toISOString();
      const tx: BridgeTransaction = {
        id: generateBridgeTxId(),
        sourceChain,
        destChain,
        token,
        amount,
        receiveAmount,
        sourceTxHash,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };
      setTransactions((prev) => [tx, ...prev]);
      return tx;
    },
    []
  );

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const clearTerminal = useCallback(() => {
    setTransactions((prev) => prev.filter((tx) => !TERMINAL.has(tx.status)));
  }, []);

  return { transactions, addTransaction, removeTransaction, clearTerminal };
}
