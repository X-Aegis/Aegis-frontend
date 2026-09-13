'use client';

import { useEffect, useState } from 'react';
import { Vote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFreighter } from '@/contexts/FreighterContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { useContractAddress } from '@/hooks/useContractAddress';
import { getGovernanceSummary, type GovernanceSummary, NetworkType } from '@/lib/stellar';

function networkType(network: 'testnet' | 'mainnet'): NetworkType {
  return network === 'mainnet' ? NetworkType.MAINNET : NetworkType.TESTNET;
}

export default function GovernancePage() {
  const t = useTranslations('governance');
  const { address } = useFreighter();
  const { network } = useNetwork();
  const contractId = useContractAddress('governance');
  const [summary, setSummary] = useState<GovernanceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setSummary(null);
      setError(null);
      return;
    }

    let cancelled = false;
    getGovernanceSummary(contractId, address, networkType(network)).then(({ summary: nextSummary, error: nextError }) => {
      if (!cancelled) {
        setSummary(nextSummary);
        setError(nextError);
      }
    });
    return () => { cancelled = true; };
  }, [address, contractId, network]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-1">
          <Vote className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">{t('subtitle')}</p>

        {!address ? (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Connect a wallet to read governance state from the contract.
          </p>
        ) : error ? (
          <p className="rounded-xl border border-destructive/30 bg-card p-5 text-sm text-muted-foreground">
            Governance data is unavailable: {error}
          </p>
        ) : summary ? (
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold">Guardians</h2>
              <p className="mt-2 text-3xl font-bold">{summary.guardians.length}</p>
              <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                {summary.guardians.map((guardian) => <li key={guardian}>{guardian}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold">Approval threshold</h2>
              <p className="mt-2 text-3xl font-bold">{summary.threshold}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Proposals: {summary.proposalIds.length}
              </p>
              {summary.proposalIds.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {summary.proposalIds.map((id) => <li key={id}>Proposal #{id}</li>)}
                </ul>
              )}
            </div>
          </section>
        ) : (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">Reading contract state...</p>
        )}
      </div>
    </main>
  );
}
