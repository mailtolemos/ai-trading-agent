import axios from 'axios';

const GITHUB_API = 'https://api.github.com';
const TOKEN = process.env.GITHUB_API_TOKEN;

export interface DeveloperActivity {
  repository: string;
  commits_7d: number;
  commits_30d: number;
  pr_merged: number;
  issues_closed: number;
  stars_gained: number;
  last_commit: string;
}

const CRYPTO_REPOS = {
  bitcoin: 'bitcoin/bitcoin',
  ethereum: 'ethereum/go-ethereum',
  solana: 'solana-labs/solana',
  cardano: 'input-output-hk/cardano-node',
  polkadot: 'paritytech/polkadot',
  ripple: 'XRPLF/rippled',
  litecoin: 'litecoin-project/litecoin',
  chainlink: 'smartcontractkit/chainlink',
};

async function fetchRepoCommits(
  owner: string,
  repo: string,
  days = 7
): Promise<number> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/commits`,
      {
        params: {
          since: since.toISOString(),
          per_page: 100,
        },
        headers,
        timeout: 10000,
      }
    );

    return response.data.length || 0;
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    return 0;
  }
}

export async function fetchDeveloperActivity(
  symbol: keyof typeof CRYPTO_REPOS
): Promise<DeveloperActivity | null> {
  const repoPath = CRYPTO_REPOS[symbol];
  if (!repoPath) return null;

  const [owner, repo] = repoPath.split('/');

  try {
    const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

    // Get repo info
    const repoInfo = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers,
      timeout: 10000,
    });

    // Get commits for different time periods
    const commits7d = await fetchRepoCommits(owner, repo, 7);
    const commits30d = await fetchRepoCommits(owner, repo, 30);

    return {
      repository: `${owner}/${repo}`,
      commits_7d: commits7d,
      commits_30d: commits30d,
      pr_merged: 0, // Would need additional API calls
      issues_closed: 0, // Would need additional API calls
      stars_gained: repoInfo.data.stargazers_count || 0,
      last_commit: repoInfo.data.pushed_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching developer activity for ${symbol}:`, error);
    return null;
  }
}

export async function fetchAllDeveloperActivity(): Promise<
  Record<string, DeveloperActivity>
> {
  const results: Record<string, DeveloperActivity> = {};

  for (const symbol of Object.keys(CRYPTO_REPOS)) {
    const activity = await fetchDeveloperActivity(
      symbol as keyof typeof CRYPTO_REPOS
    );
    if (activity) {
      results[symbol] = activity;
    }
  }

  return results;
}
