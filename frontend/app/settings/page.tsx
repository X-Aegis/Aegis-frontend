'use client';

import React, { useState } from 'react';
import { Bell, Moon, Sun, Monitor, Globe, ChevronRight, User, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            User Settings
          </h1>
          <p className="text-slate-500 mt-2">Manage your account preferences and security settings.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            {[
              { id: 'profile', label: 'Profile', icon: User, active: true },
              { id: 'preferences', label: 'Preferences', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'billing', label: 'Billing', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  item.active 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <main className="md:col-span-2 space-y-6">
            {/* Notification Toggle */}
            <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Push Notifications</h3>
                    <p className="text-sm text-slate-500">Receive alerts about AI risk movements.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </section>

            {/* Display Preferences */}
            <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Monitor size={18} className="text-slate-500" />
                Display Preferences
              </h3>
              
              <div className="space-y-4">
                {/* Theme Selector */}
                <div>
                  <label className="text-sm text-slate-500 block mb-3">Color Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          theme === t.id 
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                            : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        <t.icon size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selector */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-slate-500" />
                    <div>
                      <span className="text-sm font-medium">Secondary Currency</span>
                      <p className="text-xs text-slate-500">How asset values are displayed.</p>
                    </div>
                  </div>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-800 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 ring-cyan-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="XLM">XLM (Lumens)</option>
                  </select>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
