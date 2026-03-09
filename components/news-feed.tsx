'use client';

import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { NewsItem } from '@/lib/services';

export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to load headlines');
      const json = await res.json();
      setItems(json.data);
      setUpdatedAt(json.updatedAt);
    } catch {
      setError('Newswire hit static. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 180000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Talkin’ Biddness</h2>
        <div className="flex items-center gap-3">
          {updatedAt ? <p className="text-xs text-slate-400">Updated {new Date(updatedAt).toLocaleTimeString()}</p> : null}
          <Button onClick={load} className="inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4" />Refresh</Button>
        </div>
      </div>

      {loading ? <p className="text-slate-300">Loading market bulletin...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      {!loading && !error && items.length === 0 ? <p className="text-slate-300">No fresh chatter yet. Check back shortly.</p> : null}

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-cyan-300/30">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-cyan-300/30 px-2 py-1 text-cyan-200">{item.category}</span>
              <span className="text-slate-400">{item.source}</span>
              <span className="text-slate-500">{new Date(item.publishedAt).toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-medium">{item.headline}</h3>
            <p className="mt-1 text-sm text-slate-300">{item.snippet}</p>
            <a className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200" href={item.url} target="_blank" rel="noreferrer">Read more ↗</a>
          </article>
        ))}
      </div>
    </Card>
  );
}
