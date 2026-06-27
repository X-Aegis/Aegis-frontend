"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type ConnectionState = "connecting" | "connected" | "reconnecting" | "offline";

export interface VaultUpdate {
  vaultId: string;
  apy: number;
  tvl: number;
  timestamp: string;
}

export interface UseRealtimeVaultOptions {
  vaultId: string;
  wsUrl?: string;
  enabled?: boolean;
  reconnectDelayMs?: number;
  maxReconnectDelayMs?: number;
}

export interface UseRealtimeVaultResult {
  data: VaultUpdate | null;
  connectionState: ConnectionState;
  lastMessageAt: Date | null;
  reconnectAttempts: number;
  subscribe: () => void;
  unsubscribe: () => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.x-aegis.app/vault/stream";
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const BACKOFF_MULTIPLIER = 2;

export function useRealtimeVault({
  vaultId,
  wsUrl = WS_URL,
  enabled = true,
  reconnectDelayMs = INITIAL_RECONNECT_DELAY,
  maxReconnectDelayMs = MAX_RECONNECT_DELAY,
}: UseRealtimeVaultOptions): UseRealtimeVaultResult {
  const [data, setData] = useState<VaultUpdate | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [lastMessageAt, setLastMessageAt] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const activeRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      if (
        wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close(1000, "Client disconnect");
      }
      wsRef.current = null;
    }
  }, [clearTimers]);

  const connect = useCallback(
    (attempt: number) => {
      if (!mountedRef.current || !activeRef.current) return;

      disconnect();

      const isReconnect = attempt > 0;
      if (isReconnect) {
        setConnectionState("reconnecting");
      } else {
        setConnectionState("connecting");
      }

      try {
        const ws = new WebSocket(`${wsUrl}?vaultId=${encodeURIComponent(vaultId)}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!mountedRef.current) return;
          setConnectionState("connected");
          setReconnectAttempts(0);
        };

        ws.onmessage = (event) => {
          if (!mountedRef.current) return;
          try {
            const update = JSON.parse(event.data) as VaultUpdate;
            setData(update);
            setLastMessageAt(new Date());
          } catch {
            // Ignore malformed messages
          }
        };

        ws.onerror = () => {
          // onclose will fire after onerror — reconnect there
        };

        ws.onclose = (event) => {
          if (!mountedRef.current || !activeRef.current) return;

          // Clean close — don't reconnect
          if (event.code === 1000) {
            setConnectionState("offline");
            return;
          }

          // Calculate exponential backoff delay
          const nextAttempt = isReconnect ? attempt + 1 : 1;
          const delay = Math.min(
            reconnectDelayMs * Math.pow(BACKOFF_MULTIPLIER, nextAttempt - 1),
            maxReconnectDelayMs
          );

          setConnectionState("reconnecting");
          setReconnectAttempts(nextAttempt);

          reconnectTimerRef.current = setTimeout(() => {
            connect(nextAttempt);
          }, delay);
        };
      } catch {
        // WebSocket constructor can throw in some environments
        if (mountedRef.current && activeRef.current) {
          const nextAttempt = isReconnect ? attempt + 1 : 1;
          setReconnectAttempts(nextAttempt);
          setConnectionState("offline");
        }
      }
    },
    [vaultId, wsUrl, reconnectDelayMs, maxReconnectDelayMs, disconnect]
  );

  const subscribe = useCallback(() => {
    activeRef.current = true;
    connect(0);
  }, [connect]);

  const unsubscribe = useCallback(() => {
    activeRef.current = false;
    disconnect();
    setConnectionState("offline");
  }, [disconnect]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      subscribe();
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [enabled, subscribe, unsubscribe]);

  return {
    data,
    connectionState,
    lastMessageAt,
    reconnectAttempts,
    subscribe,
    unsubscribe,
  };
}
