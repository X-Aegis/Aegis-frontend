import {
  isDepositEvent,
  isWithdrawEvent,
  isRebalanceEvent,
  toTransactionItem,
  normalizeAndSort,
} from "./transactionMappers";
import type { IndexerEventRaw } from "@/types/transactions";

function makeRaw(overrides: Partial<IndexerEventRaw> = {}): IndexerEventRaw {
  return {
    id: "evt-1",
    eventType: "deposit",
    txHash: "0xabc",
    timestamp: "2024-01-01T00:00:00.000Z",
    amount: "100",
    asset: "USDC",
    account: "GABC",
    ...overrides,
  };
}

describe("event type detection", () => {
  it("recognizes deposit-like event types", () => {
    expect(isDepositEvent(makeRaw({ eventType: "deposit" }))).toBe(true);
    expect(isDepositEvent(makeRaw({ eventType: "MINT" }))).toBe(true);
    expect(isDepositEvent(makeRaw({ eventType: "transfer_in" }))).toBe(true);
    expect(isDepositEvent(makeRaw({ eventType: "rebalance" }))).toBe(false);
  });

  it("recognizes withdraw-like event types", () => {
    expect(isWithdrawEvent(makeRaw({ eventType: "withdraw" }))).toBe(true);
    expect(isWithdrawEvent(makeRaw({ eventType: "BURN" }))).toBe(true);
    expect(isWithdrawEvent(makeRaw({ eventType: "transfer_out" }))).toBe(true);
    expect(isWithdrawEvent(makeRaw({ eventType: "deposit" }))).toBe(false);
  });

  it("recognizes rebalance-like event types", () => {
    expect(isRebalanceEvent(makeRaw({ eventType: "rebalance" }))).toBe(true);
    expect(isRebalanceEvent(makeRaw({ eventType: "REALLOCATE" }))).toBe(true);
    expect(isRebalanceEvent(makeRaw({ eventType: "strategy_rebalance" }))).toBe(true);
    expect(isRebalanceEvent(makeRaw({ eventType: "deposit" }))).toBe(false);
  });
});

describe("toTransactionItem", () => {
  it("maps a rebalance event to the REBALANCE kind", () => {
    const item = toTransactionItem(makeRaw({ eventType: "rebalance" }));
    expect(item?.kind).toBe("REBALANCE");
  });

  it("returns null for an unrecognized event type", () => {
    expect(toTransactionItem(makeRaw({ eventType: "something_else" }))).toBeNull();
  });
});

describe("normalizeAndSort", () => {
  it("drops unrecognized events and sorts recognized ones newest first", () => {
    const events = [
      makeRaw({ id: "a", eventType: "deposit", timestamp: "2024-01-01T00:00:00.000Z" }),
      makeRaw({ id: "b", eventType: "unknown_type", timestamp: "2024-01-03T00:00:00.000Z" }),
      makeRaw({ id: "c", eventType: "rebalance", timestamp: "2024-01-02T00:00:00.000Z" }),
    ];

    const result = normalizeAndSort(events);
    expect(result.map((e) => e.id)).toEqual(["c", "a"]);
  });
});
