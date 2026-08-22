"use client";

import { useTranslations } from 'next-intl';

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AiInsightStream } from "../../components/AiInsightStream";
import { VaultOverviewCard } from "../../components/VaultOverviewCard";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Shield, BarChart3, ArrowUpRight, Menu, X, Gift, HelpCircle, ChevronDown, Settings, LogOut, Globe } from "lucide-react";

const VaultAPYChart = dynamic(() => import('../../components/charts/VaultAPYChart').then(mod => mod.VaultAPYChart), {
  ssr: false,
  loading: () => <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[400px] flex items-center justify-center bg-card/50 rounded-xl border border-border animate-pulse"><p className="text-muted-foreground">Loading chart...</p></div>
});

const TransactionHistoryList = dynamic(() => import('@/components/transactions/TransactionHistoryList').then(mod => mod.TransactionHistoryList), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-card rounded-xl animate-pulse"><p className="text-muted-foreground">Loading history...</p></div>
});

const RiskChart = dynamic(() => import('../../components/RiskChart').then(mod => mod.RiskChart), {
  ssr: false,
  loading: () => <div className="min-h-[200px] flex items-center justify-center animate-pulse"><p className="text-muted-foreground">Loading risk data...</p></div>
});

const PerformanceAttribution = dynamic(() => import('../../components/PerformanceAttribution').then(mod => mod.PerformanceAttribution), {
  ssr: false,
  loading: () => <div className="w-full min-h-[300px] bg-card rounded-xl border border-border animate-pulse flex items-center justify-center"><p className="text-muted-foreground">Loading attribution...</p></div>
});
import { RiskBadge } from "../../components/RiskBadge";
import { WithdrawTab } from "../../components/WithdrawTab";
import { DepositTab } from "../../components/DepositTab";
import { ReferralLinkCard } from "../../components/ReferralLinkCard";
import { ReferralStatsCard } from "../../components/ReferralStatsCard";
import { RewardSummary } from "../../components/RewardSummary";
import { PartnerDashboard } from "../../components/PartnerDashboard";
import { CurrencySwitch } from "../../components/CurrencySwitch";
import { NetworkSwitch } from "../../components/NetworkSwitch";
import { NotificationCenter } from "../../components/NotificationCenter";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useFreighter } from "../../contexts/FreighterContext";
import { useNetwork } from "@/contexts/NetworkContext";
import { AIChatbot } from "../../components/AIChatbot";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function Home() {
  const t = useTranslations('HomePage');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactionModal, setTransactionModal] = useState<"deposit" | "withdraw" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [riskData, setRiskData] = useState<{date: string, risk: number}[]>([]);
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);
  const { formatAmount } = useCurrency();
  const { address, isConnected, connect, disconnect } = useFreighter();
  const { network } = useNetwork();

  const focusVisibleClass =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/risk/history?horizon=1&limit=7`);
        if (!response.ok) throw new Error("Failed to fetch risk data");
        const data = await response.json();
        
        const formattedData = data.map((item: any) => {
          const date = new Date(item.timestamp);
          return {
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            risk: item.volatility_score
          };
        }).reverse();
        
        if (formattedData.length > 0) {
          setRiskData(formattedData);
        } else {
          setRiskData([{ date: "No Data", risk: 0 }]);
        }
      } catch (error) {
        console.error("Error fetching risk data:", error);
        setRiskData([
          { date: "Mar 01", risk: 24 },
          { date: "Mar 02", risk: 25 },
          { date: "Mar 03", risk: 22 },
          { date: "Mar 04", risk: 28 },
          { date: "Mar 05", risk: 35 },
          { date: "Mar 06", risk: 42 },
          { date: "Mar 07", risk: 38 },
        ]);
      } finally {
        setIsLoadingRisk(false);
      }
    };
    
    fetchRiskData();
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed top-0 right-0 h-full w-64 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-lg">Menu</span>
          <button
            type="button"
            onClick={closeMobileMenu}
            className={`p-2 hover:bg-muted rounded-lg transition-colors ${focusVisibleClass}`}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
          {[
            { key: "dashboard", label: t('dashboard') },
            { key: "referrals", label: t('referrals') },
            { key: "partners", label: t('partners') },
            { key: "vaults", label: t('vaults'), href: "#" },
            { key: "swap", label: t('swap'), href: "#" },
            { key: "bridge", label: t('bridge'), href: "/bridge" },
            { key: "settings", label: t('settings'), href: "/settings" },
          ].map((item) =>
            item.href ? (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMobileMenu}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ${focusVisibleClass}`}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                aria-pressed={activeTab === item.key}
                onClick={() => { setActiveTab(item.key); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${focusVisibleClass} ${activeTab === item.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                {item.label}
              </button>
            )
          )}
          <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2">
            <div className="flex justify-center pb-1">
              <CurrencySwitch />
            </div>
            {isConnected && (
              <div className="flex justify-center pb-2">
                <NetworkSwitch />
              </div>
            )}
            <button
              type="button"
              onClick={() => setTransactionModal("deposit")}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${focusVisibleClass} ${transactionModal === "deposit" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {t('deposit')}
            </button>
            <button
              type="button"
              onClick={() => setTransactionModal("withdraw")}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${focusVisibleClass} ${transactionModal === "withdraw" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {t('withdraw')}
            </button>
          </div>
        </nav>
      </div>

      {/* Navigation / Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 shrink-0 rounded-lg transition-transform hover:opacity-80 ${focusVisibleClass}`}
          >
            <Image src="/logo.png" alt="X-Aegis Logo" width={40} height={40} className="shrink-0 rounded-lg" />
            <span className="hidden sm:inline text-lg sm:text-xl font-bold tracking-tight">X-Aegis</span>
          </button>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center" aria-label="Main navigation">
            <button
              type="button"
              aria-pressed={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
              className={`${activeTab === "dashboard" ? "text-foreground" : "hover:text-foreground"} transition-colors rounded-sm ${focusVisibleClass}`}
            >
              {t('dashboard')}
            </button>
            <button type="button" className={`hover:text-foreground transition-colors rounded-sm ${focusVisibleClass}`}>{t('vaults')}</button>
            <button type="button" className={`hover:text-foreground transition-colors rounded-sm ${focusVisibleClass}`}>{t('swap')}</button>
            <Link href="/bridge" className={`hover:text-foreground transition-colors rounded-sm ${focusVisibleClass}`}>{t('bridge')}</Link>
            
            {/* More Dropdown */}
            <div className="relative group py-4 -my-4">
              <button type="button" className={`flex items-center gap-1 hover:text-foreground transition-colors rounded-sm ${focusVisibleClass}`}>
                {t('more')} <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col overflow-hidden py-1">
                <button type="button" onClick={() => setActiveTab("referrals")} className="px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors">{t('referrals')}</button>
                <button type="button" onClick={() => setActiveTab("partners")} className="px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors">{t('partners')}</button>
                <Link href="/simulate" className="px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors">{t('simulate')}</Link>
              </div>
            </div>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block"><CurrencySwitch /></div>
            <NotificationCenter />
            <ThemeToggle />
            
            <Link href="/settings" className={`hidden sm:flex p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors ${focusVisibleClass}`} aria-label={t('settings')}>
              <Settings className="w-5 h-5" />
            </Link>

            {isConnected ? (
              <div className="relative group py-2">
                <button type="button" className={`flex items-center gap-1.5 bg-muted border border-border px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-muted/80 transition-all whitespace-nowrap ${focusVisibleClass}`}>
                  <div className={`w-2 h-2 rounded-full ${network === 'mainnet' ? 'bg-success' : 'bg-warning'}`} />
                  {address?.slice(0, 4)}...{address?.slice(-4)}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
                </button>
                <div className="absolute top-full right-0 mt-0 w-72 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col p-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Network
                  </p>
                  <div className="w-full flex">
                    <NetworkSwitch />
                  </div>
                  <div className="h-px bg-border my-4" />
                  <button type="button" onClick={disconnect} className="flex items-center gap-2 text-left text-sm text-red-500 font-bold hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" /> Disconnect Wallet
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={connect} className={`bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap ${focusVisibleClass}`}>
                {t('connectWallet')}
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 hover:bg-muted rounded-lg transition-colors ${focusVisibleClass}`}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "dashboard" ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2">{t('title')}</h1>
                  <RiskBadge level="Medium" />
                </div>
                <p className="text-muted-foreground uppercase text-xs tracking-widest font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  {t('volatilityShield')}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                 <div className="bg-card border border-border px-4 py-2 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <BarChart3 className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Portfolio</p>
                       <p className="text-lg font-bold">{formatAmount(12_450.80)}</p>
                    </div>
                 </div>
                 <div className="hidden sm:flex gap-2">
                   <button
                     type="button"
                     onClick={() => setTransactionModal("deposit")}
                     className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${focusVisibleClass} bg-primary text-primary-foreground hover:bg-primary/90`}
                   >
                     {t('deposit')}
                   </button>
                   <button
                     type="button"
                     onClick={() => setTransactionModal("withdraw")}
                     className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${focusVisibleClass} bg-muted text-muted-foreground hover:bg-muted/80`}
                   >
                     {t('withdraw')}
                   </button>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Main Chart Section */}
              <div className="lg:col-span-2 space-y-6">
                <VaultOverviewCard />
                <div className="bg-card border border-border p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold tracking-tight">AI Risk Forecast</h2>
                      <p className="text-sm text-muted-foreground">7-day projected FX volatility index</p>
                    </div>
                  </div>
                  <div className="relative">
                    {isLoadingRisk ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10 rounded-xl">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : null}
                    <RiskChart data={riskData} height={300} />
                  </div>
                </div>
                <VaultAPYChart vaultId="main-vault" />

                <TransactionHistoryList />

                <RewardSummary />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                           <Shield className="text-primary w-6 h-6" />
                        </div>
                        <ArrowUpRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">USDC Savings Vault</h3>
                      <p className="text-muted-foreground text-sm mb-4">Delta-neutral hedging for stable purchasing power.</p>
                      <div className="flex items-end justify-between">
                         <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Current APY</p>
                            <p className="text-2xl font-bold text-green-500">12.4%</p>
                         </div>
                         <Link href="/vaults/1" className={`text-primary text-sm font-bold flex items-center gap-1 rounded-sm ${focusVisibleClass}`}>
                            View Details
                         </Link>
                      </div>
                   </div>

                   <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                           <TrendingUp className="text-blue-500 w-6 h-6" />
                        </div>
                        <ArrowUpRight className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">Growth Index Vault</h3>
                      <p className="text-muted-foreground text-sm mb-4">Optimized allocation across synthetic inflation hedges.</p>
                      <div className="flex items-end justify-between">
                         <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Current APY</p>
                            <p className="text-2xl font-bold text-green-500">24.8%</p>
                         </div>
                         <Link href="/vaults/2" className={`text-primary text-sm font-bold flex items-center gap-1 rounded-sm ${focusVisibleClass}`}>
                            View Details
                         </Link>
                      </div>
                   </div>
                </div>
              </div>

              {/* Sidebar / Stats */}
              <div className="space-y-6">
                <AiInsightStream />
                <PerformanceAttribution />
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 rounded-3xl shadow-2xl shadow-primary/20 relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">Aegis Guard</h2>
                      <p className="text-primary-foreground/80 text-sm mb-6">Your capital is shielded against 98.4% of forecasted volatility.</p>
                      <button type="button" className={`w-full bg-background/20 backdrop-blur-md border border-white/20 py-3 rounded-xl font-bold hover:bg-background/30 transition-all uppercase tracking-widest text-xs ${focusVisibleClass}`}>
                        Configure Shield
                      </button>
                   </div>
                   <Shield className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl">
                   <h3 className="font-bold mb-4 flex items-center gap-2">
                     <BarChart3 className="w-4 h-4 text-primary" />
                     Market Signals
                   </h3>
                   <div className="space-y-4">
                      {[
                        { name: 'USD/NGN volatility', trend: 'High', color: 'text-red-500' },
                        { name: 'Stellar LP yield', trend: 'Stable', color: 'text-green-500' },
                        { name: 'Inflation Forecast', trend: 'Moderate', color: 'text-yellow-500' }
                      ].map((s) => (
                        <div key={s.name} className="flex justify-between items-center text-sm border-b border-border pb-2 last:border-0">
                           <span className="text-muted-foreground">{s.name}</span>
                           <span className={`font-bold ${s.color}`}>{s.trend}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "referrals" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Referral Rewards</h1>
                <p className="text-muted-foreground">Share X-Aegis with your network and earn a percentage of their protocol fees.</p>
              </div>
              <ReferralLinkCard />
              <ReferralStatsCard />
            </div>
            <div className="space-y-6 pt-12">
               <div className="bg-card border border-border p-6 rounded-2xl">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    How it works
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-bold">1. Share your link</p>
                      <p className="text-muted-foreground">Send your unique referral link to friends or share it on social media.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">2. They deposit</p>
                      <p className="text-muted-foreground">When they deposit into any Aegis vault and generate yield.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">3. You earn</p>
                      <p className="text-muted-foreground">You receive 1.5% of the protocol fees they generate, paid out in USDC monthly.</p>
                    </div>
                  </div>
               </div>

               <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl relative overflow-hidden">
                  <Gift className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/10 -rotate-12" />
                  <h3 className="font-bold mb-2 text-primary">Milestone Bonus</h3>
                  <p className="text-sm mb-4 relative z-10">Refer 10 active users to unlock a <span className="font-bold">Permanent 2% Fee Share</span> Tier.</p>
                  <div className="w-full bg-muted rounded-full h-2 mb-2 relative z-10">
                    <div className="bg-primary h-full rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">2 / 10 Referrals</p>
               </div>
            </div>
          </div>
        ) : activeTab === "partners" ? (
          <PartnerDashboard />
        ) : null}
      </div>

      {transactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setTransactionModal("deposit")}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${transactionModal === 'deposit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setTransactionModal("withdraw")}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${transactionModal === 'withdraw' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Withdraw
                </button>
              </div>
              <button
                onClick={() => setTransactionModal(null)}
                className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-0 max-h-[80vh] overflow-y-auto">
              {transactionModal === "deposit" ? <DepositTab /> : <WithdrawTab />}
            </div>
          </div>
        </div>
      )}

      <AIChatbot />
    </main>
  );
}

