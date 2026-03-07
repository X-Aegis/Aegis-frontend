import { VaultOverviewCard } from "../components/VaultOverviewCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-2">X-Aegis 🛡️</h1>
      <p className="mt-2 mb-8 text-xl text-muted-foreground">Volatility Shield for Weak Currencies</p>

      <VaultOverviewCard />

      <div className="mt-8 p-4 border rounded-lg bg-card max-w-lg w-full text-center">
        <p className="text-muted-foreground">Frontend scaffolded successfully.</p>
        <p className="text-sm mt-2">See <code>docs/ISSUES-FRONTEND.md</code> to start building.</p>
      </div>
    </main>
  );
}
