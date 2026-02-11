import { create } from 'zustand';

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface Signal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  createdAt: string;
}

export interface AnalysisJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStep: number;
  progress: number;
  startedAt: string;
}

interface TradingStore {
  // Crypto data
  cryptoData: CryptoData[];
  setCryptoData: (data: CryptoData[]) => void;
  
  // Trading signals
  signals: Signal[];
  setSignals: (signals: Signal[]) => void;
  addSignal: (signal: Signal) => void;
  
  // Fear & Greed Index
  fearGreedIndex: number;
  setFearGreedIndex: (index: number) => void;
  
  // Sentiment
  sentiment: 'positive' | 'negative' | 'neutral' | null;
  setSentiment: (sentiment: 'positive' | 'negative' | 'neutral') => void;
  
  // Analysis job
  analysisJob: AnalysisJob | null;
  setAnalysisJob: (job: AnalysisJob | null) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;
  
  lastUpdate: Date | null;
  setLastUpdate: (date: Date) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  cryptoData: [],
  setCryptoData: (data) => set({ cryptoData: data }),
  
  signals: [],
  setSignals: (signals) => set({ signals }),
  addSignal: (signal) => set((state) => ({
    signals: [signal, ...state.signals].slice(0, 50),
  })),
  
  fearGreedIndex: 50,
  setFearGreedIndex: (index) => set({ fearGreedIndex: index }),
  
  sentiment: null,
  setSentiment: (sentiment) => set({ sentiment }),
  
  analysisJob: null,
  setAnalysisJob: (job) => set({ analysisJob: job }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  error: null,
  setError: (error) => set({ error }),
  
  lastUpdate: null,
  setLastUpdate: (date) => set({ lastUpdate: date }),
}));
