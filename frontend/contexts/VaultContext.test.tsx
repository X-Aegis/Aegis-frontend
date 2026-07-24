import { renderHook, act } from "@testing-library/react";
import React from "react";
import { VaultProvider, useVaultContext } from "./VaultContext";
import { FreighterProvider } from "./FreighterContext";
// Mock FreighterContext
jest.mock("./FreighterContext", () => ({
  FreighterProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFreighter: () => ({
    address: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV",
    isConnected: true,
  }),
}));

describe("VaultContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FreighterProvider>
      <VaultProvider>{children}</VaultProvider>
    </FreighterProvider>
  );

  it("calculates optimistic balance correctly for deposits", () => {
    const { result } = renderHook(() => useVaultContext(), { wrapper });

    expect(result.current.baseBalance).toBe(5000);
    expect(result.current.optimisticBalance).toBe(5000);

    act(() => {
      result.current.addOptimisticTransaction({
        id: "tx1",
        kind: "DEPOSIT",
        txHash: "tx1",
        timestampISO: new Date().toISOString(),
        amount: "100",
        asset: "USDC",
        status: "submitted",
      });
    });

    // 5000 - 100 = 4900 (because deposit takes from wallet balance)
    expect(result.current.optimisticBalance).toBe(4900);
  });

  it("calculates optimistic balance correctly for withdrawals", () => {
    const { result } = renderHook(() => useVaultContext(), { wrapper });

    act(() => {
      result.current.addOptimisticTransaction({
        id: "tx2",
        kind: "WITHDRAW",
        txHash: "tx2",
        timestampISO: new Date().toISOString(),
        amount: "200",
        asset: "USDC",
        status: "submitted",
      });
    });

    // 5000 + 200 = 5200
    expect(result.current.optimisticBalance).toBe(5200);
  });

  it("reconciles when transaction is confirmed (pessimistic update ignored in optimistic balance)", () => {
    const { result } = renderHook(() => useVaultContext(), { wrapper });

    act(() => {
      result.current.addOptimisticTransaction({
        id: "tx3",
        kind: "DEPOSIT",
        txHash: "tx3",
        timestampISO: new Date().toISOString(),
        amount: "50",
        asset: "USDC",
        status: "submitted",
      });
    });

    expect(result.current.optimisticBalance).toBe(4950);

    // Confirm it
    act(() => {
      result.current.updateOptimisticTransaction("tx3", { status: "confirmed" });
    });

    // When confirmed, it is no longer counted in the optimistic diff,
    // so it falls back to baseBalance (which would be updated separately).
    expect(result.current.optimisticBalance).toBe(5000);
  });

  it("reconciles when transaction fails", () => {
    const { result } = renderHook(() => useVaultContext(), { wrapper });

    act(() => {
      result.current.addOptimisticTransaction({
        id: "tx4",
        kind: "WITHDRAW",
        txHash: "tx4",
        timestampISO: new Date().toISOString(),
        amount: "500",
        asset: "USDC",
        status: "submitted",
      });
    });

    expect(result.current.optimisticBalance).toBe(5500);

    // Fail it
    act(() => {
      result.current.updateOptimisticTransaction("tx4", { status: "failed" });
    });

    // Failed tx should not affect balance
    expect(result.current.optimisticBalance).toBe(5000);
  });
});
