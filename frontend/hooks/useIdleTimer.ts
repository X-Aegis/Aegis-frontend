"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseIdleTimerOptions {
  /** Total inactivity allowed before onIdle fires, in ms. */
  timeout: number;
  /** Lead time before idle to fire onPrompt (warning), in ms. 0 disables the prompt. */
  promptBeforeIdle?: number;
  /** Fired when the full timeout elapses with no activity. */
  onIdle: () => void;
  /** Fired promptBeforeIdle ms before idle, so the UI can warn the user. */
  onPrompt?: () => void;
  /** Fired on the first activity after a prompt was shown, so the UI can dismiss the warning. */
  onActive?: () => void;
  /** When false, all timers/listeners are torn down. Default true. */
  enabled?: boolean;
  /** DOM events that count as activity. */
  events?: string[];
  /** localStorage key used to sync activity across tabs. */
  crossTabKey?: string;
  /** Minimum ms between activity-driven resets (throttle). Default 1000. */
  throttleMs?: number;
}

export interface IdleTimerControls {
  /** Manually mark activity and restart the countdown. */
  reset: () => void;
  /** Milliseconds remaining until idle (0 if already idle/disabled). */
  getRemaining: () => number;
}

const DEFAULT_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
];

export function useIdleTimer(options: UseIdleTimerOptions): IdleTimerControls {
  const {
    timeout,
    promptBeforeIdle = 0,
    onIdle,
    onPrompt,
    onActive,
    enabled = true,
    events = DEFAULT_EVENTS,
    crossTabKey,
    throttleMs = 1000,
  } = options;

  // Keep the latest callbacks in refs so the effect doesn't re-subscribe on every render.
  const onIdleRef = useRef(onIdle);
  const onPromptRef = useRef(onPrompt);
  const onActiveRef = useRef(onActive);
  useEffect(() => {
    onIdleRef.current = onIdle;
    onPromptRef.current = onPrompt;
    onActiveRef.current = onActive;
  }, [onIdle, onPrompt, onActive]);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiresAtRef = useRef<number>(0);
  const lastResetRef = useRef<number>(0);
  const promptShownRef = useRef<boolean>(false);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
    idleTimerRef.current = null;
    promptTimerRef.current = null;
  }, []);

  // schedule() arms the timers. `broadcast` controls whether we write to localStorage
  // (true for local activity, false when reacting to another tab to avoid a loop).
  const schedule = useRef<(broadcast: boolean) => void>(() => {});

  schedule.current = (broadcast: boolean) => {
    if (!enabled) return;
    clearTimers();

    if (promptShownRef.current) {
      promptShownRef.current = false;
      onActiveRef.current?.();
    }

    const now = Date.now();
    expiresAtRef.current = now + timeout;

    if (promptBeforeIdle > 0 && promptBeforeIdle < timeout) {
      promptTimerRef.current = setTimeout(() => {
        promptShownRef.current = true;
        onPromptRef.current?.();
      }, timeout - promptBeforeIdle);
    }

    idleTimerRef.current = setTimeout(() => {
      promptShownRef.current = false;
      onIdleRef.current();
    }, timeout);

    if (broadcast && crossTabKey && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(crossTabKey, String(now));
      } catch {
        // ignore storage failures (private mode, quota)
      }
    }
  };

  const reset = useCallback(() => {
    schedule.current(true);
  }, []);

  const getRemaining = useCallback(() => {
    if (!enabled) return 0;
    return Math.max(0, expiresAtRef.current - Date.now());
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      clearTimers();
      return;
    }

    schedule.current(false);

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastResetRef.current < throttleMs) return;
      lastResetRef.current = now;
      schedule.current(true);
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      // Reconcile after the tab was backgrounded: if we're past expiry, go idle now.
      if (Date.now() >= expiresAtRef.current) {
        clearTimers();
        promptShownRef.current = false;
        onIdleRef.current();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (!crossTabKey || event.key !== crossTabKey || event.newValue === null) return;
      // Another tab saw activity — restart our countdown without re-broadcasting.
      schedule.current(false);
    };

    for (const evt of events) {
      window.addEventListener(evt, handleActivity, { passive: true });
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("storage", handleStorage);

    return () => {
      for (const evt of events) {
        window.removeEventListener(evt, handleActivity);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, timeout, promptBeforeIdle, throttleMs, crossTabKey, events.join(",")]);

  return { reset, getRemaining };
}
