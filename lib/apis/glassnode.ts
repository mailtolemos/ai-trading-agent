import axios from 'axios';

const GLASSNODE_API = 'https://api.glassnode.com/v1';
const API_KEY = process.env.GLASSNODE_API_KEY;

export interface OnChainMetrics {
  symbol: string;
  active_addresses: number;
  whale_transactions: number;
  exchange_inflow: number;
  exchange_outflow: number;
  miner_outflow: number;
  average_transaction_value: number;
  transaction_volume: number;
  timestamp: string;
}

export async function fetchOnChainMetrics(asset = 'BTC'): Promise<OnChainMetrics | null> {
  if (!API_KEY) {
    console.warn('Glassnode API key not configured');
    return getMockOnChainMetrics(asset);
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = now - 7 * 24 * 60 * 60;

    // Fetch multiple metrics
    const [activeAddresses, exchangeFlows, whaleTransactions] = await Promise.all([
      axios.get(`${GLASSNODE_API}/metrics/addresses/active_count`, {
        params: {
          a: asset.toLowerCase(),
          s: sevenDaysAgo,
          u: now,
          api_key: API_KEY,
        },
        timeout: 10000,
      }).catch(() => ({ data: [] })),
      
      axios.get(`${GLASSNODE_API}/metrics/transfers/volume_in`, {
        params: {
          a: asset.toLowerCase(),
          s: sevenDaysAgo,
          u: now,
          api_key: API_KEY,
        },
        timeout: 10000,
      }).catch(() => ({ data: [] })),

      axios.get(`${GLASSNODE_API}/metrics/transactions/transfers_to_exchanges_value`, {
        params: {
          a: asset.toLowerCase(),
          s: sevenDaysAgo,
          u: now,
          api_key: API_KEY,
        },
        timeout: 10000,
      }).catch(() => ({ data: [] })),
    ]);

    const activeAddressesValue = activeAddresses.data[activeAddresses.data.length - 1]?.v || 0;
    const exchangeInflowValue = exchangeFlows.data[exchangeFlows.data.length - 1]?.v || 0;
    const whaleValue = whaleTransactions.data[whaleTransactions.data.length - 1]?.v || 0;

    return {
      symbol: asset,
      active_addresses: Math.floor(activeAddressesValue),
      whale_transactions: Math.floor(whaleValue),
      exchange_inflow: Math.floor(exchangeInflowValue),
      exchange_outflow: 0,
      miner_outflow: 0,
      average_transaction_value: 0,
      transaction_volume: 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching on-chain metrics for ${asset}:`, error);
    return getMockOnChainMetrics(asset);
  }
}

export async function fetchMultipleOnChainMetrics(
  assets = ['BTC', 'ETH']
): Promise<Record<string, OnChainMetrics>> {
  const results: Record<string, OnChainMetrics> = {};

  for (const asset of assets) {
    const metrics = await fetchOnChainMetrics(asset);
    if (metrics) {
      results[asset] = metrics;
    }
  }

  return results;
}

function getMockOnChainMetrics(symbol: string): OnChainMetrics {
  return {
    symbol,
    active_addresses: Math.floor(Math.random() * 1000000) + 500000,
    whale_transactions: Math.floor(Math.random() * 500) + 100,
    exchange_inflow: Math.floor(Math.random() * 50000) + 10000,
    exchange_outflow: Math.floor(Math.random() * 50000) + 10000,
    miner_outflow: Math.floor(Math.random() * 10000),
    average_transaction_value: Math.random() * 100000 + 10000,
    transaction_volume: Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
  };
}
