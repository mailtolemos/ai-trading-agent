# API Documentation

Complete API reference for the AI Trading Agent system.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-app.vercel.app`

## Authentication

No authentication required for GET endpoints. POST/PUT endpoints validate Inngest signatures.

## Endpoints

### Prices API

#### GET /api/prices

Fetch current cryptocurrency prices for all tracked assets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "current_price": 45000.50,
      "market_cap": 880000000000,
      "market_cap_rank": 1,
      "fully_diluted_valuation": 900000000000,
      "total_volume": 25000000000,
      "high_24h": 45500.00,
      "low_24h": 44500.00,
      "price_change_24h": 1200.50,
      "price_change_percentage_24h": 2.67,
      "price_change_percentage_7d": 5.23,
      "price_change_percentage_30d": 15.45,
      "market_cap_change_24h": 15000000000,
      "market_cap_change_percentage_24h": 1.72,
      "circulating_supply": 21000000,
      "total_supply": 21000000,
      "ath": 69000.00,
      "atl": 100.00,
      "last_updated": "2024-02-11T10:30:00Z"
    }
  ],
  "timestamp": "2024-02-11T10:30:00Z"
}
```

**Query Parameters:**
- None

**Rate Limit:** 10-50 calls/sec (CoinGecko free tier)

---

### Signals API

#### GET /api/signals

Retrieve trading signals from the database.

**Query Parameters:**
- `limit` (integer, default: 50) - Maximum number of signals to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "symbol": "BTC",
      "signal": "BUY",
      "confidence": 78,
      "reasoning": "Strong positive sentiment combined with oversold conditions and institutional buying pressure indicated by whale transactions.",
      "metrics": {
        "price": 45000.50,
        "fearGreed": 42,
        "sentiment": "positive",
        "onChain": "BTC",
        "devActivity": 25
      },
      "created_at": "2024-02-11T10:15:00Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-02-11T10:30:00Z"
}
```

**Rate Limit:** Unlimited (Supabase free tier)

---

### Fear & Greed API

#### GET /api/feargreed

Get the current Fear & Greed Index value.

**Response:**
```json
{
  "success": true,
  "data": {
    "value": 42,
    "value_classification": "Fear",
    "timestamp": "2024-02-11T10:00:00Z",
    "time_until_update": "60s"
  },
  "timestamp": "2024-02-11T10:30:00Z"
}
```

**Fear & Greed Interpretation:**
- 0-25: Extreme Fear (typically bullish indicator)
- 25-45: Fear (cautious)
- 45-55: Neutral (mixed signals)
- 55-75: Greed (market heating up)
- 75-100: Extreme Greed (potentially risky)

**Rate Limit:** Unlimited (Alternative.me)

---

### News API

#### GET /api/news

Fetch latest cryptocurrency news articles.

**Query Parameters:**
- `limit` (integer, default: 15) - Maximum number of articles to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "source": {
        "id": "cointelegraph",
        "name": "Cointelegraph"
      },
      "author": "John Doe",
      "title": "Bitcoin Hits New Heights as Institutional Interest Grows",
      "description": "BTC shows strong momentum with major institutions entering the market...",
      "url": "https://cointelegraph.com/article/bitcoin-new-heights",
      "urlToImage": "https://...",
      "publishedAt": "2024-02-11T10:15:00Z",
      "content": "Full article content..."
    }
  ],
  "count": 15,
  "timestamp": "2024-02-11T10:30:00Z"
}
```

**Rate Limit:** 100 requests/day (NewsAPI free tier)

---

### On-Chain Metrics API

#### GET /api/onchain

Get on-chain metrics for a specific cryptocurrency.

**Query Parameters:**
- `asset` (string, default: "BTC") - Cryptocurrency symbol (BTC, ETH, SOL, etc.)

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC",
    "active_addresses": 850000,
    "whale_transactions": 425,
    "exchange_inflow": 35000,
    "exchange_outflow": 42000,
    "miner_outflow": 8500,
    "average_transaction_value": 85000,
    "transaction_volume": 2500000000,
    "timestamp": "2024-02-11T10:30:00Z"
  },
  "timestamp": "2024-02-11T10:30:00Z"
}
```

**Metrics Explained:**
- `active_addresses`: Number of unique addresses transacting
- `whale_transactions`: Large transactions (typically >1000 BTC)
- `exchange_inflow`: Amount flowing into exchanges (potentially bearish)
- `exchange_outflow`: Amount flowing out of exchanges (potentially bullish)
- `miner_outflow`: Amount miners are selling
- `average_transaction_value`: Mean value per transaction
- `transaction_volume`: Total volume transacted

**Rate Limit:** Varies (Glassnode free tier)

---

### Analysis API

#### POST /api/analyze

Trigger the 7-step analysis workflow manually.

**Request:**
```bash
curl -X POST http://localhost:3000/api/analyze
```

**Response:**
```json
{
  "success": true,
  "message": "Analysis workflow triggered",
  "eventId": "evt_1234567890"
}
```

**Workflow Steps:**
1. Fetch live prices from CoinGecko
2. Fetch latest news from NewsAPI
3. Analyze sentiment with Gemini AI
4. Get on-chain metrics from Glassnode
5. Track developer activity from GitHub
6. Generate trading signals with AI
7. Save results to Supabase

**Rate Limit:** Inngest rate limiting applies

---

### Inngest Webhook

#### GET|POST|PUT /api/inngest

Inngest webhook handler for processing background jobs.

**Note:** This endpoint is called by Inngest servers, not directly by clients.

**Inngest Configuration:**
- Webhook URL: `https://your-app.vercel.app/api/inngest`
- Signed with `INNGEST_SIGNING_KEY`
- Events processed:
  - `trading/analyze` - Triggered on schedule or manual POST

