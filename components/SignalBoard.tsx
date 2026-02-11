'use client';

import React, { useEffect, useState } from 'react';

interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  created_at: string;
}

export default function SignalBoard() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch('/api/signals?limit=10');
        const data = await res.json();
        if (data.success) {
          setSignals(data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching signals:', error);
        setLoading(false);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return 'text-terminal-positive';
      case 'SELL':
        return 'text-terminal-negative';
      case 'HOLD':
        return 'text-terminal-warning';
      default:
        return 'text-terminal-muted';
    }
  };

  const getConfidenceBar = (confidence: number) => {
    return `${confidence}%`;
  };

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold glow-text">TRADING SIGNALS</h2>
        <span className="text-xs text-terminal-muted">
          {signals.length} signals
        </span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-terminal-muted">
          Generating signals...
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center py-8 text-terminal-muted text-xs">
          No signals generated yet. Run analysis to generate signals.
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {signals.map((signal) => (
            <div
              key={signal.id}
              className="border border-terminal-border border-opacity-50 rounded p-3 hover:bg-terminal-border hover:bg-opacity-20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-terminal-accent">[{signal.symbol}]</span>
                  <span className={`font-bold ${getSignalColor(signal.signal)}`}>
                    {signal.signal}
                  </span>
                  <div className="flex-1 bg-terminal-border rounded-full h-1 w-24 ml-2">
                    <div
                      className={`h-full rounded-full ${
                        signal.signal === 'BUY'
                          ? 'bg-terminal-positive'
                          : signal.signal === 'SELL'
                          ? 'bg-terminal-negative'
                          : 'bg-terminal-warning'
                      }`}
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-terminal-muted ml-2">
                    {getConfidenceBar(signal.confidence)}
                  </span>
                </div>
                <span className="text-xs text-terminal-muted">
                  {new Date(signal.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-terminal-muted leading-relaxed">
                {signal.reasoning}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
