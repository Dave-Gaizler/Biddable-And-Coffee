import { NextResponse } from 'next/server';
import { fetchStockMetrics } from '@/lib/services';

export const revalidate = 300;

export async function GET() {
  try {
    const data = await fetchStockMetrics();
    return NextResponse.json({ data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/stocks] failed to fetch stock metrics', error);
    return NextResponse.json({ error: 'Unable to load stock metrics right now.' }, { status: 502 });
    return Response.json({ data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/stocks] failed to fetch stock metrics', error);
    return Response.json({ error: 'Unable to load stock metrics right now.' }, { status: 502 });
  }
}
