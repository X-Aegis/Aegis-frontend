"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Award, CheckCircle2, Clock, Coins, Gift, ArrowUpRight, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface RewardItem {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: "pending" | "claimed" | "expired";
  type: "referral" | "yield" | "bonus" | "shield";
}

const MOCK_REWARDS: RewardItem[] = [
  {
    id: "1",
    description: "Referral reward — 0x742...4f2",
    amount: "$12.50",
    date: "2026-07-28",
    status: "claimed",
    type: "referral",
  },
  {
    id: "2",
    description: "Yield distribution — USDC Savings Vault",
    amount: "$8.20",
    date: "2026-07-25",
    status: "claimed",
    type: "yield",
  },
  {
    id: "3",
    description: "Shield performance bonus — Aegis Guard",
    amount: "$25.00",
    date: "2026-07-30",
    status: "pending",
    type: "shield",
  },
  {
    id: "4",
    description: "Referral reward — 0x98c...3d5",
    amount: "$5.00",
    date: "2026-07-22",
    status: "pending",
    type: "referral",
  },
  {
    id: "5",
    description: "Milestone bonus — 10 referrals",
    amount: "$50.00",
    date: "2026-08-01",
    status: "pending",
    type: "bonus",
  },
  {
    id: "6",
    description: "Yield distribution — Growth Index Vault",
    amount: "$15.30",
    date: "2026-07-18",
    status: "claimed",
    type: "yield",
  },
];

const TYPE_ICONS: Record<RewardItem["type"], typeof Gift> = {
  referral: Gift,
  yield: Coins,
  bonus: Award,
  shield: Award,
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  claimed: {
    label: "Claimed",
    icon: CheckCircle2,
    className: "text-green-500 bg-green-500/10 border-green-500/20",
  },
  expired: {
    label: "Expired",
    icon: Clock,
    className: "text-muted-foreground bg-muted/50 border-border",
  },
} as const;

export function RewardSummary() {
  const t = useTranslations("RewardsPage");
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetch
    const timer = setTimeout(() => {
      setRewards(MOCK_REWARDS);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const totalRewards = rewards.reduce((sum, r) => {
    const amount = parseFloat(r.amount.replace(/[$,]/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const pendingRewards = rewards
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => {
      const amount = parseFloat(r.amount.replace(/[$,]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  const claimedRewards = rewards
    .filter((r) => r.status === "claimed")
    .reduce((sum, r) => {
      const amount = parseFloat(r.amount.replace(/[$,]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-card border border-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t("totalRewards")}
            </p>
            <CardTitle className="text-2xl font-black">
              ${totalRewards.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>{rewards.length} {t("totalItems")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t("pendingRewards")}
            </p>
            <CardTitle className="text-2xl font-black text-yellow-500">
              ${pendingRewards.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-yellow-500" />
              <span>
                {rewards.filter((r) => r.status === "pending").length}{" "}
                {t("pendingItems")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t("claimedRewards")}
            </p>
            <CardTitle className="text-2xl font-black text-green-500">
              ${claimedRewards.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span>
                {rewards.filter((r) => r.status === "claimed").length}{" "}
                {t("claimedItems")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            {t("rewardHistory")}
          </CardTitle>
          <CardDescription>{t("rewardHistoryDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {rewards.map((reward) => {
              const StatusIcon = STATUS_CONFIG[reward.status].icon;
              const TypeIcon = TYPE_ICONS[reward.type];

              return (
                <div
                  key={reward.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl p-3 sm:p-4 transition-colors",
                    "hover:bg-muted/50",
                    reward.status === "pending" && "bg-yellow-500/[0.02]"
                  )}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <TypeIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {reward.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reward.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold">{reward.amount}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                          STATUS_CONFIG[reward.status].className
                        )}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {STATUS_CONFIG[reward.status].label}
                      </span>
                    </div>
                    {reward.status === "pending" && (
                      <Button
                        variant="outline"
                        size="xs"
                        className="hidden sm:flex gap-1"
                      >
                        {t("claim")}
                        <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Claim All CTA */}
      {rewards.some((r) => r.status === "pending") && (
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="font-bold text-sm">
                {t("claimAllTitle", { amount: `$${pendingRewards.toFixed(2)}` })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("claimAllDesc")}
              </p>
            </div>
          </div>
          <Button size="sm" className="shrink-0">
            {t("claimAll")}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}