"use client";

import { useState } from "react";
import { WithdrawTab } from "../components/WithdrawTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "withdraw">("dashboard");

  return (
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
