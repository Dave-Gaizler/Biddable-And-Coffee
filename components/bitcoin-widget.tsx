'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bitcoin, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatChange, formatPrice } from '@/lib/utils';

type BTC = { price: number; changePct: number; updatedAt: string; history: number[] };

export function BitcoinWidget() {
  const [data, setData] = useState<BTC | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/bitcoin');
      const json = await res.json();
      setData(json.data);
    };
    load();
    const interval = setInterval(load, 120000);
    return () => clearInterval(interval);
  }, []);

  const chartStats = useMemo(() => {
    if (!data?.history?.length) return null;

    const width = 280;
    const height = 70;
    const min = Math.min(...data.history);
    const max = Math.max(...data.history);
    const range = max - min || 1;

    const line = data.history
      .map((point, index) => {
        const x = (index / Math.max(data.history.length - 1, 1)) * width;
        const y = height - ((point - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');

    const area = `0,${height} ${line} ${width},${height}`;

    return { line, area, min, max };
  }, [data]);

  if (!data) return <Card>Loading BTC pulse...</Card>;

  const positive = data.changePct >= 0;

  return (
    <Card className="border-amber-300/20 bg-amber-400/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Bitcoin className="h-5 w-5 text-amber-300" /> Bitcoin Tracker</h3>
        <span className="text-xs text-slate-400">{new Date(data.updatedAt).toLocaleTimeString()}</span>
      </div>
      <p className="text-2xl font-bold text-amber-200">{formatPrice(data.price)}</p>
      <p className={`mt-1 inline-flex items-center gap-1 text-sm ${positive ? 'text-emerald-300' : 'text-rose-300'}`}>
        {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {formatChange(data.changePct)} today
      </p>

      <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/40 p-2">
        {chartStats ? (
          <>
            <svg viewBox="0 0 280 70" className="h-20 w-full">
              <defs>
                <linearGradient id="btcArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={positive ? '#34d399' : '#fb7185'} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={positive ? '#34d399' : '#fb7185'} stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <polygon points={chartStats.area} fill="url(#btcArea)" />
              <polyline
                fill="none"
                stroke={positive ? '#34d399' : '#fb7185'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartStats.line}
              />
            </svg>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>24h low {formatPrice(chartStats.min)}</span>
              <span>24h high {formatPrice(chartStats.max)}</span>
            </div>
          </>
        ) : (
          <p className="px-2 py-6 text-center text-xs text-slate-400">Chart data loading...</p>
        )}
      </div>
    </Card>
  );
}
