import { NextResponse } from 'next/server';
import { fetchBitcoin } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchBitcoin();
    return NextResponse.json({ data, updatedAt: data.updatedAt });
  } catch (error) {
    console.error('[/api/bitcoin] failed to fetch bitcoin data', error);
    return NextResponse.json({ error: 'Unable to load bitcoin data right now.' }, { status: 502 });
  }
}
