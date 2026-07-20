// Minimal service worker for opt-in local notifications on vault events
// (Deposit, Withdraw, Rebalance). There's no push server behind this yet —
// notifications are shown via `registration.showNotification()`, called by
// the client when it detects a new event, not via a real Push API payload.
// The `push` handler below is a no-op placeholder for when that exists.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", () => {
  // No backend push service is wired up yet. Once one exists, parse
  // event.data here and call self.registration.showNotification(...).
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => "focus" in c);
      if (existing) return existing.focus();
      return self.clients.openWindow("/");
    })
  );
});
