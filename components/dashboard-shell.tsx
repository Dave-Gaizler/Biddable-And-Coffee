'use client';

import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { TeamCard } from '@/components/team-card';
import { platformNotes, team, tickerItems } from '@/lib/mock-data';
import { PlatformCard } from '@/components/platform-card';
import { DspCard } from '@/components/dsp-card';
import { NewsFeed } from '@/components/news-feed';
import { BitcoinWidget } from '@/components/bitcoin-widget';
import { FooterBanner } from '@/components/footer-banner';
import { GatePage } from '@/components/gate-page';
import { PartnerMetric } from '@/lib/services';

export function DashboardShell() {
  const [unlocked, setUnlocked] = useState(false);
  const [partners, setPartners] = useState<PartnerMetric[]>([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [stocksError, setStocksError] = useState<string | null>(null);
  const [stocksUpdatedAt, setStocksUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem('bac-unlocked') === 'true');
  }, []);

  useEffect(() => {
    if (!unlocked) return;

    const load = async () => {
      setStocksLoading(true);
      try {
        const res = await fetch('/api/stocks');
        if (!res.ok) throw new Error('Stocks endpoint failed');

        const json = await res.json();
        setPartners(json.data);
        setStocksUpdatedAt(json.updatedAt);
        setStocksError(null);
      } catch (stocksLoadError) {
        console.error('[DashboardShell] stocks load failed', stocksLoadError);
        setStocksError('Unable to refresh partner quotes right now.');
      } finally {
        setStocksLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 300000);
    return () => clearInterval(interval);
  }, [unlocked]);

  if (!unlocked) {
    return <GatePage onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
      <DashboardHeader tickerItems={tickerItems} />

      <section>
        <h2 className="mb-3 text-2xl font-semibold">Team Roster</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => <TeamCard key={member.name} name={member.name} role={member.role} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold">Platform Spotlight</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {platformNotes.map((platform) => <PlatformCard key={platform.name} platform={platform} />)}
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">DSP Partner Pulse</h2>
          {stocksUpdatedAt ? <p className="text-xs text-slate-400">Last updated {new Date(stocksUpdatedAt).toLocaleTimeString()}</p> : null}
        </div>

        {stocksLoading ? <p className="mb-3 text-sm text-slate-300">Loading stock quotes...</p> : null}
        {stocksError ? <p className="mb-3 text-sm text-rose-300">{stocksError}</p> : null}

        {!stocksLoading && !stocksError && partners.length === 0 ? (
          <p className="mb-3 text-sm text-slate-300">No stock data returned.</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {partners.map((partner) => <DspCard key={partner.name} partner={partner} />)}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <NewsFeed />
        <BitcoinWidget />
      </section>

      <FooterBanner />
    </main>
  );
}
