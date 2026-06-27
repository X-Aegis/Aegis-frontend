"use client";

import React from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import type { ConnectionState as ConnState } from "@/hooks/useRealtimeVault";

export interface ConnectionStatusProps {
  state: ConnState;
  lastMessageAt?: Date | null;
  className?: string;
}

const STATUS_CONFIG: Record<ConnState, { icon: React.ReactNode; label: string; color: string }> = {
  connected: {
    icon: <Wifi className="w-3.5 h-3.5" />,
    label: "Live",
    color: "text-green-500",
  },
  connecting: {
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: "Connecting",
    color: "text-yellow-500",
  },
  reconnecting: {
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: "Reconnecting",
    color: "text-yellow-500",
  },
  offline: {
    icon: <WifiOff className="w-3.5 h-3.5" />,
    label: "Offline",
    color: "text-muted-foreground",
  },
};

function formatLastSeen(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 5000) return "Just now";
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  state,
  lastMessageAt,
  className = "",
}) => {
  const config = STATUS_CONFIG[state];

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color} ${className}`}
      title={`WebSocket: ${config.label}${lastMessageAt ? ` · Last update: ${formatLastSeen(lastMessageAt)}` : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Connection ${config.label}`}
    >
      <span className="flex items-center">{config.icon}</span>
      <span className="hidden sm:inline">{config.label}</span>
      {state === "connected" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      )}
    </div>
  );
};
