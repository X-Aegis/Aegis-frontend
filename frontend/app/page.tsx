import { AiInsightStream } from "@/components/AiInsightStream";
"use client";

import { VaultAPYChart } from "../components/charts/VaultAPYChart";
import Link from "next/link";
import { TrendingUp, Shield, BarChart3, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { WithdrawTab } from "../components/WithdrawTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "withdraw">("dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-[#050505]">
      <div className="w-full max-w-6xl flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            X-Aegis <span className="text-blue-500">🛡️</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Volatility Shield for Weak Currencies. 
            <span className="block text-sm mt-2 font-mono text-gray-500 uppercase tracking-widest">Decentralized Asset Management on Stellar</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
          <div className="space-y-6">
            <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-2">Protocol Status</h3>
              <p className="text-gray-400 text-sm">
                Frontend scaffolded successfully. Monitoring live market data and AI forecasting feeds.
              </p>
            </div>
            
            <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-2">Vault Allocation</h3>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-blue-500 rounded-full" title="USDC 40%"/>
                <div className="flex-1 h-2 bg-[#00ffcc] rounded-full" title="Synthetic 30%"/>
                <div className="flex-1 h-2 bg-purple-500 rounded-full" title="LP 30%"/>
              </div>
              <div className="flex justify-between mt-3 text-[10px] uppercase font-mono text-gray-500">
                <span>USDC 40%</span>
                <span>Synth 30%</span>
                <span>LP 30%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
             <AiInsightStream />
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
            <Link href="/" className="text-foreground transition-colors">Dashboard</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Vaults</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Swap</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Profile</Link>
          </nav>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Connect Wallet
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Institutional Dashboard</h1>
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
            <VaultAPYChart vaultId="main-vault" />
            
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
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-2">X-Aegis 🛡️</h1>
      <p className="text-xl text-muted-foreground mb-8">Volatility Shield for Weak Currencies</p>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
        >
          Dashboard View
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "withdraw" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
        >
          Withdraw
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {activeTab === "dashboard" ? (
          <div className="p-8 border rounded-lg bg-card text-center">
            <h2 className="text-2xl font-semibold mb-2">Dashboard Scaffold</h2>
            <p className="text-muted-foreground">Welcome to X-Aegis!</p>
            <p className="text-sm mt-4">See <code>docs/ISSUES-FRONTEND.md</code> to start building.</p>
          </div>
        ) : (
          <WithdrawTab />
        )}
      </div>
    </main>
  );
}
