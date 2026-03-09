"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  IndexerEventRaw,
  TransactionItem,
} from "@/types/transactions";
import { normalizeAndSort } from "@/lib/indexer/transactionMappers";

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
        setItems(normalizeAndSort(events));
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [account, limit]);

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  return { items, loading, error, refresh };
}

function generateMockEvents(count: number): IndexerEventRaw[] {
  const assets = ["USDC", "XLM", "EURC"];
  const kinds: Array<{ eventType: string }> = [
    { eventType: "deposit" },
    { eventType: "withdraw" },
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
