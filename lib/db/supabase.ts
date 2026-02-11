import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface TradingSignal {
  id?: string;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  metrics: Record<string, any>;
  created_at?: string;
}

export interface AnalysisJob {
  id?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_step: number;
  progress_percentage: number;
  event_data: Record<string, any>;
  started_at?: string;
  completed_at?: string;
}

export interface SignalHistory {
  id?: string;
  symbol: string;
  signal_type: 'BUY' | 'SELL' | 'HOLD';
  price_point: number;
  timestamp?: string;
  accuracy: boolean;
}

export async function saveTradingSignal(signal: TradingSignal) {
  try {
    const { data, error } = await supabase
      .from('trading_signals')
      .insert([signal])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving trading signal:', error);
    throw error;
  }
}

export async function getTradingSignals(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('trading_signals')
      .select()
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trading signals:', error);
    return [];
  }
}

export async function getLatestSignal(symbol: string) {
  try {
    const { data, error } = await supabase
      .from('trading_signals')
      .select()
      .eq('symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching latest signal for ${symbol}:`, error);
    return null;
  }
}

export async function createAnalysisJob(job: AnalysisJob) {
  try {
    const { data, error } = await supabase
      .from('analysis_jobs')
      .insert([job])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating analysis job:', error);
    throw error;
  }
}

export async function updateAnalysisJob(id: string, updates: Partial<AnalysisJob>) {
  try {
    const { data, error } = await supabase
      .from('analysis_jobs')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating analysis job:', error);
    throw error;
  }
}

export async function getAnalysisJob(id: string) {
  try {
    const { data, error } = await supabase
      .from('analysis_jobs')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching analysis job:', error);
    return null;
  }
}

export async function saveSignalHistory(history: SignalHistory) {
  try {
    const { data, error } = await supabase
      .from('signal_history')
      .insert([history])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving signal history:', error);
    throw error;
  }
}

export async function getSignalHistory(symbol: string, limit = 100) {
  try {
    const { data, error } = await supabase
      .from('signal_history')
      .select()
      .eq('symbol', symbol)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching signal history:', error);
    return [];
  }
}

export async function subscribeToSignals(callback: (payload: any) => void) {
  return supabase
    .channel('trading_signals')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trading_signals' }, callback)
    .subscribe();
}
