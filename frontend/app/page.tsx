"use client";

import { useFreighter } from "@/context/FreighterContext";
import { Loader2, Wallet } from "lucide-react";

export default function Home() {
  const { address, isConnected, isConnecting, connect, disconnect, error } = useFreighter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          X-Aegis 🛡️
        </h1>
        
        <p className="text-2xl text-muted-foreground text-center">
          Volatility Shield for Weak Currencies
        </p>

        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border bg-card shadow-2xl backdrop-blur-sm">
          {isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Connected</span>
              </div>
              <p className="font-mono text-sm bg-muted p-2 rounded border truncate max-w-xs md:max-w-md">
                {address}
              </p>
              <button
                onClick={disconnect}
                className="px-6 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-semibold shadow-lg"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold text-lg shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet size={24} />
                    Connect Freighter
                  </>
                )}
              </button>
              {error && (
                <p className="text-destructive text-sm font-medium mt-2 max-w-xs text-center">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
          <div className="p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-colors">
            <h3 className="font-bold text-lg mb-2 text-primary">Global State</h3>
            <p className="text-sm text-muted-foreground">Wallet context available across the whole app.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-colors">
            <h3 className="font-bold text-lg mb-2 text-primary">Auto-Reconnect</h3>
            <p className="text-sm text-muted-foreground">Session persists through page refreshes.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-colors">
            <h3 className="font-bold text-lg mb-2 text-primary">Real-time Logic</h3>
            <p className="text-sm text-muted-foreground">Status updates instantly as user interacts with Freighter.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
