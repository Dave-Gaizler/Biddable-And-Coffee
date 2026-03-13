import { NextResponse } from 'next/server';
import { fetchNewsFeed } from '@/lib/services';

export const revalidate = 900;

export async function GET() {
  try {
    const data = await fetchNewsFeed();
    return NextResponse.json({ data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/news] failed to fetch news feed', error);
    return NextResponse.json({ error: 'Unable to load news feed right now.' }, { status: 502 });
  }
}
