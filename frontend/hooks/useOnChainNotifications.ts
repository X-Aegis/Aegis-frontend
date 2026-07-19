"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import type { IndexerEventRaw, TransactionKind } from "@/types/transactions";
import { normalizeAndSort } from "@/lib/indexer/transactionMappers";
import { formatEventMessage } from "@/lib/notifications/formatEventMessage";
import { generateMockEvents } from "@/hooks/useTransactionHistory";

export interface NotificationEntry {
  id: string;
  kind: TransactionKind;
  title: string;
  message: string;
  timestampISO: string;
  read: boolean;
}

interface UseOnChainNotificationsOptions {
  account?: string | null;
  pollIntervalMs?: number;
  limit?: number;
  onNewEntries?: (entries: NotificationEntry[]) => void;
}

interface UseOnChainNotificationsResult {
  notifications: NotificationEntry[];
  unreadCount: number;
  markAllRead: () => void;
  clear: () => void;
}

const MAX_STORED = 50;

function seenKey(account: string) {
  return `xaegis:notifications:seen:${account}`;
}
function listKey(account: string) {
  return `xaegis:notifications:list:${account}`;
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — notifications still work for this session
  }
}

/**
 * Polls the indexer for new on-chain events for the connected account,
 * turns anything not seen before into a NotificationEntry, and toasts it.
 * Seen event ids and the notification list are persisted per-account so a
 * reload doesn't replay history as if it just happened, and doesn't lose
 * what was already surfaced.
 */
export function useOnChainNotifications({
  account,
  pollIntervalMs = 15_000,
  limit = 20,
  onNewEntries,
}: UseOnChainNotificationsOptions): UseOnChainNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    seenIdsRef.current = new Set();
    setNotifications([]);
    if (!account) return;

    const storedSeen = readJSON<string[]>(seenKey(account));
    if (storedSeen) seenIdsRef.current = new Set(storedSeen);
    const storedList = readJSON<NotificationEntry[]>(listKey(account));
    if (storedList) setNotifications(storedList);
  }, [account]);

  const persist = useCallback((acct: string, list: NotificationEntry[]) => {
    writeJSON(seenKey(acct), [...seenIdsRef.current]);
    writeJSON(listKey(acct), list.slice(0, MAX_STORED));
  }, []);

  const poll = useCallback(async () => {
    if (!account) return;

    let raw: IndexerEventRaw[];
    try {
      if (process.env.NEXT_PUBLIC_MERCURY_URL) {
        const { fetchRecentEvents } = await import("@/lib/indexer/transactions");
        raw = await fetchRecentEvents({ account, limit });
      } else {
        raw = generateMockEvents(limit);
      }
    } catch {
      return; // transient fetch failure — the next interval tries again
    }

    const events = normalizeAndSort(raw);
    const isFirstLoad = !initializedRef.current;
    initializedRef.current = true;

    const fresh = events.filter((e) => !seenIdsRef.current.has(e.id));
    if (fresh.length === 0) return;
    fresh.forEach((e) => seenIdsRef.current.add(e.id));

    // On first load, mark as already-read — otherwise every reload would
    // dump the account's whole event history into the notification list as
    // if it all just happened.
    const entries: NotificationEntry[] = fresh.map((e) => {
      const { title, message } = formatEventMessage(e);
      return {
        id: e.id,
        kind: e.kind,
        title,
        message,
        timestampISO: e.timestampISO,
        read: isFirstLoad,
      };
    });

    setNotifications((prev) => {
      const next = [...entries, ...prev].slice(0, MAX_STORED);
      persist(account, next);
      return next;
    });

    if (!isFirstLoad) {
      entries.forEach((entry) => {
        toast.info(entry.title, { description: entry.message });
      });
      onNewEntries?.(entries);
    }
  }, [account, limit, persist, onNewEntries]);

  useEffect(() => {
    if (!account) return;
    poll();
    const interval = setInterval(poll, pollIntervalMs);
    return () => clearInterval(interval);
  }, [account, pollIntervalMs, poll]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      if (account) persist(account, next);
      return next;
    });
  }, [account, persist]);

  const clear = useCallback(() => {
    setNotifications([]);
    if (account) persist(account, []);
  }, [account, persist]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, clear };
}
