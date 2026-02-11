-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "http";

-- Trading Signals Table
CREATE TABLE IF NOT EXISTS trading_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(10) NOT NULL,
  signal VARCHAR(10) NOT NULL CHECK (signal IN ('BUY', 'SELL', 'HOLD')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  reasoning TEXT NOT NULL,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_trading_signals_symbol ON trading_signals(symbol);
CREATE INDEX idx_trading_signals_created_at ON trading_signals(created_at DESC);
CREATE INDEX idx_trading_signals_symbol_created ON trading_signals(symbol, created_at DESC);

-- Analysis Jobs Table
CREATE TABLE IF NOT EXISTS analysis_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  current_step INTEGER NOT NULL DEFAULT 1,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  event_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create indexes
CREATE INDEX idx_analysis_jobs_status ON analysis_jobs(status);
CREATE INDEX idx_analysis_jobs_created ON analysis_jobs(started_at DESC);

-- Signal History Table
CREATE TABLE IF NOT EXISTS signal_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(10) NOT NULL,
  signal_type VARCHAR(10) NOT NULL CHECK (signal_type IN ('BUY', 'SELL', 'HOLD')),
  price_point DECIMAL(20, 8) NOT NULL,
  accuracy BOOLEAN DEFAULT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_signal_history_symbol ON signal_history(symbol);
CREATE INDEX idx_signal_history_timestamp ON signal_history(timestamp DESC);
CREATE INDEX idx_signal_history_symbol_time ON signal_history(symbol, timestamp DESC);

-- Market Data Cache Table
CREATE TABLE IF NOT EXISTS market_data_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_type VARCHAR(50) NOT NULL,
  asset VARCHAR(10),
  raw_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_market_data_cache_type ON market_data_cache(data_type);
CREATE INDEX idx_market_data_cache_expires ON market_data_cache(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trading_signals
CREATE TRIGGER update_trading_signals_updated_at
BEFORE UPDATE ON trading_signals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (Optional but recommended)
ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (modify as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON trading_signals
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON analysis_jobs
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON signal_history
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON market_data_cache
  FOR SELECT USING (true);

-- Grant appropriate permissions (adjust for your use case)
GRANT SELECT ON trading_signals TO anon, authenticated;
GRANT SELECT ON analysis_jobs TO anon, authenticated;
GRANT SELECT ON signal_history TO anon, authenticated;
GRANT SELECT ON market_data_cache TO anon, authenticated;
