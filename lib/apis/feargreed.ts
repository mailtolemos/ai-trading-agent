import axios from 'axios';

const FEAR_GREED_API = 'https://api.alternative.me/fng';

export interface FearGreedIndex {
  value: number;
  value_classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: string;
  time_until_update: string;
}

export async function fetchFearGreedIndex(): Promise<FearGreedIndex> {
  try {
    const response = await axios.get(FEAR_GREED_API, {
      params: {
        limit: 1,
      },
      timeout: 10000,
    });

    const data = response.data.data[0];
    return {
      value: parseInt(data.value),
      value_classification: data.value_classification,
      timestamp: new Date(parseInt(data.timestamp) * 1000).toISOString(),
      time_until_update: data.time_until_update,
    };
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    throw error;
  }
}

export async function fetchFearGreedHistory(limit = 30): Promise<FearGreedIndex[]> {
  try {
    const response = await axios.get(FEAR_GREED_API, {
      params: {
        limit,
      },
      timeout: 10000,
    });

    return response.data.data.map((item: any) => ({
      value: parseInt(item.value),
      value_classification: item.value_classification,
      timestamp: new Date(parseInt(item.timestamp) * 1000).toISOString(),
      time_until_update: item.time_until_update,
    }));
  } catch (error) {
    console.error('Error fetching Fear & Greed history:', error);
    throw error;
  }
}

export function interpretFearGreed(value: number): {
  interpretation: string;
  sentiment: 'bearish' | 'neutral' | 'bullish';
  color: string;
} {
  if (value < 25) {
    return {
      interpretation: 'Extreme Fear - Potential buying opportunity',
      sentiment: 'bullish',
      color: '#ff0055',
    };
  } else if (value < 45) {
    return {
      interpretation: 'Fear - Some caution warranted',
      sentiment: 'neutral',
      color: '#ffaa00',
    };
  } else if (value < 55) {
    return {
      interpretation: 'Neutral - Mixed signals',
      sentiment: 'neutral',
      color: '#64748b',
    };
  } else if (value < 75) {
    return {
      interpretation: 'Greed - Market getting hot',
      sentiment: 'bullish',
      color: '#00ff00',
    };
  } else {
    return {
      interpretation: 'Extreme Greed - Caution recommended',
      sentiment: 'bearish',
      color: '#0ff',
    };
  }
}
