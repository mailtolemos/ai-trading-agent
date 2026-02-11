import axios from 'axios';

const MESSARI_API = 'https://data.messari.io/api/v1';

export interface MessariMetrics {
  symbol: string;
  name: string;
  pe_ratio: number;
  price_to_sales: number;
  fcf_yield: number;
  revenue_per_mcap: number;
  timestamp: string;
}

const ASSETS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  cardano: 'cardano',
  polkadot: 'polkadot',
};

export async function fetchMessariMetrics(
  assetKey: keyof typeof ASSETS
): Promise<MessariMetrics | null> {
  const assetId = ASSETS[assetKey];

  try {
    const response = await axios.get(
      `${MESSARI_API}/assets/${assetId}/metrics/details`,
      {
        timeout: 10000,
      }
    );

    const data = response.data.data;

    return {
      symbol: data.symbol,
      name: data.name,
      pe_ratio: data.valuations?.price_to_earnings || 0,
      price_to_sales: data.valuations?.price_to_sales || 0,
      fcf_yield: data.valuations?.fcf_yield || 0,
      revenue_per_mcap: data.valuations?.revenue_per_mcap || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching Messari metrics for ${assetKey}:`, error);
    return null;
  }
}

export async function fetchAllMessariMetrics(): Promise<
  Record<string, MessariMetrics>
> {
  const results: Record<string, MessariMetrics> = {};

  for (const key of Object.keys(ASSETS)) {
    const metrics = await fetchMessariMetrics(key as keyof typeof ASSETS);
    if (metrics) {
      results[key] = metrics;
    }
  }

  return results;
}

export async function fetchAssetProfile(
  assetKey: keyof typeof ASSETS
): Promise<any> {
  const assetId = ASSETS[assetKey];

  try {
    const response = await axios.get(
      `${MESSARI_API}/assets/${assetId}/profile`,
      {
        timeout: 10000,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(`Error fetching profile for ${assetKey}:`, error);
    return null;
  }
}
