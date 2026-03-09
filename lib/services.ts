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

// Replace this mock with real market APIs (e.g. Finnhub, Alpha Vantage, Polygon) in production.
export async function fetchPartnerMetrics(): Promise<PartnerMetric[]> {
  return [
    { name: 'Amazon', symbol: 'AMZN', price: 189.42, changePct: 0.86, status: 'Watching retail media acceleration', note: 'Ads org commentary points to increased full-funnel measurement focus.' },
    { name: 'The Trade Desk', symbol: 'TTD', price: 88.31, changePct: -0.42, status: 'CTV signal strength remains high', note: 'UID2 and premium supply curation remain central narrative pillars.' },
    { name: 'Google', symbol: 'GOOGL', price: 172.77, changePct: 0.33, status: 'Video + AI messaging in focus', note: 'YouTube ad products and DV360 workflow enhancements are active watch areas.' },
    { name: 'Yahoo', status: 'Private / Not Publicly Traded', note: 'Yahoo DSP remains strategically relevant for omnichannel and performance-minded planning.' }
  ];
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

// Replace with live crypto pricing API (CoinGecko / CoinMarketCap) in production.
export async function fetchBitcoin() {
  return {
    price: 68420.17,
    changePct: 1.52,
    updatedAt: new Date().toISOString()
  };
}
