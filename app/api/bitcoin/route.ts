import { fetchBitcoin } from '@/lib/services';

export async function GET() {
  const data = await fetchBitcoin();
  return Response.json({ data });
}
