import { fetchPartnerMetrics } from '@/lib/services';

export async function GET() {
  const data = await fetchPartnerMetrics();
  return Response.json({ data, updatedAt: new Date().toISOString() });
}
