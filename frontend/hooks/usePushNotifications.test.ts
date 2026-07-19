import { renderHook, act, waitFor } from "@testing-library/react";
import { usePushNotifications } from "./usePushNotifications";

describe("usePushNotifications", () => {
  let requestPermission: jest.Mock;
  let register: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    requestPermission = jest.fn().mockResolvedValue("granted");
    register = jest.fn().mockResolvedValue({});

    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: { permission: "default", requestPermission },
    });
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register, ready: Promise.resolve({ showNotification: jest.fn() }) },
    });
  });

  it("starts opted out with default permission", async () => {
    const { result } = renderHook(() => usePushNotifications());
    await waitFor(() => expect(result.current.permission).toBe("default"));
    expect(result.current.optedIn).toBe(false);
  });

  it("enable() requests permission, registers the service worker, and opts in", async () => {
    const { result } = renderHook(() => usePushNotifications());
    await waitFor(() => expect(result.current.permission).toBe("default"));

    await act(async () => {
      await result.current.enable();
    });

    expect(requestPermission).toHaveBeenCalled();
    expect(register).toHaveBeenCalledWith("/sw.js");
    expect(result.current.optedIn).toBe(true);
    expect(result.current.permission).toBe("granted");
    expect(localStorage.getItem("xaegis:push-opt-in")).toBe("true");
  });

  it("does not opt in if permission is denied", async () => {
    requestPermission.mockResolvedValue("denied");
    const { result } = renderHook(() => usePushNotifications());
    await waitFor(() => expect(result.current.permission).toBe("default"));

    await act(async () => {
      await result.current.enable();
    });

    expect(register).not.toHaveBeenCalled();
    expect(result.current.optedIn).toBe(false);
    expect(result.current.permission).toBe("denied");
  });

  it("disable() opts out without touching browser permission", async () => {
    const { result } = renderHook(() => usePushNotifications());
    await waitFor(() => expect(result.current.permission).toBe("default"));

    await act(async () => {
      await result.current.enable();
    });
    expect(result.current.optedIn).toBe(true);

    act(() => result.current.disable());
    expect(result.current.optedIn).toBe(false);
    expect(localStorage.getItem("xaegis:push-opt-in")).toBe("false");
  });

  it("showNotification is a no-op when not opted in", async () => {
    const { result } = renderHook(() => usePushNotifications());
    await waitFor(() => expect(result.current.permission).toBe("default"));

    const registration = await navigator.serviceWorker.ready;
    await act(async () => {
      await result.current.showNotification("title", "body");
    });

    expect((registration as any).showNotification).not.toHaveBeenCalled();
  });

  it("showNotification calls through to the service worker once opted in", async () => {
    const { result } = renderHook(() => usePushNotifications());
    await waitFor(() => expect(result.current.permission).toBe("default"));

    await act(async () => {
      await result.current.enable();
    });

    const registration = await navigator.serviceWorker.ready;
    await act(async () => {
      await result.current.showNotification("New deposit", "120 USDC");
    });

    expect((registration as any).showNotification).toHaveBeenCalledWith(
      "New deposit",
      expect.objectContaining({ body: "120 USDC" })
    );
  });
});
