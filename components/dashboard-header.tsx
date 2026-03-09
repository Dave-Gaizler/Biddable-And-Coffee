'use client';

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { TickerBar } from '@/components/ticker-bar';

export function DashboardHeader({ tickerItems }: { tickerItems: string[] }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-200">
            <Activity className="h-3.5 w-3.5" /> Market Pulse Live
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Biddable and Coffee</h1>
          <p className="mt-2 max-w-3xl text-slate-300">Daily pulse for DSP news, programmatic marketplace movement, Disney Advertising updates, and coffee-fueled market chatter.</p>
        </div>
        <div className="glass rounded-xl px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current Time</p>
          <p className="text-lg font-semibold text-cyan-200">{now.toLocaleString()}</p>
        </div>
      </div>
      <TickerBar items={tickerItems} />
    </section>
  );
}
