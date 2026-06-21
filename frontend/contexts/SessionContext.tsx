"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFreighter } from "@/contexts/FreighterContext";
import { useIdleTimer } from "@/hooks/useIdleTimer";

/** Inactivity allowed before auto-logout. */
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
/** How long before logout to warn the user. */
const WARNING_BEFORE_MS = 60 * 1000; // 60 seconds
const CROSS_TAB_KEY = "aegis_last_activity";

interface SessionContextValue {
  /** True while the inactivity warning is showing. */
  isWarning: boolean;
  /** Seconds left before auto-logout while warning is active. */
  secondsRemaining: number;
  /** True right after an inactivity logout, until dismissed. */
  loggedOutByInactivity: boolean;
  /** Cancel the warning and keep the session alive. */
  stayConnected: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isConnected, disconnect } = useFreighter();
  const [isWarning, setIsWarning] = useState(false);
  const [loggedOutByInactivity, setLoggedOutByInactivity] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const handleIdle = useCallback(() => {
    stopCountdown();
    setIsWarning(false);
    disconnect();
    setLoggedOutByInactivity(true);
  }, [disconnect, stopCountdown]);

  const { reset, getRemaining } = useIdleTimer({
    timeout: IDLE_TIMEOUT_MS,
    promptBeforeIdle: WARNING_BEFORE_MS,
    enabled: isConnected,
    crossTabKey: CROSS_TAB_KEY,
    onIdle: handleIdle,
    onPrompt: () => {
      setSecondsRemaining(Math.ceil(WARNING_BEFORE_MS / 1000));
      setIsWarning(true);
    },
    onActive: () => {
      stopCountdown();
      setIsWarning(false);
    },
  });

  // Tick the warning countdown while the prompt is visible.
  useEffect(() => {
    if (!isWarning) {
      stopCountdown();
      return;
    }
    countdownRef.current = setInterval(() => {
      setSecondsRemaining(Math.max(0, Math.ceil(getRemaining() / 1000)));
    }, 1000);
    return stopCountdown;
  }, [isWarning, getRemaining, stopCountdown]);

  // Clear any lingering warning if the wallet disconnects by other means.
  useEffect(() => {
    if (!isConnected) {
      stopCountdown();
      setIsWarning(false);
    }
  }, [isConnected, stopCountdown]);

  const stayConnected = useCallback(() => {
    setIsWarning(false);
    stopCountdown();
    reset();
  }, [reset, stopCountdown]);

  return (
    <SessionContext.Provider
      value={{ isWarning, secondsRemaining, loggedOutByInactivity, stayConnected }}
    >
      {children}

      {isWarning && (
        <div
          role="alertdialog"
          aria-live="assertive"
          aria-label="Inactivity warning"
          className="fixed bottom-4 right-4 z-50 w-[min(92vw,22rem)] rounded-xl border border-amber-500/30 bg-white p-4 shadow-lg dark:bg-zinc-900"
        >
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Still there?
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You&apos;ll be signed out in {secondsRemaining}s due to inactivity.
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={stayConnected}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              Stay connected
            </button>
          </div>
        </div>
      )}

      {loggedOutByInactivity && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 w-[min(92vw,22rem)] rounded-xl border border-rose-500/30 bg-white p-4 shadow-lg dark:bg-zinc-900"
        >
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Signed out
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You were signed out due to inactivity. Reconnect your wallet to continue.
          </p>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setLoggedOutByInactivity(false)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
