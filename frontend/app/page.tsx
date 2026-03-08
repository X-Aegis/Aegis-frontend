import Link from 'next/link';
import { RiskChart } from './components/RiskChart';
import { RiskBadge } from './components/RiskBadge';
import { Settings, Shield, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
            <Shield className="text-slate-950" size={20} />
          </div>
          X-AEGIS
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-cyan-400">Dashboard</Link>
          <Link href="/settings" className="p-2 hover:bg-slate-900 rounded-lg transition-colors text-slate-500 hover:text-white">
            <Settings size={20} />
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 px-8 pb-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Risk */}
        <div className="lg:col-span-2 space-y-8">
          <section className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Financial Overview</h1>
              <p className="text-slate-500 mt-1">Real-time protection status and risk analytics.</p>
            </div>
            <RiskBadge level="medium" />
          </section>

          <RiskChart />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Active Strategies</p>
                <h2 className="text-2xl font-bold text-white mt-1">4 Active</h2>
              </div>
            </div>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Shield Coverage</p>
                <h2 className="text-2xl font-bold text-white mt-1">98.4% Secure</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions / Placeholder */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent p-8 rounded-3xl border border-cyan-500/20 space-y-6">
            <h3 className="text-xl font-bold text-white">Smart Protection Active</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your assets are currently protected against a 12% volatility spike in local markets.
            </p>
            <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all hover:scale-[1.02]">
              Adjust Exposure
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
