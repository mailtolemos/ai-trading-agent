# AI Trading Agent - Real-Time Crypto Analysis System

Production-ready AI-powered cryptocurrency trading signal generator using only **FREE APIs**. Real-time dashboard with sentiment analysis, on-chain metrics, and AI-generated trading signals.

## 🎯 Features

### Dashboard
- **Live Price Tracker**: Real-time prices for BTC, ETH, SOL, and 7+ major cryptocurrencies
- **Fear & Greed Index**: Market sentiment indicator with visual gauge
- **Trading Signals**: AI-generated BUY/SELL/HOLD signals with confidence levels
- **News Feed**: Latest crypto news with sentiment indicators
- **Analysis Workflow**: 7-step background job tracking
- **System Log**: Real-time operational logs and status updates
- **Mobile Responsive**: Works perfectly on all device sizes

### Backend
- **7-Step Automated Workflow** (via Inngest):
  1. Fetch live prices from CoinGecko
  2. Fetch latest crypto news from NewsAPI
  3. Analyze sentiment with Google Gemini AI
  4. Get on-chain metrics from Glassnode/Messari
  5. Track GitHub developer activity
  6. Generate AI-powered trading signals
  7. Save results to Supabase with real-time updates

- **Real-time Database**: Supabase for signal storage and retrieval
- **AI Analysis**: Google Gemini (free tier) for sentiment and signal generation
- **Terminal-Style UI**: Professional dark theme with CRT effects

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + custom terminal theme
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL) - free tier
- **Background Jobs**: Inngest - free tier
- **AI**: Google Generative AI (Gemini) - free tier
- **State Management**: Zustand
- **HTTP Client**: Axios

## 📡 Free APIs Used

| API | Purpose | Free Tier | Rate Limit |
|-----|---------|-----------|-----------|
| **CoinGecko** | Crypto prices, market data | ✅ Yes | 10-50 calls/sec |
| **Alternative.me** | Fear & Greed Index | ✅ Yes | Unlimited |
| **NewsAPI** | Crypto news articles | ✅ Yes (100/day) | 100 requests/day |
| **GitHub API** | Developer activity tracking | ✅ Yes | 60/hour (unauthenticated) |
| **Glassnode** | On-chain metrics | ✅ Limited free endpoints | Varies |
| **Messari** | Crypto metrics | ✅ Yes | Unrestricted |
| **Google Gemini** | AI analysis & signals | ✅ Yes | 60 RPM |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Git
- A Supabase account (free tier)
- A Google Cloud project with Gemini API enabled
- NewsAPI key (optional, fallback to mock data)

### 1. Clone & Setup

```bash
git clone https://github.com/mailtolemos/ai-trading-agent.git
cd ai-trading-agent
npm install
```

