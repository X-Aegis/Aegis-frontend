"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Gift, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { fetchRewardSummary } from "@/lib/rewards/fetchRewards";
import type { RewardSummaryData } from "@/types/rewards";

function formatUsd(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function RewardSummary() {
  const [data, setData] = useState<RewardSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRewardSummary(signal);
      setData(result);
    } catch {
      setError("Failed to load reward data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary" />
          <CardTitle className="text-lg">Reward Distribution</CardTitle>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Refresh reward data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="min-h-[180px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading rewards...</p>
          </div>
        ) : error || !data ? (
          <div className="min-h-[180px] flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button type="button" onClick={() => load()} className="text-sm text-primary hover:underline">
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  Pending
                </div>
                <p className="text-2xl font-black text-yellow-500">{formatUsd(data.totalPending)}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Claimed
                </div>
                <p className="text-2xl font-black text-green-500">{formatUsd(data.totalClaimed)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.entries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No rewards yet.</p>
              ) : (
                data.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center gap-2 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{entry.source}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{formatDate(entry.dateISO)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">
                        {entry.amount} {entry.asset}
                      </p>
                      <p
                        className={`text-[10px] uppercase font-bold ${
                          entry.status === "pending" ? "text-yellow-500" : "text-green-500"
                        }`}
                      >
                        {entry.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
