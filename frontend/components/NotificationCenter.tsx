"use client";

import { Bell, ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { useFreighter } from "@/contexts/FreighterContext";
import { useOnChainNotifications, type NotificationEntry } from "@/hooks/useOnChainNotifications";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { formatRelativeTime } from "@/lib/utils";
import type { TransactionKind } from "@/types/transactions";

const KIND_ICON: Record<TransactionKind, typeof Bell> = {
  DEPOSIT: ArrowDownLeft,
  WITHDRAW: ArrowUpRight,
  REBALANCE: RefreshCw,
};

function NotificationRow({ entry }: { entry: NotificationEntry }) {
  const Icon = KIND_ICON[entry.kind];
  return (
    <div
      className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border last:border-0 ${
        entry.read ? "" : "bg-primary/5"
      }`}
    >
      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight">{entry.title}</p>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{entry.message}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">
          {formatRelativeTime(entry.timestampISO)}
        </p>
      </div>
      {!entry.read && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" aria-hidden="true" />
      )}
    </div>
  );
}

export function NotificationCenter() {
  const { address } = useFreighter();
  const { notifications, unreadCount, markAllRead } = useOnChainNotifications({
    account: address,
  });

  return (
    <Popover>
      <PopoverTrigger
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        onClick={() => {
          if (unreadCount > 0) markAllRead();
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="max-h-[400px] overflow-hidden flex flex-col">
        <div className="px-3 py-2.5 border-b border-border">
          <p className="text-sm font-bold">Notifications</p>
        </div>

        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8 px-3">
              No notifications yet
            </p>
          ) : (
            notifications.map((entry) => <NotificationRow key={entry.id} entry={entry} />)
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
