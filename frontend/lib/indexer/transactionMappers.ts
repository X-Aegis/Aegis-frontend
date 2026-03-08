import type {
  IndexerEventRaw,
  TransactionItem,
  TransactionKind,
} from "@/types/transactions";

const DEPOSIT_TYPES = new Set(["deposit", "mint", "transfer_in"]);
const WITHDRAW_TYPES = new Set(["withdraw", "burn", "transfer_out"]);

export function isDepositEvent(raw: IndexerEventRaw): boolean {
  return DEPOSIT_TYPES.has(raw.eventType.toLowerCase());
}

export function isWithdrawEvent(raw: IndexerEventRaw): boolean {
  return WITHDRAW_TYPES.has(raw.eventType.toLowerCase());
}

function kindFromEvent(raw: IndexerEventRaw): TransactionKind | null {
  if (isDepositEvent(raw)) return "DEPOSIT";
  if (isWithdrawEvent(raw)) return "WITHDRAW";
  return null;
}

export function toTransactionItem(
  raw: IndexerEventRaw
): TransactionItem | null {
  const kind = kindFromEvent(raw);
  if (!kind) return null;

  return {
    id: raw.id,
    kind,
    txHash: raw.txHash,
    timestampISO: raw.timestamp,
    amount: raw.amount,
    asset: raw.asset,
    account: raw.account,
  };
}

export function normalizeAndSort(events: IndexerEventRaw[]): TransactionItem[] {
  return events
    .map(toTransactionItem)
    .filter((item): item is TransactionItem => item !== null)
    .sort(
      (a, b) =>
        new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime()
    );
}
