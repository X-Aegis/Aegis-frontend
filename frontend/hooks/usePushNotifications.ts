"use client";

import { useState, useEffect, useCallback } from "react";

const OPT_IN_KEY = "xaegis:push-opt-in";

export type PushPermission = "default" | "granted" | "denied" | "unsupported";

interface UsePushNotificationsResult {
  /** Whether the user has opted in, independent of browser permission state. */
  optedIn: boolean;
  permission: PushPermission;
  /** Requests permission (if needed), registers the SW, and opts in. */
  enable: () => Promise<void>;
  /** Opts out. Browser permission itself can't be revoked from script. */
  disable: () => void;
  /** Shows a notification via the registered SW if opted in and permitted. */
  showNotification: (title: string, body: string) => Promise<void>;
}

function isSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "Notification" in window;
}

export function usePushNotifications(): UsePushNotificationsResult {
  const [optedIn, setOptedIn] = useState(false);
  const [permission, setPermission] = useState<PushPermission>("default");

  useEffect(() => {
    if (!isSupported()) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as PushPermission);
    setOptedIn(localStorage.getItem(OPT_IN_KEY) === "true");
  }, []);

  const enable = useCallback(async () => {
    if (!isSupported()) return;

    let result = Notification.permission;
    if (result === "default") {
      result = await Notification.requestPermission();
    }
    setPermission(result as PushPermission);

    if (result !== "granted") return;

    await navigator.serviceWorker.register("/sw.js");
    localStorage.setItem(OPT_IN_KEY, "true");
    setOptedIn(true);
  }, []);

  const disable = useCallback(() => {
    localStorage.setItem(OPT_IN_KEY, "false");
    setOptedIn(false);
  }, []);

  const showNotification = useCallback(
    async (title: string, body: string) => {
      if (!isSupported() || !optedIn || permission !== "granted") return;
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, { body, icon: "/favicon.ico" });
    },
    [optedIn, permission]
  );

  return { optedIn, permission, enable, disable, showNotification };
}
