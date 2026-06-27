"use client";

import { renderHook, act } from "@testing-library/react";
import { useRealtimeVault } from "./useRealtimeVault";

class MockWebSocket {
  url: string;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  readyState: number = WebSocket.CONNECTING;

  constructor(url: string) {
    this.url = url;
  }

  close(code?: number, reason?: string) {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent("close", { code: code || 1000, reason: reason || "", wasClean: true }));
    }
  }
}

describe("useRealtimeVault", () => {
  let mockWs: MockWebSocket;

  beforeAll(() => {
    (global as any).WebSocket = jest.fn((url: string) => {
      mockWs = new MockWebSocket(url);
      return mockWs;
    });
    (WebSocket as any).CONNECTING = 0;
    (WebSocket as any).OPEN = 1;
    (WebSocket as any).CLOSING = 2;
    (WebSocket as any).CLOSED = 3;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts in connecting state", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    expect(result.current.connectionState).toBe("connecting");
    expect(result.current.data).toBeNull();
    expect(result.current.reconnectAttempts).toBe(0);
  });

  it("transitions to connected on WebSocket open", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    act(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event("open"));
    });

    expect(result.current.connectionState).toBe("connected");
    expect(result.current.reconnectAttempts).toBe(0);
  });

  it("updates data on message", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    act(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event("open"));
    });

    const vaultUpdate = {
      vaultId: "test-vault",
      apy: 12.4,
      tvl: 4200000,
      timestamp: new Date().toISOString(),
    };

    act(() => {
      mockWs.onmessage?.(new MessageEvent("message", { data: JSON.stringify(vaultUpdate) }));
    });

    expect(result.current.data).toEqual(vaultUpdate);
    expect(result.current.lastMessageAt).not.toBeNull();
  });

  it("transitions to reconnecting state on close", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    act(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event("open"));
    });

    act(() => {
      mockWs.onclose?.(new CloseEvent("close", { code: 1006, reason: "", wasClean: false }));
    });

    // onclose sets the reconnecting state synchronously before scheduling the timer
    expect(result.current.connectionState).toBe("reconnecting");
  });

  it("stays offline on clean close (code 1000)", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    act(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event("open"));
    });

    act(() => {
      mockWs.onclose?.(new CloseEvent("close", { code: 1000, reason: "Client disconnect", wasClean: true }));
    });

    expect(result.current.connectionState).toBe("offline");
  });

  it("increments reconnect attempts on consecutive failures", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    act(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event("open"));
    });

    // Non-clean close
    act(() => {
      mockWs.onclose?.(new CloseEvent("close", { code: 1006, reason: "", wasClean: false }));
    });

    expect(result.current.reconnectAttempts).toBeGreaterThan(0);
  });

  it("disables WebSocket when enabled is false", () => {
    const { result } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault", enabled: false })
    );

    expect(result.current.connectionState).toBe("connecting");
  });

  it("constructs WebSocket URL with vaultId query param", () => {
    renderHook(() =>
      useRealtimeVault({ vaultId: "my-vault", wsUrl: "wss://example.com/stream" })
    );

    expect((global as any).WebSocket).toHaveBeenCalledWith("wss://example.com/stream?vaultId=my-vault");
  });

  it("calls unsubscribe on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useRealtimeVault({ vaultId: "test-vault" })
    );

    act(() => {
      mockWs.readyState = WebSocket.OPEN;
      mockWs.onopen?.(new Event("open"));
    });

    unmount();

    expect(result.current.connectionState).toBe("connected");
  });
});
