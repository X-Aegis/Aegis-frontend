const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL;

export interface ScenarioParams {
  /** Hypothetical FX rate shock, in percent. Negative = local currency devalues. */
  fxShockPercent: number;
  /** Hypothetical volatility shock, in percent above baseline. */
  volatilityShockPercent: number;
  /** Starting portfolio value in USD, used to project the shocked outcome. */
  portfolioValueUsd: number;
}

export interface ScenarioProjection {
  /** Projected portfolio value under the shock, in USD. */
  projectedValueUsd: number;
  /** Change from the current portfolio value, in percent. */
  changePercent: number;
}

export interface ScenarioResult {
  withoutAegis: ScenarioProjection;
  withAegis: ScenarioProjection;
  /** Share of the strategy shifted into hedges/stable reserves in response to the shock, in percent. */
  strategyShiftPercent: number;
  source: "api";
}

/**
 * Runs a "what-if" FX shock scenario against the current portfolio.
 *
 * Calls the backend AI API (NEXT_PUBLIC_AI_API_URL) when configured; falls
 * back to a deterministic local approximation otherwise or if the call
 * fails, mirroring the fallback pattern used for on-chain data elsewhere in
 * this app (e.g. StrategyAllocationPie, useOnChainNotifications).
 */
export async function simulateScenario(
  params: ScenarioParams,
  signal?: AbortSignal,
): Promise<ScenarioResult> {
  if (AI_API_URL) {
    const res = await fetch(new URL("/api/simulate", AI_API_URL).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal,
      });
    if (!res.ok) throw new Error(`Simulation unavailable (${res.status})`);
    return { ...((await res.json()) as Omit<ScenarioResult, "source">), source: "api" };
  }

  throw new Error("AI simulation backend is not configured");
}
