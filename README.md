# Biddable and Coffee

Premium internal dashboard MVP for daily programmatic standups.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Modular component architecture with a service layer for live-data upgrades

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Gate behavior
- Entry prompt asks: "What's the fastest growing Transaction Type at Disney?"
- Accepted phrase: `biddable`
- Unlock state stored in `sessionStorage` key `bac-unlocked`

## Data architecture notes
Current implementation uses mock-safe data via service wrappers in `lib/services.ts`.

### Upgrade points for real APIs
- `fetchPartnerMetrics`: connect to public market data API for AMZN/TTD/GOOGL.
- `fetchNewsFeed`: connect to RSS/news aggregation and map to normalized feed schema.
- `fetchBitcoin`: connect to CoinGecko/CoinMarketCap or equivalent.

API routes are wired and ready:
- `/api/partners`
- `/api/news`
- `/api/bitcoin`
