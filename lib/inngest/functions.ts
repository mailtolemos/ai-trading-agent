import { inngest } from './client';
import { fetchCryptoPrices } from '../apis/coingecko';
import { fetchTopCryptoNews } from '../apis/news';
import { fetchFearGreedIndex } from '../apis/feargreed';
import { fetchOnChainMetrics } from '../apis/glassnode';
import { fetchAllDeveloperActivity } from '../apis/github';
import { analyzeSentiment, generateTradingSignal } from '../ai/gemini';
import { saveTradingSignal, updateAnalysisJob, createAnalysisJob } from '../db/supabase';

const SYMBOLS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot'];
const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];

// Step 1: Fetch live prices
export const fetchPrices = inngest.createFunction(
  { id: 'fetch-prices' },
  { event: 'trading/analyze' },
  async ({ event, step }) => {
    const prices = await step.run('fetch-crypto-prices', async () => {
      return await fetchCryptoPrices();
    });

    return { prices };
  }
);

// Step 2: Fetch news
export const fetchNews = inngest.createFunction(
  { id: 'fetch-news' },
  { event: 'trading/analyze' },
  async ({ event, step }) => {
    const news = await step.run('fetch-crypto-news', async () => {
      return await fetchTopCryptoNews(20);
    });

    return { news };
  }
);

// Step 3: Analyze sentiment
export const analyzeSentiments = inngest.createFunction(
  { id: 'analyze-sentiments' },
  { event: 'trading/analyze' },
  async ({ event, step }) => {
    const news = await step.run('get-news', async () => {
      return await fetchTopCryptoNews(10);
    });

    const sentiment = await step.run('analyze-sentiment', async () => {
      const articles = news.map((n: any) => `${n.title}: ${n.description}`);
      return await analyzeSentiment(articles);
    });

    return { sentiment };
  }
);

// Step 4: Fetch on-chain metrics
export const fetchOnChain = inngest.createFunction(
  { id: 'fetch-on-chain' },
  { event: 'trading/analyze' },
  async ({ event, step }) => {
    const metrics = await step.run('fetch-on-chain-metrics', async () => {
      return await fetchOnChainMetrics('BTC');
    });

    return { metrics };
  }
);

// Step 5: Track developer activity
export const trackDevelopers = inngest.createFunction(
  { id: 'track-developers' },
  { event: 'trading/analyze' },
  async ({ event, step }) => {
    const devActivity = await step.run('fetch-dev-activity', async () => {
      return await fetchAllDeveloperActivity();
    });

    return { devActivity };
  }
);

