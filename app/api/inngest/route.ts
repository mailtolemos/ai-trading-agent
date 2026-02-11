import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { 
  fetchPrices, 
  fetchNews, 
  analyzeSentiments, 
  fetchOnChain, 
  trackDevelopers, 
  generateSignals,
  completeAnalysis 
} from '@/lib/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    fetchPrices,
    fetchNews,
    analyzeSentiments,
    fetchOnChain,
    trackDevelopers,
    generateSignals,
    completeAnalysis,
  ],
});
