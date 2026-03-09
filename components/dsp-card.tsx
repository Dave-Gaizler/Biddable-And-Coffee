import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatChange, formatPrice } from '@/lib/utils';
import { PartnerMetric } from '@/lib/services';

export function DspCard({ partner }: { partner: PartnerMetric }) {
  const positive = (partner.changePct ?? 0) >= 0;

  return (
    <Card className="transition hover:border-cyan-300/40">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{partner.name}</h3>
          <p className="text-xs text-slate-400">{partner.symbol ?? 'No ticker'}</p>
        </div>
        {partner.price ? (
          <div className="text-right">
            <p className="font-semibold text-cyan-100">{formatPrice(partner.price)}</p>
            <p className={`inline-flex items-center gap-1 text-sm ${positive ? 'text-emerald-300' : 'text-rose-300'}`}>
              {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatChange(partner.changePct ?? 0)}
            </p>
          </div>
        ) : (
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300">{partner.status}</span>
        )}
      </div>
      <p className="text-sm text-slate-200">{partner.status}</p>
      <p className="mt-2 text-sm text-slate-400">{partner.note}</p>
    </Card>
  );
}
