import type { RewardEntry, RewardSummaryData } from "@/types/rewards";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const MOCK_ENTRIES: RewardEntry[] = [
  { id: "1", source: "USDC Savings Vault", amount: "18.42", asset: "USDC", status: "pending", dateISO: "2024-03-10T00:00:00.000Z" },
  { id: "2", source: "Growth Index Vault", amount: "32.10", asset: "USDC", status: "pending", dateISO: "2024-03-08T00:00:00.000Z" },
  { id: "3", source: "Referral Bonus", amount: "12.50", asset: "USDC", status: "claimed", dateISO: "2024-03-01T00:00:00.000Z" },
  { id: "4", source: "Governance Staking", amount: "6.75", asset: "USDC", status: "claimed", dateISO: "2024-02-22T00:00:00.000Z" },
  { id: "5", source: "USDC Savings Vault", amount: "9.30", asset: "USDC", status: "claimed", dateISO: "2024-02-15T00:00:00.000Z" },
];

function summarize(entries: RewardEntry[]): RewardSummaryData {
  const normalized = entries.map((entry) => ({
    ...entry,
    amount: (Number.parseFloat(entry.amount) || 0).toFixed(2),
  }));

  const totals = normalized.reduce(
    (acc, entry) => {
      const value = Number.parseFloat(entry.amount);
      if (entry.status === "pending") {
        acc.totalPending += value;
      } else {
        acc.totalClaimed += value;
      }
      return acc;
    },
    { totalPending: 0, totalClaimed: 0 },
  );

  return { ...totals, entries: normalized };
}

/**
 * Fetches the user's reward distribution breakdown from the backend.
 *
 * Calls NEXT_PUBLIC_BACKEND_URL/rewards/summary when configured; falls back
 * to local mock data otherwise or on failure.
 */
export async function fetchRewardSummary(signal?: AbortSignal): Promise<RewardSummaryData> {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/rewards/summary`, { signal });
      if (res.ok) {
        const json = (await res.json()) as { entries: RewardEntry[] };
        return summarize(json.entries);
      }
    } catch {
      // Fall through to local mock
    }
  }

  return summarize(MOCK_ENTRIES);
}
