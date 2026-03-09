import { fetchNewsFeed } from '@/lib/services';

export async function GET() {
  const data = await fetchNewsFeed();
  return Response.json({ data, updatedAt: new Date().toISOString() });
}
