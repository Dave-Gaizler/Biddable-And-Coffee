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
  history: number[];
};

type YahooQuoteResponse = {
  quoteResponse?: {
    result?: Array<{
      symbol: string;
      regularMarketPrice?: number;
      regularMarketChangePercent?: number;
    }>;
  };
};

const PARTNER_COPY: Omit<PartnerMetric, 'price' | 'changePct'>[] = [
  { name: 'Amazon', symbol: 'AMZN', status: 'Watching retail media acceleration', note: 'Ads org commentary points to increased full-funnel measurement focus.' },
  { name: 'The Trade Desk', symbol: 'TTD', status: 'CTV signal strength remains high', note: 'UID2 and premium supply curation remain central narrative pillars.' },
  { name: 'Google', symbol: 'GOOGL', status: 'Video + AI messaging in focus', note: 'YouTube ad products and DV360 workflow enhancements are active watch areas.' }
];

async function fetchYahooQuotes() {
  const symbols = 'AMZN,TTD,GOOGL';
  const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to load Yahoo quotes');
  }

  const json = (await res.json()) as YahooQuoteResponse;
  const quotes = json.quoteResponse?.result ?? [];
  return new Map(quotes.map((quote) => [quote.symbol, quote]));
}

async function fetchStooqQuotes() {
  const res = await fetch('https://stooq.com/q/l/?s=amzn.us,ttd.us,googl.us&i=d', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to load Stooq quotes');
  }

  const csv = await res.text();
  const rows = csv.trim().split('\n').slice(1);

  const map = new Map<string, { price?: number; changePct?: number }>();
  for (const row of rows) {
    const [symbolRaw, , , openRaw, , , closeRaw] = row.split(',');
    const normalized = symbolRaw?.replace('.US', '').toUpperCase();
    const open = Number(openRaw);
    const close = Number(closeRaw);

    if (!normalized || Number.isNaN(close)) continue;

    const changePct = Number.isFinite(open) && open > 0 ? ((close - open) / open) * 100 : undefined;
    map.set(normalized, { price: close, changePct });
  }

  return map;
}

export async function fetchPartnerMetrics(): Promise<PartnerMetric[]> {
  try {
    let livePriceMap: Map<string, { price?: number; changePct?: number }>;

    try {
      const yahooMap = await fetchYahooQuotes();
      livePriceMap = new Map(
        Array.from(yahooMap.entries()).map(([symbol, quote]) => [
          symbol,
          { price: quote.regularMarketPrice, changePct: quote.regularMarketChangePercent }
        ])
      );
    } catch {
      livePriceMap = await fetchStooqQuotes();
    }

    const livePartners = PARTNER_COPY.map((partner) => {
      const quote = partner.symbol ? livePriceMap.get(partner.symbol) : undefined;
      return {
        ...partner,
        price: quote?.price,
        changePct: quote?.changePct
      } satisfies PartnerMetric;
    });

    const anyLive = livePartners.some((partner) => typeof partner.price === 'number');
    if (!anyLive) throw new Error('No live partner quote values');

    return [
      ...livePartners,
      { name: 'Yahoo', status: 'Private / Not Publicly Traded', note: 'Yahoo DSP remains strategically relevant for omnichannel and performance-minded planning.' }
    ];
  } catch {
    return [
      { name: 'Amazon', symbol: 'AMZN', price: 189.42, changePct: 0.86, status: 'Watching retail media acceleration', note: 'Live quote unavailable; showing fallback snapshot.' },
      { name: 'The Trade Desk', symbol: 'TTD', price: 88.31, changePct: -0.42, status: 'CTV signal strength remains high', note: 'Live quote unavailable; showing fallback snapshot.' },
      { name: 'Google', symbol: 'GOOGL', price: 172.77, changePct: 0.33, status: 'Video + AI messaging in focus', note: 'Live quote unavailable; showing fallback snapshot.' },
      { name: 'Yahoo', status: 'Private / Not Publicly Traded', note: 'Yahoo DSP remains strategically relevant for omnichannel and performance-minded planning.' }
    ];
  }
}

// Replace this mock with RSS/API aggregation (NewsAPI, GDELT, custom feeds) in production.
export async function fetchNewsFeed(): Promise<NewsItem[]> {
  const now = new Date();
  return [
    {
      id: '1',
      headline: 'CTV buyers sharpen focus on premium inventory packaging strategies',
      source: 'AdExchanger',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
      snippet: 'Agency leaders report increased appetite for curated supply pathways and transparent measurement frameworks.',
      url: 'https://www.adexchanger.com/',
      category: 'CTV'
    },
    {
      id: '2',
      headline: 'Amazon Ads expands conversation around full-funnel streaming outcomes',
      source: 'Adweek',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 75).toISOString(),
      snippet: 'New product updates emphasize links between upper-funnel reach and downstream commerce impact.',
      url: 'https://www.adweek.com/',
      category: 'Amazon Ads'
    },
    {
      id: '3',
      headline: 'Programmatic leaders debate identity, AI optimization, and future bidding controls',
      source: 'Digiday',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 110).toISOString(),
      snippet: 'Industry panels highlight balancing automation efficiency with strategic human oversight.',
      url: 'https://digiday.com/',
      category: 'Programmatic'
    }
  ];
}

export async function fetchBitcoin(): Promise<BitcoinSnapshot> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly',
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error('Failed to load BTC chart');
    }

    const json = (await res.json()) as { prices?: Array<[number, number]> };
    const prices = (json.prices ?? []).map((entry) => entry[1]).filter((entry) => Number.isFinite(entry));

    if (prices.length < 2) {
      throw new Error('Insufficient BTC history');
    }

    const open = prices[0];
    const latest = prices[prices.length - 1];
    const changePct = ((latest - open) / open) * 100;

    return {
      price: latest,
      changePct,
      updatedAt: new Date().toISOString(),
      history: prices.slice(-24)
    };
  } catch {
    const fallbackHistory = [67120, 67310, 67080, 67460, 67620, 67990, 68210, 68420];
    return {
      price: 68420.17,
      changePct: 1.52,
      updatedAt: new Date().toISOString(),
      history: fallbackHistory
    };
  }
}
