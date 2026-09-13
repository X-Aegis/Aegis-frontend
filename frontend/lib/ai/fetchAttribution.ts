const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL;

export type AttributionPeriod = "1W" | "1M" | "3M" | "All";

export interface AttributionSource {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface AttributionData {
  total: number;
  sources: AttributionSource[];
}

/**
 * Fetches portfolio yield breakdown from the backend AI API.
 *
 * Calls NEXT_PUBLIC_AI_API_URL/api/attribution. Missing backend data is
 * reported to the caller instead of being presented as financial data.
 */
export async function fetchAttribution(
  period: AttributionPeriod,
  signal?: AbortSignal,
): Promise<AttributionData> {
  if (!AI_API_URL) {
    throw new Error("AI attribution backend is not configured");
  }

  const res = await fetch(new URL(`/api/attribution?period=${period}`, AI_API_URL).toString(), { signal });
  if (!res.ok) {
    throw new Error(`Attribution data unavailable (${res.status})`);
  }
  const json = (await res.json()) as AttributionData;
  return { ...json, sources: normalizeSources(json.sources) };
}

function normalizeSources(sources: AttributionSource[]): AttributionSource[] {
  const total = sources.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return sources;
  return sources.map((s) => ({
    ...s,
    percentage: Math.round((s.value / total) * 10000) / 100,
  }));
}
