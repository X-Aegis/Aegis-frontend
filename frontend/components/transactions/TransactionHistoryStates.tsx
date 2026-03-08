"use client";

import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-primary/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-primary/10" />
            <div className="h-2 w-36 rounded bg-primary/5" />
          </div>
          <div className="h-4 w-16 rounded bg-primary/10" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Inbox className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
      <p className="text-sm text-muted-foreground">
        No deposits or withdrawals yet.
      </p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
      <AlertCircle className="w-8 h-8 text-red-500 opacity-80" />
      <p className="text-sm text-red-400 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}
