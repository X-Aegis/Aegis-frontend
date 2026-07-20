"use client";

import { useState, useCallback, useId } from "react";
import { ArrowDownUp, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BRIDGE_CHAINS, BRIDGE_TOKENS } from "@/lib/bridge/allbridge";
import { useBridgeQuote } from "@/hooks/useBridgeQuote";
import { useFreighter } from "@/contexts/FreighterContext";
import type { BridgeChain } from "@/types/bridge";
import type { AddTransactionParams } from "@/hooks/useBridgeTransactions";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ChainSelectProps {
  id: string;
  label: string;
  value: BridgeChain;
  onChange: (v: BridgeChain) => void;
  exclude?: BridgeChain;
  disabled?: boolean;
}

function ChainSelect({ id, label, value, onChange, exclude, disabled }: ChainSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as BridgeChain)}
        disabled={disabled}
        className={cn(
          "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30"
        )}
        aria-label={`Select ${label.toLowerCase()} chain`}
      >
        {(Object.keys(BRIDGE_CHAINS) as BridgeChain[]).map((chain) => (
          <option key={chain} value={chain} disabled={chain === exclude}>
            {BRIDGE_CHAINS[chain].label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TokenSelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  sourceChain: BridgeChain;
  disabled?: boolean;
}

function TokenSelect({ id, value, onChange, sourceChain, disabled }: TokenSelectProps) {
  // Show only tokens that exist on the selected source chain
  const available = BRIDGE_TOKENS.filter(
    (t) => t.addressByChain[sourceChain] !== undefined
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Token
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || available.length === 0}
        className={cn(
          "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30"
        )}
        aria-label="Select token to bridge"
      >
        {available.length === 0 ? (
          <option value="">No tokens available</option>
        ) : (
          available.map((t) => (
            <option key={t.symbol} value={t.symbol}>
              {t.symbol} — {t.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quote display
// ---------------------------------------------------------------------------

function QuoteDisplay({
  loading,
  error,
  receiveAmount,
  bridgeFee,
  relayFeeUsd,
  estimatedSeconds,
  liquidityAvailable,
  token,
}: {
  loading: boolean;
  error: string | null;
  receiveAmount: string | null;
  bridgeFee: string | null;
  relayFeeUsd: string | null;
  estimatedSeconds: number | null;
  liquidityAvailable: boolean | null;
  token: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground" aria-live="polite" aria-busy="true">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Fetching quote…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive" role="alert">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {error}
      </div>
    );
  }

  if (!receiveAmount) return null;

  const mins = Math.ceil((estimatedSeconds ?? 60) / 60);

  return (
    <div
      className="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-sm"
      aria-label="Bridge quote details"
      aria-live="polite"
    >
      <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Quote received
      </div>
      <div className="space-y-1.5 text-xs">
        {[
          { label: "You receive", value: `${receiveAmount} ${token}` },
          { label: "Bridge fee", value: `${bridgeFee} ${token}` },
          { label: "Relay fee", value: `~$${relayFeeUsd}` },
          { label: "Est. time", value: `~${mins} min${mins !== 1 ? "s" : ""}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value}</span>
          </div>
        ))}
        {liquidityAvailable === false && (
          <div className="mt-1 flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            Insufficient liquidity — transfer may be delayed
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main form
// ---------------------------------------------------------------------------

export interface BridgeFormProps {
  /** Called when the user submits a valid bridge transfer */
  onSubmit: (params: AddTransactionParams) => void;
  disabled?: boolean;
}

export function BridgeForm({ onSubmit, disabled = false }: BridgeFormProps) {
  const uid = useId();
  const { address, isConnected, connect, isLoading: walletLoading } = useFreighter();

  const [sourceChain, setSourceChain] = useState<BridgeChain>("ethereum");
  const [destChain, setDestChain] = useState<BridgeChain>("stellar");
  const [token, setToken] = useState<string>("USDC");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { quote, loading: quoteLoading, error: quoteError } = useBridgeQuote({
    sourceChain,
    destChain,
    token,
    amount,
  });

  // Swap source ↔ destination
  const handleSwapChains = useCallback(() => {
    setSourceChain(destChain);
    setDestChain(sourceChain);
  }, [sourceChain, destChain]);

  // When source chain changes, reset token if no longer available
  const handleSourceChainChange = useCallback((chain: BridgeChain) => {
    setSourceChain(chain);
    const available = BRIDGE_TOKENS.filter(
      (t) => t.addressByChain[chain] !== undefined
    );
    if (available.length > 0 && !available.find((t) => t.symbol === token)) {
      setToken(available[0].symbol);
    }
  }, [token]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isConnected) {
        await connect();
        return;
      }

      if (!quote) {
        toast.error("No quote available. Please wait for a quote.");
        return;
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        toast.warning("Please enter a valid amount.");
        return;
      }

      if (sourceChain === destChain) {
        toast.warning("Source and destination chains must be different.");
        return;
      }

      setSubmitting(true);

      try {
        // In a real integration the wallet signs & broadcasts the source-chain
        // transaction here and returns the hash. We simulate it so the UI
        // remains fully functional without a live wallet or contract.
        await new Promise((r) => setTimeout(r, 1200));

        const mockTxHash =
          `0x${Date.now().toString(16)}${"abcdef1234567890".repeat(3)}`.slice(0, 66);

        onSubmit({
          sourceChain,
          destChain,
          token,
          amount,
          receiveAmount: quote.receiveAmount,
          sourceTxHash: mockTxHash,
        });

        toast.success("Bridge transaction submitted!", {
          description: `Bridging ${amount} ${token} from ${BRIDGE_CHAINS[sourceChain].label} → ${BRIDGE_CHAINS[destChain].label}`,
        });

        setAmount("");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Transaction failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [isConnected, connect, quote, amount, sourceChain, destChain, token, onSubmit]
  );

  const isFormDisabled = disabled || submitting;
  const canSubmit =
    isConnected &&
    !!quote &&
    !quoteLoading &&
    parseFloat(amount) > 0 &&
    sourceChain !== destChain;

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Bridge transfer form"
      className="space-y-5"
      noValidate
    >
      {/* Chain selectors */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <ChainSelect
            id={`${uid}-source`}
            label="From"
            value={sourceChain}
            onChange={handleSourceChainChange}
            exclude={destChain}
            disabled={isFormDisabled}
          />
        </div>

        <button
          type="button"
          onClick={handleSwapChains}
          disabled={isFormDisabled}
          className={cn(
            "mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-input transition-colors",
            "hover:bg-muted hover:border-ring",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          aria-label="Swap source and destination chains"
        >
          <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex-1">
          <ChainSelect
            id={`${uid}-dest`}
            label="To"
            value={destChain}
            onChange={setDestChain}
            exclude={sourceChain}
            disabled={isFormDisabled}
          />
        </div>
      </div>

      {/* Token selector */}
      <TokenSelect
        id={`${uid}-token`}
        value={token}
        onChange={setToken}
        sourceChain={sourceChain}
        disabled={isFormDisabled}
      />

      {/* Amount input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${uid}-amount`}
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Amount
        </label>
        <input
          id={`${uid}-amount`}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isFormDisabled}
          aria-describedby={`${uid}-amount-hint`}
          className={cn(
            "h-12 w-full rounded-lg border border-input bg-transparent px-3 text-lg font-semibold transition-colors outline-none",
            "placeholder:text-muted-foreground placeholder:font-normal",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-input/30"
          )}
        />
        <p id={`${uid}-amount-hint`} className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3 w-3" aria-hidden="true" />
          Enter the amount of {token} to bridge
        </p>
      </div>

      {/* Quote */}
      <QuoteDisplay
        loading={quoteLoading}
        error={quoteError}
        receiveAmount={quote?.receiveAmount ?? null}
        bridgeFee={quote?.bridgeFee ?? null}
        relayFeeUsd={quote?.relayFeeUsd ?? null}
        estimatedSeconds={quote?.estimatedSeconds ?? null}
        liquidityAvailable={quote?.liquidityAvailable ?? null}
        token={token}
      />

      {/* Same-chain warning */}
      {sourceChain === destChain && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-400" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Source and destination chain must be different.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isConnected ? (!canSubmit || isFormDisabled) : walletLoading}
        className={cn(
          "w-full rounded-lg py-3 px-4 text-sm font-semibold transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isConnected
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
        aria-busy={submitting || walletLoading}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </span>
        ) : walletLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Connecting wallet…
          </span>
        ) : !isConnected ? (
          "Connect Wallet"
        ) : (
          `Bridge ${amount || "0"} ${token}`
        )}
      </button>

      {/* Connected wallet hint */}
      {isConnected && address && (
        <p className="text-center text-xs text-muted-foreground">
          Connected:{" "}
          <span className="font-mono">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </p>
      )}
    </form>
  );
}
