export type PartnerMetric = {
  name: string;
  symbol?: string;
  price?: number;
  changePct?: number;
  status: string;
  note: string;
};

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  snippet: string;
  url: string;
  category: string;
};

export type BitcoinSnapshot = {
  price: number;
  changePct: number;
  updatedAt: string;
};

type FinnhubQuoteResponse = {
  c?: number; // current
  dp?: number; // percent change
};

type NewsApiResponse = {
  articles?: Array<{
    title?: string;
    source?: { name?: string };
    publishedAt?: string;
    description?: string;
    url?: string;
  }>;
};

const STOCK_COPY: Omit<PartnerMetric, 'price' | 'changePct'>[] = [
  {
    name: 'Amazon',
    symbol: 'AMZN',
    status: 'Watching retail media acceleration',
    note: 'Ads org commentary points to increased full-funnel measurement focus.'
  },
  {
    name: 'The Trade Desk',
    symbol: 'TTD',
    status: 'CTV signal strength remains high',
    note: 'UID2 and premium supply curation remain central narrative pillars.'
  },
  {
    name: 'Google',
    symbol: 'GOOGL',
    status: 'Video + AI messaging in focus',
    note: 'YouTube ad products and DV360 workflow enhancements are active watch areas.'
  }
];

const NEWS_QUERY = [
  'Amazon Ads',
  'Amazon DSP',
  'The Trade Desk',
  'Google DV360',
  'Google Ads',
  'Yahoo DSP',
  'Disney Advertising',
  'programmatic advertising',
  'CTV advertising',
  'streaming ads'
].join(' OR ');

const categorizeNews = (headline: string, snippet: string) => {
  const text = `${headline} ${snippet}`.toLowerCase();

  if (text.includes('amazon')) return 'Amazon Ads';
  if (text.includes('trade desk') || text.includes('ttd')) return 'The Trade Desk';
  if (text.includes('google') || text.includes('dv360') || text.includes('youtube')) return 'Google';
  if (text.includes('yahoo')) return 'Yahoo DSP';
  if (text.includes('disney')) return 'Disney Advertising';
  if (text.includes('ctv') || text.includes('connected tv')) return 'CTV';
  if (text.includes('streaming')) return 'Streaming';

  return 'Programmatic';
};

export async function fetchStockMetrics(): Promise<PartnerMetric[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    throw new Error('FINNHUB_API_KEY is not set');
  }

  const livePartners = await Promise.all(
    STOCK_COPY.map(async (partner) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${partner.symbol}&token=${apiKey}`,
        { next: { revalidate: 300 } }
      );

      if (!res.ok) {
        throw new Error(`Finnhub quote failed for ${partner.symbol}`);
      }

      const quote = (await res.json()) as FinnhubQuoteResponse;
      if (typeof quote.c !== 'number' || typeof quote.dp !== 'number') {
        throw new Error(`Finnhub quote missing fields for ${partner.symbol}`);
      }

      return {
        ...partner,
        price: quote.c,
        changePct: quote.dp
      } satisfies PartnerMetric;
    })
  );

  return [
    ...livePartners,
    {
      name: 'Yahoo',
      status: 'Private / Not Publicly Traded',
      note: 'Yahoo DSP remains strategically relevant for omnichannel and performance-minded planning.'
    }
  ];
}

export async function fetchNewsFeed(): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NEWS_API_KEY is not set');
  }

  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.set('q', NEWS_QUERY);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('pageSize', '20');
  url.searchParams.set('apiKey', apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 900 } });
  if (!res.ok) {
    throw new Error(`NewsAPI request failed with status ${res.status}`);
  }

  const payload = (await res.json()) as NewsApiResponse;
  const articles = payload.articles ?? [];

  return articles
    .filter((article) => article.title && article.url && article.publishedAt)
    .slice(0, 12)
    .map((article, index) => {
      const headline = article.title ?? 'Untitled';
      const snippet = article.description ?? 'No summary available.';
      return {
        id: `${index}-${article.url}`,
        headline,
        source: article.source?.name ?? 'Unknown source',
        publishedAt: article.publishedAt ?? new Date().toISOString(),
        snippet,
        url: article.url ?? '#',
        category: categorizeNews(headline, snippet)
      } satisfies NewsItem;
    });
}

export async function fetchBitcoin(): Promise<BitcoinSnapshot> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`CoinGecko request failed with status ${res.status}`);
  }

  const payload = (await res.json()) as {
    bitcoin?: { usd?: number; usd_24h_change?: number };
  };

  const price = payload.bitcoin?.usd;
  const changePct = payload.bitcoin?.usd_24h_change;

  if (typeof price !== 'number' || typeof changePct !== 'number') {
    throw new Error('CoinGecko response missing price fields');
  }

  return {
    price,
    changePct,
    updatedAt: new Date().toISOString()
  };
}