---

## Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Prices fetched successfully |
| 400 | Bad Request | Missing required parameter |
| 401 | Unauthorized | Invalid API key |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | External API down |

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Example:

```json
{
  "error": "Failed to fetch prices"
}
```

---

## Data Models

### TradingSignal

```typescript
interface TradingSignal {
  id: UUID;
  symbol: string;                    // BTC, ETH, SOL, etc.
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;                // 0-100
  reasoning: string;                 // Explanation of signal
  metrics: {
    price: number;
    fearGreed: number;
    sentiment: string;
    onChain: string;
    devActivity: number;
  };
  created_at: ISO8601 timestamp;
  updated_at: ISO8601 timestamp;
}
```

### AnalysisJob

```typescript
interface AnalysisJob {
  id: UUID;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_step: number;              // 1-7
  progress_percentage: number;       // 0-100
  event_data: object;                // Workflow data
  started_at: ISO8601 timestamp;
  completed_at?: ISO8601 timestamp;
  error_message?: string;
}
```

### SignalHistory

```typescript
interface SignalHistory {
  id: UUID;
  symbol: string;
  signal_type: 'BUY' | 'SELL' | 'HOLD';
  price_point: decimal;              // Entry price
  accuracy: boolean;                 // true if profitable
  timestamp: ISO8601 timestamp;
}
```

---

## Example Requests

### Get Latest Signals

```bash
curl http://localhost:3000/api/signals?limit=5
```

### Get Fear & Greed Index

```bash
curl http://localhost:3000/api/feargreed
```

### Get Top 10 Cryptocurrencies

```bash
curl http://localhost:3000/api/prices
```

### Get Recent News

```bash
curl http://localhost:3000/api/news?limit=10
```

### Trigger Analysis

```bash
curl -X POST http://localhost:3000/api/analyze
```

### Get Bitcoin On-Chain Metrics

```bash
curl "http://localhost:3000/api/onchain?asset=BTC"
```

---

## Rate Limits & Best Practices

### API Rate Limits

| Service | Limit | Notes |
|---------|-------|-------|
| CoinGecko | 10-50/sec | Generous free tier |
| NewsAPI | 100/day | Per API key |
| Gemini AI | 60 RPM | Per project |
| GitHub | 60/hour | Unauthenticated |
| Glassnode | Varies | Free tier available |
| Alternative.me | Unlimited | No key needed |

### Best Practices

1. **Cache Results**: Store API responses in Supabase cache table
2. **Batch Requests**: Combine multiple data sources in single workflow
3. **Error Handling**: Implement retry logic with exponential backoff
4. **Monitoring**: Track API performance in Inngest dashboard
5. **Rate Limit Awareness**: Respect free tier limits

### Caching Strategy

The system caches data in `market_data_cache` table:

```sql
INSERT INTO market_data_cache (data_type, asset, raw_data, expires_at)
VALUES ('prices', 'BTC', '{}', NOW() + INTERVAL '5 minutes');
```

---

## WebSocket Support (Future)

Currently, the system uses HTTP polling with 5-second auto-refresh. Future versions will support WebSockets for real-time updates via Supabase Realtime.

---

## Troubleshooting

### "API Rate Limited"
- Add caching layer
- Reduce request frequency
- Upgrade to paid tier

### "No Data Returned"
- Check API key is valid
- Verify endpoint URL is correct
- Check API service status page

### "Webhook Not Received"
- Verify Inngest webhook URL in dashboard
- Check deployment logs for errors
- Ensure signing key matches

### "Database Connection Failed"
- Verify Supabase credentials
- Check VPC/firewall settings
- Ensure schema.sql was fully executed

---

## Support & Resources

- **API Status**: Check individual service status pages
- **Docs**: See README.md and SETUP_GUIDE.md
- **Issues**: GitHub Issues for bug reports
- **Discord**: Community support channels

