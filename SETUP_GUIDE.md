# Complete Setup Guide - AI Trading Agent

Follow this step-by-step guide to get the AI Trading Agent running with free APIs.

## Step 1: Get Your API Keys (30 minutes)

### 1.1 Google Gemini API (Free)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Click "Create API key in new Google Cloud project"
4. Copy the API key
5. **Important**: The free tier is quite generous - 60 requests per minute

```
GOOGLE_AI_API_KEY=<your_key_here>
```

### 1.2 CoinGecko (Free)

CoinGecko doesn't require an API key for free tier! 🎉

```
# No key needed - we access it directly via:
# https://api.coingecko.com/api/v3
```

### 1.3 Alternative.me Fear & Greed (Free)

Also free, no key required!

```
# Access via: https://api.alternative.me/fng
```

### 1.4 NewsAPI (Optional but recommended)

1. Go to [NewsAPI](https://newsapi.org/)
2. Sign up for free account
3. Get your free API key (100 requests/day)
4. Copy the key

```
NEWSAPI_API_KEY=<your_key_here>
```

If you skip this, the system uses mock news data.

### 1.5 GitHub API Token (Optional)

1. Go to [GitHub Settings → Developer Settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name: "AI Trading Agent"
4. Select scopes: `public_repo`, `read:user`
5. Generate and copy

```
GITHUB_API_TOKEN=<your_token_here>
```

### 1.6 Glassnode API (Optional)

1. Go to [Glassnode](https://glassnode.com/)
2. Sign up (free tier available)
3. Get API key from dashboard

```
GLASSNODE_API_KEY=<your_key_here>
```

### 1.7 Messari API (Optional)

1. Go to [Messari API](https://messari.io/api)
2. Free tier doesn't require authentication
3. Can optionally get API key for higher limits

```
# No key needed for basic access
```

## Step 2: Set Up Supabase (15 minutes)

### 2.1 Create Supabase Project

1. Go to [Supabase](https://app.supabase.com/)
2. Click "New Project"
3. Fill in details:
   - Name: `ai-trading-agent`
   - Password: Generate strong password
   - Region: Choose closest to you
4. Click "Create new project" and wait 2-3 minutes

### 2.2 Get Supabase Credentials

1. Go to project settings → API
2. Copy these values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. For service role (scroll down):

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Initialize Database

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste into the query editor
5. Click "Run"
6. Wait for completion (should say "Success")

Done! Your database is ready.

## Step 3: Set Up Inngest (10 minutes)

### 3.1 Create Inngest Account

1. Go to [Inngest](https://www.inngest.com/)
2. Sign up (free tier available)
3. Click "Create Workspace"
4. Give it a name: `trading-agent`

### 3.2 Get Inngest Keys

1. Go to Workspace Settings → Keys
2. Copy:

```
INNGEST_EVENT_KEY=<your_event_key>
INNGEST_SIGNING_KEY=<your_signing_key>
```

These are used for webhook security between your app and Inngest.

## Step 4: Local Development Setup (20 minutes)

### 4.1 Clone Repository

```bash
git clone https://github.com/mailtolemos/ai-trading-agent.git
cd ai-trading-agent
```

### 4.2 Install Dependencies

```bash
npm install
# or
yarn install
```

### 4.3 Create .env.local File

Copy the template:

```bash
cp .env.local.example .env.local
```

### 4.4 Fill in All Variables

Edit `.env.local` with your API keys from Steps 1-3:

```env
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Required - Google Gemini
GOOGLE_AI_API_KEY=your_gemini_key

# Required - Inngest
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key

# Optional but recommended - NewsAPI
NEWSAPI_API_KEY=your_newsapi_key

# Optional - GitHub
GITHUB_API_TOKEN=your_github_token

# Optional - Other APIs
GLASSNODE_API_KEY=your_glassnode_key
MESSARI_API_KEY=your_messari_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4.5 Start Development Server

```bash
npm run dev
```

Output should show:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
```

### 4.6 Access Dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- Header with live indicator
- Price board (loads real data)
- Analysis progress (7-step workflow)
- Fear & Greed gauge
- Trading signals
- News feed
- System logs

## Step 5: Deploy to Vercel (15 minutes)

### 5.1 Push to GitHub

```bash
git remote add origin https://github.com/mailtolemos/ai-trading-agent.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 5.2 Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/mailtolemos/ai-trading-agent`
5. Click "Import"

### 5.3 Add Environment Variables

1. In Vercel project settings → Environment Variables
2. Add all variables from `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - GOOGLE_AI_API_KEY
   - INNGEST_EVENT_KEY
   - INNGEST_SIGNING_KEY
   - NEWSAPI_API_KEY
   - GITHUB_API_TOKEN
   - GLASSNODE_API_KEY
   - MESSARI_API_KEY
   - NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app

3. Click "Save"

### 5.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Copy the deployment URL
4. Test at `https://your-app.vercel.app`

### 5.5 Set Up Inngest Webhook

1. Go to [Inngest Dashboard](https://app.inngest.com/)
2. Go to Workspace Settings → Connections
3. Click "New Connection" → "Next.js"
4. Enter Deployment URL: `https://your-app.vercel.app`
5. Save

Done! Inngest will now send background jobs to your Vercel deployment.

## Step 6: Monitoring & Testing

### 6.1 Test Dashboard

Visit your deployed URL and verify:
- Prices update automatically
- Fear & Greed shows current value
- News articles appear
- Analysis progress shows

### 6.2 Check Logs

- **Vercel Logs**: Vercel Dashboard → Deployments → Logs
- **Supabase Logs**: Supabase → Logs
- **Inngest Logs**: Inngest Dashboard → Workflows

### 6.3 Database Verification

In Supabase SQL Editor:

```sql
-- Check if signals are being saved
SELECT COUNT(*) FROM trading_signals;

-- Check latest signals
SELECT * FROM trading_signals ORDER BY created_at DESC LIMIT 5;

-- Check analysis jobs
SELECT * FROM analysis_jobs ORDER BY started_at DESC LIMIT 5;
```

## Troubleshooting

### "Connection refused" error
- Verify Supabase URL is correct
- Check database is created in Supabase
- Verify schema.sql was fully executed

### "API key invalid" error
- Check you copied the key correctly (no spaces)
- Verify the API is enabled in its respective service
- Re-generate key if needed

### "Inngest webhook not triggering"
- Verify webhook URL is set correctly in Inngest
- Check Vercel logs for errors
- Ensure /api/inngest endpoint is deployed

### "Gemini API rate limited"
- Free tier: 60 requests/minute
- Wait a few minutes for rate limit to reset
- Upgrade to paid tier for higher limits

### "News articles not appearing"
- If NewsAPI key not set, uses mock data (normal)
- Check NewsAPI account has not exceeded 100/day limit
- Verify API key in Supabase env variables

## Next Steps

### Customize Signals

Edit `lib/ai/gemini.ts` to adjust:
- Analysis criteria
- Confidence thresholds
- Signal rules

### Add More Cryptocurrencies

Edit `lib/apis/coingecko.ts`:

```typescript
const COINS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  // Add more coin IDs here
};
```

### Adjust Workflow Frequency

Edit `lib/inngest/functions.ts`:

```typescript
export const completeAnalysis = inngest.createFunction(
  { id: 'complete-analysis' },
  { cron: '*/5 * * * *' }, // Change this - currently every 5 minutes
  // ... rest of function
);
```

### Store Historical Data

The `signal_history` table is ready for tracking signal accuracy:

```sql
INSERT INTO signal_history (symbol, signal_type, price_point, accuracy)
VALUES ('BTC', 'BUY', 45000.00, true);
```

## Support

- **API Documentation**:
  - [CoinGecko Docs](https://docs.coingecko.com/reference/introduction)
  - [NewsAPI Docs](https://newsapi.org/docs)
  - [Gemini API](https://ai.google.dev/)
  - [Supabase Docs](https://supabase.com/docs)
  - [Inngest Docs](https://docs.inngest.com/)

- **GitHub Issues**: Report bugs or request features

- **Discord**: Join [Inngest Discord](https://discord.gg/inngest) for support

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run linter

# Database
npm run db:push         # Push changes to Supabase
npm run db:studio       # Open Supabase Studio

# Git
git push                # Deploy to Vercel (if connected)
```

---

🎉 You're all set! Your AI Trading Agent is ready to analyze crypto markets 24/7 with completely free APIs!
