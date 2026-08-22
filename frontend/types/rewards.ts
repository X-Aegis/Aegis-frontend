export type RewardStatus = "pending" | "claimed";

export interface RewardEntry {
  id: string;
  source: string;
  /** String representation; parse only for display formatting */
  amount: string;
  asset: string;
  status: RewardStatus;
  dateISO: string;
}

export interface RewardSummaryData {
  totalPending: number;
  totalClaimed: number;
  entries: RewardEntry[];
}
