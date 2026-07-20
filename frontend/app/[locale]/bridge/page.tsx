"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, ArrowLeftRight, Shield, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { NetworkSwitch } from "@/components/NetworkSwitch";
import { BridgeForm } from "@/components/BridgeForm";
import { BridgeTransactionMonitor } from "@/components/bridge/BridgeTransactionMonitor";
import { useBridgeTransactions } from "@/hooks/useBridgeTransactions";
import type { AddTransactionParams } from "@/hooks/useBridgeTransactions";

export default function BridgePage() {
  const t = useTranslations("BridgePage");
  const { transactions, addTransaction, removeTransaction, clearTerminal } =
    useBridgeTransactions();

  const handleBridgeSubmit = (params: AddTransactionParams) => {
    addTransaction(params);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t("backToDashboard")}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">{t("back")}</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ArrowLeftRight className="text-primary w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">{t("title")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <CurrencySwitch />
            <div className="hidden sm:block">
              <NetworkSwitch />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-grow">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <ArrowLeftRight className="w-7 h-7 text-primary" aria-hidden="true" />
            {t("heading")}
          </h1>
          <p className="text-muted-foreground max-w-xl">{t("subheading")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: form + info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bridge form card */}
            <Card>
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ArrowLeftRight className="h-4 w-4 text-primary" aria-hidden="true" />
                  {t("formTitle")}
                </CardTitle>
                <CardDescription>{t("formDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <BridgeForm onSubmit={handleBridgeSubmit} />
              </CardContent>
            </Card>

            {/* Info card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  <Info className="h-4 w-4" aria-hidden="true" />
                  {t("howItWorksTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[
                  { step: "1", title: t("step1Title"), desc: t("step1Desc") },
                  { step: "2", title: t("step2Title"), desc: t("step2Desc") },
                  { step: "3", title: t("step3Title"), desc: t("step3Desc") },
                  { step: "4", title: t("step4Title"), desc: t("step4Desc") },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                      aria-hidden="true"
                    >
                      {step}
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Powered-by badge */}
            <div className="flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              {t("poweredBy")}
            </div>
          </div>

          {/* Right column: transaction monitor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: t("statTotal"),
                  value: transactions.length,
                },
                {
                  label: t("statActive"),
                  value: transactions.filter(
                    (tx) => tx.status === "pending" || tx.status === "in_progress"
                  ).length,
                },
                {
                  label: t("statComplete"),
                  value: transactions.filter((tx) => tx.status === "complete").length,
                },
                {
                  label: t("statFailed"),
                  value: transactions.filter((tx) => tx.status === "failed").length,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Monitor */}
            <BridgeTransactionMonitor
              transactions={transactions}
              onRemove={removeTransaction}
              onClearTerminal={clearTerminal}
            />

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center px-4">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
