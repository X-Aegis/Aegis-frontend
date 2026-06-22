"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/** Fixed conversion factor: 1 USD = 1 600 NGN (update via env or API as needed). */
export const USD_TO_NGN_RATE = 1_600;

type Currency = "USD" | "NGN";

interface CurrencyContextValue {
  currency: Currency;
  toggleCurrency: () => void;
  /** Format a USD-denominated value into the active currency string. */
  formatAmount: (usdValue: number) => string;
  symbol: string;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  const toggleCurrency = useCallback(
    () => setCurrency((c) => (c === "USD" ? "NGN" : "USD")),
    [],
  );

  const symbol = currency === "USD" ? "$" : "₦";

  const formatAmount = useCallback(
    (usdValue: number): string => {
      const converted = currency === "NGN" ? usdValue * USD_TO_NGN_RATE : usdValue;
      return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(converted);
    },
    [currency],
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, toggleCurrency, formatAmount, symbol, rate: USD_TO_NGN_RATE }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
