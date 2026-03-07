import { AiInsightStream } from "@/components/AiInsightStream";

export default function Home() {
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
          </div>
        </div>
      </div>
    </main>
  );
}
