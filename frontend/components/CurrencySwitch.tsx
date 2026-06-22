"use client";

import { useCurrency } from "@/contexts/CurrencyContext";

export function CurrencySwitch() {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      onClick={toggleCurrency}
      aria-label={`Switch to ${currency === "USD" ? "NGN" : "USD"}`}
      className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-xs font-bold transition-colors select-none"
    >
      <span className={currency === "USD" ? "text-foreground" : "text-muted-foreground"}>
        USD
      </span>
      <span className="text-muted-foreground mx-0.5">/</span>
      <span className={currency === "NGN" ? "text-foreground" : "text-muted-foreground"}>
        NGN
      </span>
    </button>
  );
}
