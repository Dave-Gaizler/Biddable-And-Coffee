# Biddable and Coffee

Premium internal dashboard MVP for daily programmatic standups.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Modular component architecture with API routes backed by live market/news services

## Run locally
```bash
npm install
cp .env.example .env.local
# Add your FINNHUB_API_KEY and NEWS_API_KEY in .env.local
npm run dev
```
Open `http://localhost:3000`.

## Gate behavior
- Entry prompt asks: "What's the fastest growing Transaction Type at Disney?"
- Accepted phrase: `biddable`
- Unlock state stored in `sessionStorage` key `bac-unlocked`

## Live data endpoints
- `/api/bitcoin` (CoinGecko simple price, no-store)
- `/api/stocks` (Finnhub, revalidate every 300s)
- `/api/news` (NewsAPI, revalidate every 900s)

## Required environment variables
```bash
FINNHUB_API_KEY=
NEWS_API_KEY=
```

## Vercel setup (exact steps)
1. Open your Vercel project.
2. Go to **Settings → Environment Variables**.
3. Add:
   - `FINNHUB_API_KEY`
   - `NEWS_API_KEY`
4. Save variables for **Production**, **Preview**, and **Development**.
5. Redeploy the latest `main` deployment.

## Notes
- If keys are missing/invalid, API routes return `502` with an error payload.
- Widget polling cadence:
  - Bitcoin: every 60s
  - Stocks: every 5m
  - News: every 15m
