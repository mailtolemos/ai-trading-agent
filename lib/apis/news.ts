import axios from 'axios';

const NEWS_API_BASE = 'https://newsapi.org/v2';
const API_KEY = process.env.NEWSAPI_API_KEY;

export interface NewsArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export async function fetchCryptoNews(
  query = 'cryptocurrency',
  limit = 10
): Promise<NewsArticle[]> {
  if (!API_KEY) {
    console.warn('NewsAPI key not configured, returning mock data');
    return getMockNews();
  }

  try {
    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        q: query,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: limit,
        apiKey: API_KEY,
      },
      timeout: 10000,
    });

    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return getMockNews();
  }
}

export async function fetchBitcoinNews(limit = 5): Promise<NewsArticle[]> {
  return fetchCryptoNews('bitcoin', limit);
}

export async function fetchEthereumNews(limit = 5): Promise<NewsArticle[]> {
  return fetchCryptoNews('ethereum', limit);
}

export async function fetchTopCryptoNews(limit = 15): Promise<NewsArticle[]> {
  return fetchCryptoNews('cryptocurrency OR bitcoin OR ethereum', limit);
}

function getMockNews(): NewsArticle[] {
  return [
    {
      source: { id: null, name: 'CoinTelegraph' },
      author: 'News API',
      title: 'Bitcoin Reaches New Height in Market Rally',
      description: 'BTC continues uptrend with strong institutional interest',
      url: 'https://cointelegraph.com',
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: 'Bitcoin shows strong momentum...',
    },
  ];
}