// Step 6: Generate trading signals (requires all data)
export const generateSignals = inngest.createFunction(
  { id: 'generate-signals' },
  { event: 'trading/analyze' },
  async ({ event, step }) => {
    // Fetch all required data
    const prices = await step.run('fetch-all-prices', async () => {
      return await fetchCryptoPrices();
    });

    const fearGreed = await step.run('fetch-fear-greed', async () => {
      return await fetchFearGreedIndex();
    });

    const news = await step.run('fetch-news-articles', async () => {
      return await fetchTopCryptoNews(15);
    });

    const sentiment = await step.run('analyze-all-sentiment', async () => {
      const articles = news.map((n: any) => `${n.title}: ${n.description}`);
      return await analyzeSentiment(articles);
    });

    const onChain = await step.run('fetch-all-on-chain', async () => {
      return await fetchOnChainMetrics('BTC');
    });

    const devActivity = await step.run('fetch-all-dev-activity', async () => {
      return await fetchAllDeveloperActivity();
    });

    // Generate signals for each crypto
    const signals = await step.run('generate-all-signals', async () => {
      const generatedSignals = [];

      for (let i = 0; i < Math.min(prices.length, SYMBOLS.length); i++) {
        const price = prices[i];
        const symbol = CRYPTO_SYMBOLS[i];

        try {
          const signal = await generateTradingSignal(
            symbol,
            price,
            onChain,
            sentiment,
            fearGreed.value,
            devActivity[SYMBOLS[i]]
          );

          generatedSignals.push({
            symbol,
            signal: signal.action,
            confidence: signal.confidence,
            reasoning: signal.reasoning,
            metrics: {
              price: price.current_price,
              fearGreed: fearGreed.value,
              sentiment: sentiment.sentiment,
              onChain: onChain?.symbol,
              devActivity: devActivity[SYMBOLS[i]]?.commits_7d || 0,
            },
            created_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error(`Error generating signal for ${symbol}:`, err);
        }
      }

      return generatedSignals;
    });

    // Save signals to database
    await step.run('save-signals', async () => {
      for (const signal of signals) {
        try {
          await saveTradingSignal(signal);
        } catch (err) {
          console.error(`Error saving signal for ${signal.symbol}:`, err);
        }
      }
    });

    return { signals };
  }
);

// Main orchestration function - runs all steps
export const completeAnalysis = inngest.createFunction(
  { id: 'complete-analysis' },
  { cron: '*/5 * * * *' }, // Run every 5 minutes
  async ({ step }) => {
    // Create a job record
    const job = await step.run('create-job', async () => {
      return await createAnalysisJob({
        status: 'running',
        current_step: 1,
        progress_percentage: 0,
        event_data: {},
      });
    });

    try {
      const jobId = job.id;
      let stepNumber = 1;

      // Step 1: Fetch prices
      await step.run('step-1-prices', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 1,
          progress_percentage: 14,
        });
        return await fetchCryptoPrices();
      });

      // Step 2: Fetch news
      await step.run('step-2-news', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 2,
          progress_percentage: 28,
        });
        return await fetchTopCryptoNews(20);
      });

      // Step 3: Analyze sentiment
      const news = await fetchTopCryptoNews(10);
      await step.run('step-3-sentiment', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 3,
          progress_percentage: 42,
        });
        const articles = news.map((n: any) => `${n.title}: ${n.description}`);
        return await analyzeSentiment(articles);
      });

      // Step 4: Fetch on-chain
      await step.run('step-4-on-chain', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 4,
          progress_percentage: 57,
        });
        return await fetchOnChainMetrics('BTC');
      });

      // Step 5: Developer activity
      await step.run('step-5-dev', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 5,
          progress_percentage: 71,
        });
        return await fetchAllDeveloperActivity();
      });

      // Step 6: Generate signals
      const prices = await fetchCryptoPrices();
      const fearGreed = await fetchFearGreedIndex();
      const sentiment = await analyzeSentiment(
        news.map((n: any) => `${n.title}: ${n.description}`)
      );
      const onChain = await fetchOnChainMetrics('BTC');
      const devActivity = await fetchAllDeveloperActivity();

      await step.run('step-6-signals', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 6,
          progress_percentage: 85,
        });

        const signals = [];
        for (let i = 0; i < Math.min(prices.length, SYMBOLS.length); i++) {
          const price = prices[i];
          const symbol = CRYPTO_SYMBOLS[i];

          const signal = await generateTradingSignal(
            symbol,
            price,
            onChain,
            sentiment,
            fearGreed.value,
            devActivity[SYMBOLS[i]]
          );

          signals.push({
            symbol,
            signal: signal.action,
            confidence: signal.confidence,
            reasoning: signal.reasoning,
            metrics: {
              price: price.current_price,
              fearGreed: fearGreed.value,
              sentiment: sentiment.sentiment,
            },
            created_at: new Date().toISOString(),
          });
        }

        return signals;
      });

      // Step 7: Save to database
      await step.run('step-7-save', async () => {
        await updateAnalysisJob(jobId, {
          current_step: 7,
          progress_percentage: 100,
          status: 'completed',
        });
      });

      return { status: 'completed', jobId };
    } catch (error) {
      await updateAnalysisJob(job.id, {
        status: 'failed',
      });
      throw error;
    }
  }
);
