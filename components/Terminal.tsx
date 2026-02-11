'use client';

import React, { useEffect, useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: string;
  message: string;
}

const SYSTEM_MESSAGES = [
  { type: 'info', msg: 'Initializing market data feeds...' },
  { type: 'success', msg: 'Connected to CoinGecko API' },
  { type: 'info', msg: 'Fetching latest crypto news...' },
  { type: 'success', msg: 'Fear & Greed Index updated' },
  { type: 'info', msg: 'Analyzing on-chain metrics...' },
  { type: 'success', msg: 'Trading signals generated' },
];

export default function Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'info',
      message: '▲ Pablo-onchain v1.0.0 initialized',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];

      setLogs((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: randomMsg?.type || 'info',
          message: randomMsg?.msg || 'System event',
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-terminal-positive';
      case 'error':
        return 'text-terminal-negative';
      case 'warning':
        return 'text-terminal-warning';
      default:
        return 'text-terminal-accent';
    }
  };

  const getTimeString = (timestamp: string) => {
    const parts = timestamp.split('T');
    return parts[1]?.slice(0, 8) || '00:00:00';
  };

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4 font-mono text-sm max-h-64 overflow-y-auto">
      <div className="mb-3 pb-3 border-b border-terminal-border">
        <h3 className="glow-text font-bold">SYSTEM LOG</h3>
      </div>
      <div className="space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex space-x-3 text-xs">
            <span className="text-terminal-muted">{getTimeString(log.timestamp)}</span>
            <span className={getMessageColor(log.type)}>▸</span>
            <span className="text-terminal-muted flex-1">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
