'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="border-b border-terminal-border bg-terminal-bg bg-opacity-50 sticky top-0 z-40 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse" />
            <h1 className="text-2xl font-bold glow-text">
              [AI-TRADING-AGENT]
            </h1>
            <span className="text-xs text-terminal-muted px-2 py-1 border border-terminal-border rounded">
              v1.0.0
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-terminal-muted">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-terminal-positive rounded-full" />
              <span>LIVE</span>
            </div>
            <span className="text-terminal-accent">●</span>
            <div>
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-terminal-muted">
          Real-time cryptocurrency analysis | Fear & Greed monitoring | On-chain metrics | AI-powered signals
        </div>
      </div>
    </header>
  );
}
