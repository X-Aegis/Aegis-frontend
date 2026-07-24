"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type {
  IndexerEventRaw,
  TransactionItem,
} from "@/types/transactions";
import { normalizeAndSort } from "@/lib/indexer/transactionMappers";
import { useVaultContext } from "@/contexts/VaultContext";

const MERCURY_URL = process.env.NEXT_PUBLIC_MERCURY_URL;

interface UseTransactionHistoryOptions {
  account?: string | null;
  limit?: number;
}

export function useTransactionHistory({
  account,
  limit = 20,
}: UseTransactionHistoryOptions = {}) {
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { optimisticTransactions, updateOptimisticTransaction } = useVaultContext();

  const refresh = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      let events: IndexerEventRaw[];

      if (MERCURY_URL) {
        const { fetchRecentEvents } = await import(
          "@/lib/indexer/transactions"
        );
        events = await fetchRecentEvents({
          account: account ?? undefined,
          limit,
          signal: controller.signal,
        });
      } else {
        await new Promise((r) => setTimeout(r, 800));
        events = generateMockEvents(limit);
      }

      if (!controller.signal.aborted) {
        // Find if any optimistic tx is now confirmed in the events
        const newItems = normalizeAndSort(events);
        newItems.forEach((item) => {
          const opt = optimisticTransactions.find(t => t.id === item.id);
          if (opt && opt.status !== "confirmed") {
            updateOptimisticTransaction(opt.id, { status: "confirmed" });
          }
        });
        setItems(newItems);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [account, limit, optimisticTransactions, updateOptimisticTransaction]);

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  // Merge optimistic transactions with fetched items
  const mergedItems = useMemo(() => {
    const all = [...optimisticTransactions, ...items];
    // deduplicate by id, preferring optimistic ones because they have the "status" field we need
    const map = new Map<string, TransactionItem>();
    
    items.forEach(item => map.set(item.id, item));
    optimisticTransactions.forEach(item => {
      // If it exists in items, it means it's confirmed, but we want the optimistic version 
      // if it has newer status, or we just want to ensure we don't show duplicates.
      if (map.has(item.id)) {
        const existing = map.get(item.id)!;
        map.set(item.id, { ...existing, status: item.status });
      } else {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values()).sort((a, b) => 
      new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime()
    );
  }, [items, optimisticTransactions]);

  return { items: mergedItems, loading, error, refresh };
}

export function generateMockEvents(count: number): IndexerEventRaw[] {
  const assets = ["USDC", "XLM", "EURC"];
  const kinds: Array<{ eventType: string }> = [
    { eventType: "deposit" },
    { eventType: "withdraw" },
    { eventType: "rebalance" },
  ];

  const events: IndexerEventRaw[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const kind = kinds[i % kinds.length];
    const asset = assets[i % assets.length];
    const hoursAgo = i * 4 + Math.floor(i * 1.7);
    const amount = (50 + ((i * 137 + 42) % 950)).toFixed(2);

    events.push({
      id: `mock-${i}`,
      eventType: kind.eventType,
      txHash: `0x${i.toString(16).padStart(8, "0")}${"a]b1c2d3".repeat(7).slice(0, 56)}`,
      timestamp: new Date(now - hoursAgo * 3_600_000).toISOString(),
      amount,
      asset,
      account: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV",
    });
  }

  return events;
}
