import { RiskBadge } from "@/components/RiskBadge";
import { RiskChart } from "@/components/RiskChart";

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
  return (
    <main className="flex min-h-screen flex-col bg-background p-6 md:p-12 lg:p-24 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Aegis Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered volatility shield for emerging market currencies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">System Status:</span>
          <RiskBadge level="Medium" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Risk Forecast Card */}
        <div className="md:col-span-2 lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">AI Risk Forecast</h2>
              <p className="text-sm text-muted-foreground">7-day projected FX volatility index</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">52.4</div>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                Stable Outlook
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] w-full pt-4">
            <RiskChart data={MOCK_RISK_DATA} height={300} />
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Current Allocation</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>USDC Reserves</span>
                <span className="font-mono font-bold">40%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '40%' }}></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Stellar LP</span>
                <span className="font-mono font-bold">35%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '35%' }}></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Synthetic Hedges</span>
                <span className="font-mono font-bold">25%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-primary/5 border-primary/20 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold">AI Signal</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Our model predicts a <span className="text-foreground font-semibold">12% increase</span> in local currency volatility over the next 48 hours. The vault is automatically shifting reserves to high-safety USDC.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
