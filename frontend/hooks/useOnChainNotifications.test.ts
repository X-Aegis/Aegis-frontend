import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useOnChainNotifications } from "./useOnChainNotifications";
import type { IndexerEventRaw } from "@/types/transactions";

jest.mock("sonner", () => ({
  toast: { info: jest.fn() },
}));

const fetchRecentEvents = jest.fn<Promise<IndexerEventRaw[]>, any[]>();
jest.mock("@/lib/indexer/transactions", () => ({
  fetchRecentEvents: (...args: any[]) => fetchRecentEvents(...args),
}));

function makeRaw(id: string, eventType: string, timestamp: string): IndexerEventRaw {
  return {
    id,
    eventType,
    txHash: `0x${id}`,
    timestamp,
    amount: "10",
    asset: "USDC",
    account: "GABC",
  };
}

describe("useOnChainNotifications", () => {
  const ACCOUNT = "GABC";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_MERCURY_URL = "https://mercury.test";
    localStorage.clear();
    fetchRecentEvents.mockReset();
    (toast.info as jest.Mock).mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_MERCURY_URL;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not toast for events already present on first load", async () => {
    fetchRecentEvents.mockResolvedValue([
      makeRaw("a", "deposit", "2024-01-01T00:00:00.000Z"),
      makeRaw("b", "withdraw", "2024-01-02T00:00:00.000Z"),
    ]);

    const { result } = renderHook(() =>
      useOnChainNotifications({ account: ACCOUNT, pollIntervalMs: 60_000 })
    );

    await waitFor(() => expect(result.current.notifications).toHaveLength(2));

    expect(toast.info).not.toHaveBeenCalled();
    expect(result.current.unreadCount).toBe(0);
  });

  it("toasts and marks unread for events that show up after the first load", async () => {
    fetchRecentEvents.mockResolvedValueOnce([makeRaw("a", "deposit", "2024-01-01T00:00:00.000Z")]);

    const { result } = renderHook(() =>
      useOnChainNotifications({ account: ACCOUNT, pollIntervalMs: 1000 })
    );

    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    expect(toast.info).not.toHaveBeenCalled();

    fetchRecentEvents.mockResolvedValueOnce([
      makeRaw("a", "deposit", "2024-01-01T00:00:00.000Z"),
      makeRaw("b", "rebalance", "2024-01-02T00:00:00.000Z"),
    ]);

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.notifications).toHaveLength(2));
    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.notifications[0].id).toBe("b");
  });

  it("persists seen events across remounts so a reload doesn't re-toast", async () => {
    fetchRecentEvents.mockResolvedValue([makeRaw("a", "deposit", "2024-01-01T00:00:00.000Z")]);

    const first = renderHook(() =>
      useOnChainNotifications({ account: ACCOUNT, pollIntervalMs: 60_000 })
    );
    await waitFor(() => expect(first.result.current.notifications).toHaveLength(1));
    first.unmount();

    const second = renderHook(() =>
      useOnChainNotifications({ account: ACCOUNT, pollIntervalMs: 60_000 })
    );
    await waitFor(() => expect(second.result.current.notifications).toHaveLength(1));

    expect(toast.info).not.toHaveBeenCalled();
  });

  it("markAllRead clears unread count", async () => {
    fetchRecentEvents.mockResolvedValueOnce([makeRaw("a", "deposit", "2024-01-01T00:00:00.000Z")]);
    const { result } = renderHook(() =>
      useOnChainNotifications({ account: ACCOUNT, pollIntervalMs: 1000 })
    );
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));

    fetchRecentEvents.mockResolvedValueOnce([
      makeRaw("a", "deposit", "2024-01-01T00:00:00.000Z"),
      makeRaw("b", "withdraw", "2024-01-02T00:00:00.000Z"),
    ]);
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.unreadCount).toBe(1));

    act(() => result.current.markAllRead());
    expect(result.current.unreadCount).toBe(0);
  });
});
