"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchBridgeQuote } from "@/lib/bridge/allbridge";
import type { BridgeChain, BridgeQuote } from "@/types/bridge";

/** Debounce delay before firing a quote request (ms) */
const DEBOUNCE_MS = 500;

interface UseBridgeQuoteOptions {
  sourceChain: BridgeChain;
  destChain: BridgeChain;
  token: string;
  amount: string;
}

interface UseBridgeQuoteResult {
  quote: BridgeQuote | null;
  loading: boolean;
  error: string | null;
  /** Manually re-request the latest quote */
  refresh: () => void;
}

/**
 * Fetches a bridge quote from the Allbridge client, debounced by DEBOUNCE_MS.
 * Returns null while amount is empty / non-positive or chains are identical.
 */
export function useBridgeQuote({
  sourceChain,
  destChain,
  token,
  amount,
}: UseBridgeQuoteOptions): UseBridgeQuoteResult {
  const [quote, setQuote] = useState<BridgeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track the latest request so stale responses are ignored
  const requestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchQuote = useCallback(async () => {
    const amountNum = parseFloat(amount);
    if (
      !token ||
      isNaN(amountNum) ||
      amountNum <= 0 ||
      sourceChain === destChain
    ) {
      setQuote(null);
      setLoading(false);
      setError(null);
      return;
    }

    const thisId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchBridgeQuote({
        sourceChain,
        destChain,
        token,
        amount,
      });

      // Discard if a newer request has since been issued
      if (thisId !== requestIdRef.current) return;

      setQuote(result);
    } catch (err) {
      if (thisId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : "Failed to fetch quote");
      setQuote(null);
    } finally {
      if (thisId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [sourceChain, destChain, token, amount]);

  // Debounce on every input change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchQuote, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchQuote]);

  return { quote, loading, error, refresh: fetchQuote };
}
