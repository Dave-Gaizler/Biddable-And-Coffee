import { Card } from '@/components/ui';

export type Platform = { name: string; status: string; note: string; partner: string };

export function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <Card className="transition hover:border-violet-300/40">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold">{platform.name}</h3>
        <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs text-cyan-200">{platform.status}</span>
      </div>
      <p className="text-sm text-slate-300">{platform.note}</p>
      <p className="mt-3 text-sm text-slate-400">{platform.partner}</p>
    </Card>
  );
}
