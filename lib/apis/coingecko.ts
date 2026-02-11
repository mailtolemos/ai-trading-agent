import axios from 'axios';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache
let priceCache: { data: CryptoPrice[], timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

export interface CryptoPrice {
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  atl: number;
  last_updated: string;
}

const COINS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  cardano: 'cardano',
  polkadot: 'polkadot',
  ripple: 'ripple',
  litecoin: 'litecoin',
  chainlink: 'chainlink',
  polygon: 'matic-network',
  avalanche: 'avalanche-2',
};

// Fallback mock data for when API is rate-limited
const getMockPrices = (): CryptoPrice[] => [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    current_price: 45000,
    market_cap: 900000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 945000000000,
    total_volume: 30000000000,
    high_24h: 46000,
    low_24h: 44000,
    price_change_24h: 1000,
    price_change_percentage_24h: 2.3,
    price_change_percentage_7d: 5.2,
    price_change_percentage_30d: 8.1,
    market_cap_change_24h: 20000000000,
    market_cap_change_percentage_24h: 2.3,
    circulating_supply: 21000000,
    total_supply: 21000000,
    ath: 69000,
    atl: 100,
    last_updated: new Date().toISOString(),
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    current_price: 2500,
    market_cap: 300000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 300000000000,
    total_volume: 15000000000,
    high_24h: 2600,
    low_24h: 2400,
    price_change_24h: 50,
    price_change_percentage_24h: 2.0,
    price_change_percentage_7d: 4.5,
    price_change_percentage_30d: 6.2,
    market_cap_change_24h: 6000000000,
    market_cap_change_percentage_24h: 2.0,
    circulating_supply: 120000000,
    total_supply: 120000000,
    ath: 4850,
    atl: 0.5,
    last_updated: new Date().toISOString(),
  },
];

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    // Check cache first
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
      console.log('Returning cached prices');
      return priceCache.data;
    }

    const ids = Object.values(COINS).join(',');
    
    // Get market data
    const marketResponse = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids,
        order: 'market_cap_desc',
        per_page: 250,
        sparkline: false,
      },
      timeout: 10000,
    });

    const prices = marketResponse.data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d: coin.price_change_7d_in_currency,
      price_change_percentage_30d: coin.price_change_percentage_30d_in_currency,
      market_cap_change_24h: coin.market_cap_change_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      ath: coin.ath,
      atl: coin.atl,
      last_updated: new Date().toISOString(),
    }));

    // Update cache
    priceCache = { data: prices, timestamp: Date.now() };
    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices from CoinGecko:', error);
    
    // Return cached data if available, otherwise mock data
    if (priceCache) {
      console.log('Returning stale cached prices due to error');
      return priceCache.data;
    }
    
    console.log('Returning mock prices due to error');
    return getMockPrices();
  }
}

export async function fetchMarketData() {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/global`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
}

export async function fetchTopMovers(limit = 10) {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'volume_desc',
        per_page: limit,
        sparkline: false,
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top movers:', error);
    throw error;
  }
}