### 2. Environment Configuration

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase (Get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI (Get from Google Cloud Console)
# 1. Go to https://console.cloud.google.com/
# 2. Enable "Generative Language API"
# 3. Create API key at https://aistudio.google.com/app/apikey
GOOGLE_AI_API_KEY=your_gemini_api_key

# Inngest (Get from https://app.inngest.com)
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key

# Optional API Keys
NEWSAPI_API_KEY=your_newsapi_key
GITHUB_API_TOKEN=your_github_token
GLASSNODE_API_KEY=your_glassnode_key
MESSARI_API_KEY=your_messari_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

#### Option A: Using Supabase Dashboard (Easiest)

1. Create a new Supabase project at https://app.supabase.com
2. Go to SQL Editor
3. Create a new query and paste the contents of `supabase/schema.sql`
4. Click "Run"

#### Option B: Using Supabase CLI

```bash
npm install -g @supabase/cli
supabase link --project-ref your-project-id
supabase db push
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 API Endpoints

### Data Endpoints
- `GET /api/prices` - Fetch current crypto prices
- `GET /api/signals` - Get trading signals (query params: `limit`)
- `GET /api/feargreed` - Get Fear & Greed Index
- `GET /api/news` - Get latest crypto news (query params: `limit`)
- `GET /api/onchain` - Get on-chain metrics (query params: `asset`)

### Control Endpoints
- `POST /api/analyze` - Trigger analysis workflow
- `GET|POST|PUT /api/inngest` - Inngest webhook handler

## 🔄 Analysis Workflow

The system runs a 7-step analysis every 5 minutes (configurable in `lib/inngest/functions.ts`):

```
1. Fetch Prices (14%)
   └─> CoinGecko API for all major cryptocurrencies

2. Fetch News (28%)
   └─> NewsAPI for latest crypto articles

3. Analyze Sentiment (42%)
   └─> Google Gemini AI analyzes news articles

4. On-Chain Data (57%)
   └─> Glassnode/Messari for whale activity, exchange flows

5. Developer Activity (71%)
   └─> GitHub API for commits and repo activity

6. Signal Generation (85%)
   └─> Gemini AI generates trading signals based on all data

7. Save Results (100%)
   └─> Persist to Supabase, trigger real-time updates
```

## 🎨 UI Components

### Page Components
- **Dashboard** (`app/page.tsx`) - Main layout and orchestration

### Widgets
- **Header** - Title, version, live indicator
- **PriceBoard** - Live price ticker with 24h/7d/30d changes
- **SignalBoard** - Trading signals with confidence levels
- **FearGreedWidget** - Visual gauge of market sentiment
- **AnalysisProgress** - 7-step workflow progress indicator
- **NewsWidget** - Latest news with timestamps
- **Terminal** - System logs and status messages

## 🔐 Security Notes

- All sensitive data (API keys) stored in `.env.local` (never committed)
- Supabase Row-Level Security (RLS) policies configured
- API routes validate requests
- No sensitive data logged to client console
- Use environment variables for all credentials

## 📈 Extending the System

### Add New Cryptocurrencies

Edit `lib/apis/coingecko.ts` - add to `COINS` object:

```typescript
const COINS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  // Add more here
};
```

### Add New APIs

1. Create new file in `lib/apis/`
2. Export async functions for API calls
3. Integrate into `lib/inngest/functions.ts`
4. Create API route in `app/api/`

### Customize Signal Generation

Edit the `generateTradingSignal` function in `lib/ai/gemini.ts` to adjust:
- Analysis criteria
- Confidence weights
- Signal thresholds

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub:
```bash
git remote add origin https://github.com/mailtolemos/ai-trading-agent.git
git branch -M main
git push -u origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Select repository
   - Add environment variables
   - Deploy

3. Set up Inngest integration:
   - Go to https://app.inngest.com
   - Connect your Vercel deployment
   - Enable webhook for background jobs

### Environment Variables on Vercel

Add all variables from `.env.local` in Vercel project settings:
- Settings → Environment Variables
- Paste each variable

## 📊 Database Queries

Common queries for analysis:

```sql
-- Get latest signals
SELECT * FROM trading_signals ORDER BY created_at DESC LIMIT 10;

-- Get signals by symbol
SELECT * FROM trading_signals WHERE symbol = 'BTC' ORDER BY created_at DESC;

-- Get most confident signals
SELECT * FROM trading_signals WHERE confidence > 75 ORDER BY created_at DESC;

-- Get analysis job history
SELECT * FROM analysis_jobs ORDER BY started_at DESC LIMIT 20;

-- Get signal accuracy (if tracking)
SELECT signal_type, COUNT(*) as count, 
       SUM(CASE WHEN accuracy = true THEN 1 ELSE 0 END) as correct
FROM signal_history GROUP BY signal_type;
```

## 🐛 Troubleshooting

### API Keys Not Working
- Verify keys are correct in `.env.local`
- Check API service status pages
- Ensure IPs are whitelisted (if required)

### Inngest Jobs Not Running
- Check Inngest dashboard for webhook failures
- Verify webhook URL is correct
- Check Vercel deployment logs

### Supabase Connection Issues
- Verify database credentials
- Check RLS policies allow operations
- Ensure table schema matches expectations

### Gemini API Errors
- Verify API is enabled in Google Cloud Console
- Check rate limits (60 RPM)
- Ensure text is under token limits

## 📝 License

MIT - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to GitHub
5. Open a Pull Request

## 📞 Support

- Check GitHub Issues
- Review API documentation links
- Check Supabase/Inngest documentation
- Review system logs in terminal widget

## 🔗 Useful Links

- [CoinGecko API Docs](https://docs.coingecko.com/reference/introduction)
- [NewsAPI Docs](https://newsapi.org/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Inngest Docs](https://docs.inngest.com/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Built with ❤️ using only FREE APIs**
