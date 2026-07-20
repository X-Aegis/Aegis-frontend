'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  LogOut,
  ArrowLeft,
  User,
  Globe,
  Wallet,
  Coins,
  Code,
  CheckCircle2,
  XCircle,
  Copy,
  Info
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useNetwork } from '@/contexts/NetworkContext';
import { resolveContract, getAllContractNames } from '@/lib/contracts.config';

export default function SettingsPage() {
  const { optedIn, permission, enable, disable } = usePushNotifications();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [currency, setCurrency] = useState('USD');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { network, networkConfig } = useNetwork();
  const contractNames = getAllContractNames();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pushUnavailable = permission === 'unsupported' || permission === 'denied';

  const focusVisibleClass =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

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
            <h1 className="text-xl font-bold">Account Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="space-y-1" aria-label="Settings sections">
            <button
              type="button"
              aria-current="page"
              className={`w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium text-sm transition-all border border-primary/20 ${focusVisibleClass}`}
            >
              <User className="w-4 h-4" />
              General Profile
            </button>
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent rounded-xl font-medium text-sm transition-all ${focusVisibleClass}`}
            >
              <Shield className="w-4 h-4" />
              Security & Keys
            </button>
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent rounded-xl font-medium text-sm transition-all ${focusVisibleClass}`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent rounded-xl font-medium text-sm transition-all ${focusVisibleClass}`}
            >
              <Globe className="w-4 h-4" />
              Regional Settings
            </button>
            <div className="pt-4 mt-4 border-t border-border">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl font-medium text-sm transition-all ${focusVisibleClass}`}
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </button>
            </div>
          </aside>

          {/* Settings Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Preferences Section */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-accent/30">
                <h2 className="font-bold flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  Display Preferences
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Theme Selector */}
                <div className="space-y-3">
                  <span id="theme-selector-label" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Appearance Theme
                  </span>
                  <div
                    className="grid grid-cols-3 gap-3"
                    role="radiogroup"
                    aria-labelledby="theme-selector-label"
                  >
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.id}
                        type="button"
                        role="radio"
                        aria-checked={theme === themeOption.id}
                        onClick={() => setTheme(themeOption.id as 'light' | 'dark' | 'system')}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${focusVisibleClass} ${theme === themeOption.id ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'hover:bg-accent border-border text-muted-foreground'}`}
                      >
                        <themeOption.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{themeOption.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3 sm:gap-0">
                  <div className="space-y-1">
                    <label htmlFor="secondary-currency" className="font-semibold text-sm flex items-center gap-2">
                      <Coins className="w-4 h-4 text-muted-foreground" />
                      Secondary Currency
                    </label>
                    <p id="secondary-currency-description" className="text-xs text-muted-foreground">
                      Choose currency for portfolio estimates.
                    </p>
                  </div>
                  <select
                    id="secondary-currency"
                    name="secondary-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`bg-accent/50 border border-border rounded-lg text-sm px-3 py-1.5 outline-none w-full sm:w-auto ${focusVisibleClass}`}
                    aria-label="Secondary currency for portfolio estimates"
                    aria-describedby="secondary-currency-description"
                  >
                    <option value="USD">USD (Global)</option>
                    <option value="NGN">NGN (Nigeria)</option>
                    <option value="BRL">BRL (Brazil)</option>
                    <option value="TRY">TRY (Turkey)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-accent/30 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Push Notifications
                </h2>
                <button
                  type="button"
                  role="switch"
                  aria-checked={optedIn}
                  aria-label="Enable push notifications"
                  disabled={pushUnavailable}
                  onClick={() => (optedIn ? disable() : enable())}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${focusVisibleClass} ${optedIn ? 'bg-primary' : 'bg-muted'} ${pushUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="sr-only">
                    {optedIn ? 'Disable push notifications' : 'Enable push notifications'}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${optedIn ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </button>
              </div>
              {permission === 'denied' && (
                <p className="px-6 pt-4 text-xs text-muted-foreground">
                  Notifications are blocked in your browser settings. Allow notifications for this site to enable this.
                </p>
              )}
              <div className="p-6 space-y-4">
                <button
                  type="button"
                  className={`w-full flex justify-between items-center group text-left rounded-lg ${focusVisibleClass}`}
                >
                  <span>
                    <span className="block text-sm font-medium">Volatility Alerts</span>
                    <span className="block text-xs text-muted-foreground italic">Alerts when AI forecasts high risk.</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <button
                  type="button"
                  className={`w-full flex justify-between items-center group text-left pt-2 border-t border-border/50 rounded-lg ${focusVisibleClass}`}
                >
                  <span>
                    <span className="block text-sm font-medium">Rebalance Success</span>
                    <span className="block text-xs text-muted-foreground italic">Confirmations of automated shield actions.</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            </section>

            {/* Wallet Section */}
            <section className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Stellar Address</p>
                  <p className="text-xs font-mono text-muted-foreground">GC...4X9S</p>
                </div>
              </div>
              <a
                href="https://stellar.expert/explorer/testnet"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-bold text-primary hover:underline rounded-sm ${focusVisibleClass}`}
              >
                View on Stellar.Expert
              </a>
            </section>

            {/* Contract & Debug Section */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-accent/30">
                <h2 className="font-bold flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Contract & Debug
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Active network: <span className="font-bold uppercase">{networkConfig.network}</span>
                </p>
              </div>
              <div className="p-6 space-y-4">
                {contractNames.map((contractName) => {
                  const resolved = resolveContract(network, contractName);
                  return (
                    <div key={contractName} className="p-4 bg-accent/20 rounded-xl border border-border/50 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold capitalize">{contractName} Contract</span>
                          {resolved.isOverride && (
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              ENV OVERRIDE
                            </span>
                          )}
                        </div>
                        {resolved.isValid ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-rose-600 bg-rose-500/10 px-2 py-1 rounded-md font-medium">
                            <XCircle className="w-3 h-3" /> Invalid
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-background border border-border px-2 py-1 rounded truncate flex-1 opacity-70">
                          {resolved.address || "Not configured"}
                        </code>
                        <button
                          onClick={() => handleCopy(resolved.address, contractName)}
                          disabled={!resolved.address}
                          className="p-1.5 bg-background border border-border rounded hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Copy address"
                        >
                          {copiedId === contractName ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
