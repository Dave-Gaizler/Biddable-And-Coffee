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

  useEffect(() => {
    setUnlocked(sessionStorage.getItem('bac-unlocked') === 'true');
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    const load = async () => {
      const res = await fetch('/api/partners');
      const json = await res.json();
      setPartners(json.data);
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
        <h2 className="mb-3 text-2xl font-semibold">DSP Partner Pulse</h2>
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
