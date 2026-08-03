"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Gift, Award, HelpCircle, TrendingUp } from "lucide-react";
import { RewardSummary } from "@/components/RewardSummary";

export default function RewardsPage() {
  const t = useTranslations("RewardsPage");

  const focusVisibleClass =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Back to dashboard"
              className={`p-2 hover:bg-accent rounded-full transition-colors ${focusVisibleClass}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">{t("title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Award className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                {t("heading")}
              </h1>
              <p className="text-muted-foreground">{t("subheading")}</p>
            </div>
            <RewardSummary />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 pt-12">
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                {t("howItWorksTitle")}
              </h3>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="font-bold">{t("step1Title")}</p>
                  <p className="text-muted-foreground">{t("step1Desc")}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold">{t("step2Title")}</p>
                  <p className="text-muted-foreground">{t("step2Desc")}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold">{t("step3Title")}</p>
                  <p className="text-muted-foreground">{t("step3Desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl relative overflow-hidden">
              <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/10 -rotate-12" />
              <h3 className="font-bold mb-2 text-primary">
                {t("bonusTitle")}
              </h3>
              <p className="text-sm mb-4 relative z-10">
                {t("bonusDesc")}
              </p>
              <div className="w-full bg-muted rounded-full h-2 mb-2 relative z-10">
                <div className="bg-primary h-full rounded-full" style={{ width: "20%" }} />
              </div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                {t("bonusProgress")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}