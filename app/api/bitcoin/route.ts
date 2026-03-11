import { fetchBitcoin } from '@/lib/services';

export async function GET() {
  try {
    const data = await fetchBitcoin();
    return Response.json({ data, updatedAt: data.updatedAt });
  } catch (error) {
    console.error('[/api/bitcoin] failed to fetch bitcoin data', error);
    return Response.json({ error: 'Unable to load bitcoin data right now.' }, { status: 502 });
  }
  const data = await fetchBitcoin();
  return Response.json({ data });
}
