"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from "recharts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useVaultContext } from "@/contexts/VaultContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { simulateScenario, type ScenarioResult } from "@/lib/ai/simulateScenario";

interface RiskFactorInfo {
  label: string;
  description: string;
}

const RISK_FACTORS: Record<"fx" | "volatility", RiskFactorInfo> = {
  fx: {
    label: "FX Rate Shock",
    description:
      "A hypothetical, instantaneous move in the local currency's exchange rate against USD. Negative values simulate a devaluation — the scenario most relevant to holders of weak-currency stablecoins.",
  },
  volatility: {
    label: "Volatility Shock",
    description:
      "A hypothetical spike in market volatility above baseline. Higher volatility widens the range of likely outcomes and increases the AI strategy's incentive to shift capital toward stable reserves.",
  },
};

function InfoTooltip({ info }: { info: RiskFactorInfo }) {
  return (
    <Popover>
      <PopoverTrigger
        className="p-0.5 rounded hover:bg-muted transition-colors"
        aria-label={`What is ${info.label}?`}
      >
        <Info className="w-3.5 h-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="p-3 text-xs leading-relaxed">
        <p className="font-semibold mb-1">{info.label}</p>
        <p className="text-muted-foreground">{info.description}</p>
      </PopoverContent>
    </Popover>
  );
}

function Slider({
  label,
  info,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  info: RiskFactorInfo;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium">{label}</label>
          <InfoTooltip info={info} />
        </div>
        <span className="text-sm font-mono font-semibold text-primary">
          {value > 0 ? "+" : ""}
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary cursor-pointer"
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}

export default function SimulatePage() {
  const { baseBalance } = useVaultContext();
  const { formatAmount } = useCurrency();

  const [fxShockPercent, setFxShockPercent] = useState(-15);
  const [volatilityShockPercent, setVolatilityShockPercent] = useState(20);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const portfolioValueUsd = baseBalance;

  useEffect(() => {
    const controller = new AbortController();
    if (portfolioValueUsd <= 0) {
      setResult(null);
      setError("Portfolio value is unavailable; connect a wallet with a readable balance.");
      return () => controller.abort();
    }
    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      simulateScenario(
        { fxShockPercent, volatilityShockPercent, portfolioValueUsd },
        controller.signal,
      )
        .then(setResult)
        .catch((requestError: unknown) => {
          if (!controller.signal.aborted) setError(requestError instanceof Error ? requestError.message : "Simulation unavailable");
          setResult(null);
        })
        .finally(() => setIsLoading(false));
      // Debounced so dragging a slider doesn't fire a request per pixel.
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [fxShockPercent, volatilityShockPercent, portfolioValueUsd]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: "Without Aegis",
        value: result.withoutAegis.projectedValueUsd,
        fill: "hsl(var(--destructive))",
      },
      {
        name: "With Aegis",
        value: result.withAegis.projectedValueUsd,
        fill: "hsl(var(--primary))",
      },
    ];
  }, [result]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-1">Risk Scenario Simulator</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Simulate how your portfolio would react to a hypothetical FX shock — with and without
          Aegis&apos; automated hedging strategy.
        </p>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-6 mb-6">
          <Slider
            label="FX Rate Shock"
            info={RISK_FACTORS.fx}
            value={fxShockPercent}
            min={-50}
            max={50}
            onChange={setFxShockPercent}
          />
          <Slider
            label="Volatility Shock"
            info={RISK_FACTORS.volatility}
            value={volatilityShockPercent}
            min={0}
            max={50}
            onChange={setVolatilityShockPercent}
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Projected Portfolio Value
            </h2>
            {result && (
              <span className="text-[10px] font-mono text-muted-foreground/70">
                {result.source === "api" ? "AI_API" : "LOCAL_ESTIMATE"}
              </span>
            )}
          </div>

          {error ? (
            <div className="h-64 flex items-center justify-center text-center text-sm text-muted-foreground">{error}</div>
          ) : isLoading || !result ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => formatAmount(v)}
                      width={80}
                    />
                    <RechartsTooltip formatter={(v) => formatAmount(Number(v))} />
                    <Legend />
                    <Bar dataKey="value" name="Projected value">
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Without Aegis</p>
                  <p className="text-lg font-bold">{formatAmount(result.withoutAegis.projectedValueUsd)}</p>
                  <p
                    className={`text-xs font-medium ${
                      result.withoutAegis.changePercent < 0 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {result.withoutAegis.changePercent > 0 ? "+" : ""}
                    {result.withoutAegis.changePercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">With Aegis</p>
                  <p className="text-lg font-bold">{formatAmount(result.withAegis.projectedValueUsd)}</p>
                  <p
                    className={`text-xs font-medium ${
                      result.withAegis.changePercent < 0 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {result.withAegis.changePercent > 0 ? "+" : ""}
                    {result.withAegis.changePercent}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Under this scenario, the strategy would shift approximately{" "}
                <span className="font-semibold text-foreground">{result.strategyShiftPercent}%</span>{" "}
                of the portfolio toward hedges and stable reserves.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
