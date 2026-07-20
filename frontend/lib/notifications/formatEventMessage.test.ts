import { formatEventMessage } from "./formatEventMessage";
import type { TransactionItem } from "@/types/transactions";

function makeItem(overrides: Partial<TransactionItem> = {}): TransactionItem {
  return {
    id: "evt-1",
    kind: "DEPOSIT",
    txHash: "0xabc",
    timestampISO: "2024-01-01T00:00:00.000Z",
    amount: "120.5",
    asset: "USDC",
    account: "GABC",
    ...overrides,
  };
}

describe("formatEventMessage", () => {
  it("formats a deposit", () => {
    const result = formatEventMessage(makeItem({ kind: "DEPOSIT", amount: "120.5", asset: "USDC" }));
    expect(result.title).toBe("Deposit confirmed");
    expect(result.message).toContain("120.50 USDC");
    expect(result.message.toLowerCase()).toContain("deposited");
  });

  it("formats a withdrawal", () => {
    const result = formatEventMessage(makeItem({ kind: "WITHDRAW", amount: "50", asset: "XLM" }));
    expect(result.title).toBe("Withdrawal confirmed");
    expect(result.message).toContain("50.00 XLM");
    expect(result.message.toLowerCase()).toContain("withdrawn");
  });

  it("formats a rebalance", () => {
    const result = formatEventMessage(makeItem({ kind: "REBALANCE", amount: "500", asset: "USDC" }));
    expect(result.title).toBe("Vault rebalanced");
    expect(result.message).toContain("500.00 USDC");
    expect(result.message.toLowerCase()).toContain("rebalanced");
  });

  it("falls back to the raw amount string if it isn't parseable", () => {
    const result = formatEventMessage(makeItem({ kind: "DEPOSIT", amount: "not-a-number" }));
    expect(result.message).toContain("not-a-number");
  });
});
