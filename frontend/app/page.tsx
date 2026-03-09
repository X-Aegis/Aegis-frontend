"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AiInsightStream } from "@/components/AiInsightStream";
import { VaultOverviewCard } from "../components/VaultOverviewCard";
import { VaultAPYChart } from "../components/charts/VaultAPYChart";
import { TransactionHistoryList } from "@/components/transactions/TransactionHistoryList";
import Link from "next/link";
import { TrendingUp, Shield, BarChart3, ArrowUpRight } from "lucide-react";
import { RiskChart } from "./components/RiskChart";
import { RiskBadge } from "./components/RiskBadge";
import { WithdrawTab } from "../components/WithdrawTab";
import { DepositTab } from "../components/DepositTab";
import { ReferralLinkCard } from "../components/ReferralLinkCard";
import { ReferralStatsCard } from "../components/ReferralStatsCard";
import { Gift, HelpCircle } from "lucide-react";

const MOCK_RISK_DATA = [
  { date: "Mar 01", risk: 24 },
  { date: "Mar 02", risk: 28 },
  { date: "Mar 03", risk: 42 },
  { date: "Mar 04", risk: 36 },
  { date: "Mar 05", risk: 65 },
  { date: "Mar 06", risk: 48 },
  { date: "Mar 07", risk: 52 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation / Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">X-Aegis</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`${activeTab === "dashboard" ? "text-foreground" : "hover:text-foreground"} transition-colors`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("referrals")}
              className={`${activeTab === "referrals" ? "text-foreground" : "hover:text-foreground"} transition-colors`}
            >
              Referrals
            </button>
            <Link href="#" className="hover:text-foreground transition-colors">Vaults</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Swap</Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab("deposit")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "deposit" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              Deposit
            </button>
            <button 
              onClick={() => setActiveTab("withdraw")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "withdraw" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              Withdraw
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2">Institutional Dashboard</h1>
                  <RiskBadge level="medium" />
                </div>
                <p className="text-muted-foreground uppercase text-xs tracking-widest font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Volatility Shield Active
                </p>
              </div>
              <div className="flex gap-3">
                 <div className="bg-card border border-border px-4 py-2 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <BarChart3 className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Portfolio</p>
                       <p className="text-lg font-bold">$12,450.80</p>
                    </div>
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
                  <RiskChart data={MOCK_RISK_DATA} height={300} />
                </div>
                <VaultAPYChart vaultId="main-vault" />

                <TransactionHistoryList />
                
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
                         <Link href="/vaults/1" className="text-primary text-sm font-bold flex items-center gap-1">
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
                         <Link href="/vaults/2" className="text-primary text-sm font-bold flex items-center gap-1">
                            View Details
                         </Link>
                      </div>
                   </div>
                </div>
              </div>

              {/* Sidebar / Stats */}
              <div className="space-y-6">
                <AiInsightStream />
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 rounded-3xl shadow-2xl shadow-primary/20 relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">Aegis Guard</h2>
                      <p className="text-primary-foreground/80 text-sm mb-6">Your capital is shielded against 98.4% of forecasted volatility.</p>
                      <button className="w-full bg-background/20 backdrop-blur-md border border-white/20 py-3 rounded-xl font-bold hover:bg-background/30 transition-all uppercase tracking-widest text-xs">
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
        ) : activeTab === "withdraw" ? (
          <WithdrawTab />
        ) : (
          <DepositTab />
        )}
      </div>
    </main>
  );
}
