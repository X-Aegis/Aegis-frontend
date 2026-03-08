export type TransactionKind = "DEPOSIT" | "WITHDRAW";

export interface IndexerEventRaw {
  id: string;
  eventType: string;
  txHash: string;
  timestamp: string;
  /** Keep as string to avoid floating-point precision loss */
  amount: string;
  asset: string;
  account: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionItem {
  id: string;
  kind: TransactionKind;
  txHash: string;
  timestampISO: string;
  /** String representation; parse only for display formatting */
  amount: string;
  asset: string;
  account?: string;
}

export interface TransactionHistoryState {
  items: TransactionItem[];
  loading: boolean;
  error: string | null;
  lastUpdated?: string;
}
