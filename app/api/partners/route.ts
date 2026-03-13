import { NextResponse } from 'next/server';
import { fetchStockMetrics } from '@/lib/services';

// Backward-compatible alias route. Frontend should prefer /api/stocks.
export const revalidate = 300;

export async function GET() {
  try {
    const data = await fetchStockMetrics();
    return NextResponse.json({ data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/partners] failed to fetch stock metrics', error);
    return NextResponse.json({ error: 'Unable to load partner metrics right now.' }, { status: 502 });
  }
}
