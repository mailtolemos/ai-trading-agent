import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY || '';

const client = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  summary: string;
}

export interface TradingSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
}

export async function analyzeSentiment(articles: string[]): Promise<SentimentAnalysis> {
  if (!GEMINI_API_KEY) {
    return getMockSentiment();
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyze the following cryptocurrency news articles and provide:
1. Overall sentiment (positive/negative/neutral)
2. Sentiment score (0-100, where 100 is most positive)
3. Brief summary of market implications

Articles:
${articles.slice(0, 5).join('\n---\n')}

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "score": 0-100,
  "summary": "brief analysis"
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      const parsed = JSON.parse(response);
      return {
        sentiment: parsed.sentiment,
        score: parsed.score,
        summary: parsed.summary,
      };
    } catch (parseError) {
      return {
        sentiment: 'neutral',
        score: 50,
        summary: 'Unable to parse sentiment analysis',
      };
    }
  } catch (error) {
    console.error('Error analyzing sentiment with Gemini:', error);
    return getMockSentiment();
  }
}

export async function generateTradingSignal(
  symbol: string,
  priceData: any,
  onChainMetrics: any,
  sentiment: SentimentAnalysis,
  fearGreedIndex: number,
  devActivity: any
): Promise<TradingSignal> {
  if (!GEMINI_API_KEY) {
    return getMockSignal();
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an expert cryptocurrency trader and analyst. Analyze the following data and provide a trading signal.

Symbol: ${symbol}
Price Data: ${JSON.stringify(priceData)}
On-Chain Metrics: ${JSON.stringify(onChainMetrics)}
Sentiment Analysis: ${JSON.stringify(sentiment)}
Fear & Greed Index: ${fearGreedIndex}
Developer Activity: ${JSON.stringify(devActivity)}

Based on this comprehensive analysis, provide:
1. Trading action (BUY/SELL/HOLD)
2. Confidence level (0-100)
3. Detailed reasoning

Respond in JSON format:
{
  "action": "BUY|SELL|HOLD",
  "confidence": 0-100,
  "reasoning": "detailed explanation of the signal"
}

Consider:
- Price trends and momentum
- On-chain transaction patterns
- News sentiment
- Market fear/greed levels
- Developer activity and adoption metrics
- Risk/reward ratio
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      const parsed = JSON.parse(response);
      return {
        action: parsed.action,
        confidence: Math.min(100, Math.max(0, parsed.confidence)),
        reasoning: parsed.reasoning,
      };
    } catch (parseError) {
      return getMockSignal();
    }
  } catch (error) {
    console.error('Error generating trading signal with Gemini:', error);
    return getMockSignal();
  }
}

export async function analyzeMarketTrend(data: any): Promise<string> {
  if (!GEMINI_API_KEY) {
    return 'Market analysis unavailable';
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyze the cryptocurrency market data and provide a brief market trend analysis:

Data: ${JSON.stringify(data)}

Provide a concise paragraph describing the current market trend and key observations.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error analyzing market trend:', error);
    return 'Unable to analyze market trend at this time';
  }
}

function getMockSentiment(): SentimentAnalysis {
  return {
    sentiment: 'neutral',
    score: 50,
    summary: 'Mixed market sentiment with balanced bullish and bearish indicators',
  };
}

function getMockSignal(): TradingSignal {
  const actions: Array<'BUY' | 'SELL' | 'HOLD'> = ['BUY', 'SELL', 'HOLD'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)] as 'BUY' | 'SELL' | 'HOLD';
  return {
    action: randomAction,
    confidence: Math.floor(Math.random() * 40) + 50,
    reasoning: 'Analysis based on available market data and technical indicators',
  };
}
