import { VaultOverviewCard } from "../components/VaultOverviewCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-2">X-Aegis 🛡️</h1>
      <p className="mt-2 text-xl text-muted-foreground mb-8">Volatility Shield for Weak Currencies</p>

      <div className="w-full max-w-lg mb-8">
        <VaultOverviewCard />
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-card w-full max-w-lg text-center">
        <p className="text-muted-foreground">Frontend scaffolded successfully.</p>
        <p className="text-sm mt-2">See <code>docs/ISSUES-FRONTEND.md</code> to start building.</p>
      </div>
    </main>
  );
}
