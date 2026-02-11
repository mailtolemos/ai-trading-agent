'use client';

import React, { useEffect, useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export default function Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '0',
      timestamp: new Date().toISOString(),
      type: 'info',
      message: '[SYSTEM] AI Trading Agent initialized',
    },
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'info',
      message: '[SYSTEM] Connecting to data sources...',
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'success',
      message: '[COINGECKO] Price data feed connected',
    },
  ]);

  useEffect(() => {
    // Simulate log entries
    const interval = setInterval(() => {
      const messages = [
        { type: 'info' as const, msg: '[API] Fetching latest market data...' },
        { type: 'success' as const, msg: '[ANALYSIS] Sentiment analysis completed' },
        { type: 'info' as const, msg: '[GEMINI] Generating trading signals...' },
        { type: 'success' as const, msg: '[SIGNALS] New signals generated and stored' },
        { type: 'warning' as const, msg: '[MONITOR] High volatility detected on BTC' },
        { type: 'success' as const, msg: '[STORAGE] Results persisted to database' },
      ];

      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      setLogs((prev) => [
        ...prev.slice(-20), // Keep last 20 logs
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: randomMsg.type,
          message: randomMsg.msg,
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-terminal-positive';
      case 'error':
        return 'text-terminal-negative';
      case 'warning':
        return 'text-terminal-warning';
      default:
        return 'text-terminal-text';
    }
  };

  const getLogPrefix = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return '→';
    }
  };

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold glow-text">SYSTEM LOG</h2>
        <span className="text-xs text-terminal-muted">
          {logs.length} entries
        </span>
      </div>

      <div
        className="font-mono text-xs space-y-1 bg-black bg-opacity-30 rounded p-3 max-h-64 overflow-y-auto border border-terminal-border border-opacity-30"
      >
        {logs.map((log) => (
          <div key={log.id} className={`flex space-x-2 ${getLogColor(log.type)}`}>
            <span className="text-terminal-muted flex-shrink-0 w-10">
              {new Date(log.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </span>
            <span className="flex-shrink-0 w-4">{getLogPrefix(log.type)}</span>
            <span className="flex-1">{log.message}</span>
          </div>
        ))}
        <div className="text-terminal-accent animate-pulse">
          <span className="mr-1">→</span>
          <span className="inline-block w-1 h-4 ml-1 bg-terminal-accent" />
        </div>
      </div>

      <div className="mt-3 text-xs text-terminal-muted space-y-1">
        <p>Status: <span className="text-terminal-positive">● ONLINE</span></p>
        <p>Last Update: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
