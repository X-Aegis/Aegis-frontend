"use client";

import { FormEvent, useMemo, useState } from "react";
import { BarChart3, Building2, CheckCircle2, KeyRound, LineChart, Lock, TrendingUp, Users } from "lucide-react";
import { usePartnerAuth } from "@/contexts/PartnerAuthContext";

const partnerMetrics = [
  { label: "Partner TVL", value: "$8.42M", change: "+18.7%", helper: "Assets sourced through active partner channels" },
  { label: "Active Institutions", value: "128", change: "+14", helper: "Verified organizations using partner vault flows" },
  { label: "Monthly Net Inflows", value: "$1.36M", change: "+22.4%", helper: "Net deposits after withdrawals this month" },
  { label: "Avg. Shield Coverage", value: "96.8%", change: "+2.1%", helper: "Forecasted volatility protected by Aegis Guard" },
];

const channelRows = [
  { channel: "Treasury API", accounts: 42, volume: "$3.1M", retention: "94%", risk: "Low" },
  { channel: "NGO Programs", accounts: 31, volume: "$1.9M", retention: "91%", risk: "Medium" },
  { channel: "Payroll Partners", accounts: 28, volume: "$1.4M", retention: "88%", risk: "Medium" },
  { channel: "Regional Fintechs", accounts: 27, volume: "$2.0M", retention: "96%", risk: "Low" },
];

const funnelStages = [
  { name: "Invited", count: 420, width: "100%" },
  { name: "Authenticated", count: 318, width: "76%" },
  { name: "Vault connected", count: 214, width: "51%" },
  { name: "Funded", count: 156, width: "37%" },
];

export function PartnerDashboard() {
  const { isAuthenticated, isLoading, error: authError, login, logout, partner } = usePartnerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerName, setPartnerName] = useState("GrantFox Capital");

  const partnerInitials = useMemo(
    () => partnerName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "GP",
    [partnerName]
  );

  const authenticatePartner = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(email, password);
  };

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card border border-border p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-bold">Partner authentication</p>
              <h1 className="text-3xl font-extrabold tracking-tight">Strategic Partner Dashboard</h1>
            </div>
          </div>
          <p className="text-muted-foreground mb-8">
            Access a specialized ecosystem view for channel health, referred TVL, institutional onboarding, and volatility shield performance.
          </p>
          <form onSubmit={authenticatePartner} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Partner organization</span>
              <input
                value={partnerName}
                onChange={(event) => setPartnerName(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Organization name"
              />
            </label>
             <label className="block space-y-2">
               <span className="text-sm font-semibold">Partner email</span>
               <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                   value={email}
                   onChange={(event) => setEmail(event.target.value)}
                   className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                   placeholder="partner@example.com"
                   type="email"
                   aria-describedby={authError ? "partner-auth-error" : undefined}
                 />
               </div>
             </label>
             <label className="block space-y-2">
               <span className="text-sm font-semibold">Password</span>
               <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />
             </label>
             {authError && <p id="partner-auth-error" className="text-sm font-medium text-red-500">{authError}</p>}
             <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60">
               {isLoading ? "Authenticating…" : "Unlock partner metrics"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Strategic partner view</p>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Welcome, {partnerName}</h1>
           <p className="text-muted-foreground mt-2">Data-intensive metrics for partner-sourced assets, onboarding funnels, and ecosystem risk.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 self-start">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black">{partnerInitials}</div>
          <div>
            <p className="font-bold">Authenticated partner</p>
           <p className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> {partner?.organization ?? partnerName}</p>
          </div>
        </div>
      </div>

       <button type="button" onClick={logout} className="rounded-xl border border-border px-4 py-2 text-sm">Sign out</button>
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {partnerMetrics.map((metric) => (
          <div key={metric.label} className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{metric.label}</p>
            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-black">{metric.value}</p>
              <span className="text-sm font-bold text-green-500">{metric.change}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6 overflow-x-auto">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-5"><BarChart3 className="w-5 h-5 text-primary" /> Channel performance</h2>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted-foreground uppercase text-xs tracking-widest">
              <tr><th className="pb-3">Channel</th><th className="pb-3">Accounts</th><th className="pb-3">Volume</th><th className="pb-3">Retention</th><th className="pb-3">Risk</th></tr>
            </thead>
            <tbody>
              {channelRows.map((row) => (
                <tr key={row.channel} className="border-t border-border">
                  <td className="py-4 font-bold">{row.channel}</td><td>{row.accounts}</td><td>{row.volume}</td><td>{row.retention}</td><td><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{row.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-5"><Users className="w-5 h-5 text-primary" /> Onboarding funnel</h2>
          <div className="space-y-4">
            {funnelStages.map((stage) => (
              <div key={stage.name}>
                <div className="flex justify-between text-sm mb-2"><span className="font-semibold">{stage.name}</span><span className="text-muted-foreground">{stage.count}</span></div>
                <div className="h-3 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: stage.width }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6"><LineChart className="w-6 h-6 text-primary mb-4" /><h3 className="font-bold">Forecast exposure</h3><p className="text-sm text-muted-foreground mt-2">Partner accounts are most exposed to USD/NGN and USD/KES volatility over the next 7 days.</p></div>
        <div className="bg-card border border-border rounded-2xl p-6"><TrendingUp className="w-6 h-6 text-green-500 mb-4" /><h3 className="font-bold">Revenue share</h3><p className="text-sm text-muted-foreground mt-2">Projected partner fee share is $42.6K for the current monthly settlement window.</p></div>
        <div className="bg-card border border-border rounded-2xl p-6"><Building2 className="w-6 h-6 text-blue-500 mb-4" /><h3 className="font-bold">Priority action</h3><p className="text-sm text-muted-foreground mt-2">Invite 22 pending institutions to move them from authenticated to vault-connected status.</p></div>
      </div>
    </section>
  );
}
