"use client";

import React from "react";
import { VaultAPYChart } from "../../../components/charts/VaultAPYChart";
import Link from "next/link";
import { ChevronLeft, Info, Wallet, ArrowUpRight, TrendingUp } from "lucide-react";
import { useParams } from "next/navigation";

export default function VaultDetailsPage() {
  const { id } = useParams();
  
  const vaultName = id === "1" ? "USDC Savings Vault" : "Growth Index Vault";
  const apy = id === "1" ? "12.4%" : "24.8%";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
       <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <TrendingUp className="text-primary-foreground w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Vault Explorer</span>
            </div>
          </div>
          <button className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-all">
            Connect Wallet
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 flex-grow">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Stats and Chart */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">{vaultName}</h1>
                    <div className="flex items-center gap-3">
                       <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">Delta Neutral</span>
                       <span className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">Audited</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-10">
                     <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Current Yield</p>
                        <p className="text-4xl font-black text-green-500">{apy}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">TVL</p>
                        <p className="text-3xl font-black ">$4.2M</p>
                     </div>
                  </div>
               </div>

               <VaultAPYChart vaultId={id as string} />

               <div className="bg-card border border-border p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <Info className="w-5 h-5 text-primary" />
                     Strategy Overview
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    This vault employs a sophisticated delta-neutral strategy using Soroban smart contracts. It balances USDC positions against synthetic inflation hedges to protect your purchasing power in volatile markets. All rebalancing is automated via our AI-driven risk engine.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {[
                        { label: 'Risk Score', value: '1/10', sub: 'Low Volatility' },
                        { label: 'Min Deposit', value: '10 USDC', sub: 'Low entry barrier' },
                        { label: 'Withdrawal', value: 'Instant', sub: 'No lock-up' },
                     ].map((stat) => (
                        <div key={stat.label} className="bg-muted/50 p-4 rounded-2xl">
                           <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{stat.label}</p>
                           <p className="text-xl font-black">{stat.value}</p>
                           <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-6">
               <div className="bg-card border-2 border-primary/20 p-8 rounded-3xl shadow-2xl shadow-primary/5">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Allocate Funds</h3>
                  <div className="space-y-4 mb-8">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Amount</label>
                        <div className="relative">
                           <input 
                              type="number" 
                              placeholder="0.00" 
                              className="w-full bg-muted border-none rounded-2xl p-4 text-2xl font-bold focus:ring-2 ring-primary/50 outline-none transition-all pr-20"
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <span className="font-bold text-sm">USDC</span>
                           </div>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold px-2">
                           <span className="text-muted-foreground">Balance: 245.20 USDC</span>
                           <button className="text-primary hover:underline">MAX</button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                       <Wallet className="w-5 h-5" />
                       Deposit to Vault
                    </button>
                    <button className="w-full bg-secondary text-secondary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary/80 transition-all">
                       Withdraw
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border space-y-3">
                     <div className="flex justify-between text-sm font-bold">
                        <span className="text-muted-foreground">Expected Monthly Yield</span>
                        <span className="text-green-500">+$2.40</span>
                     </div>
                     <div className="flex justify-between text-sm font-bold">
                        <span className="text-muted-foreground">Protocol Fee</span>
                        <span>0.1%</span>
                     </div>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                     <h4 className="text-lg font-black mb-2 flex items-center gap-2 italic">
                        <TrendingUp className="w-5 h-5" />
                        AI Prediction
                     </h4>
                     <p className="text-white/80 text-sm mb-4">
                        Our model predicts a <span className="text-white font-black underline">15% surge</span> in inflation for this sector over the next 3 weeks. Recommendation: <span className="text-white font-black">Increase Allocation</span>.
                     </p>
                     <ArrowUpRight className="absolute top-4 right-4 text-white/20 group-hover:text-white transition-colors" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
