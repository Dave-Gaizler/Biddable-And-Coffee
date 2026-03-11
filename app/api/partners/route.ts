import { fetchStockMetrics } from '@/lib/services';

// Backward-compatible alias route. Frontend should prefer /api/stocks.
export async function GET() {
  try {
    const data = await fetchStockMetrics();
    return Response.json({ data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/partners] failed to fetch stock metrics', error);
    return Response.json({ error: 'Unable to load partner metrics right now.' }, { status: 502 });
  }
import { fetchPartnerMetrics } from '@/lib/services';

export async function GET() {
  const data = await fetchPartnerMetrics();
  return Response.json({ data, updatedAt: new Date().toISOString() });
}
