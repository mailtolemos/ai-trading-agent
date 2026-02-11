'use client';

import React, { useEffect, useState } from 'react';
import { useTradingStore } from '@/lib/store/trading';
import PriceBoard from '@/components/PriceBoard';
import SignalBoard from '@/components/SignalBoard';
import FearGreedWidget from '@/components/FearGreedWidget';
import AnalysisProgress from '@/components/AnalysisProgress';
import NewsWidget from '@/components/NewsWidget';
import Header from '@/components/Header';
import Terminal from '@/components/Terminal';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { setIsLoading, setError, isLoading, error, lastUpdate } = useTradingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch prices
        const pricesRes = await fetch('/api/prices');
        const pricesData = await pricesRes.json();
        
        // Fetch signals
        const signalsRes = await fetch('/api/signals?limit=10');
        const signalsData = await signalsRes.json();
        
        // Fetch fear & greed
        const fgRes = await fetch('/api/feargreed');
        const fgData = await fgRes.json();

        // Trigger analysis
        await fetch('/api/analyze', { method: 'POST' });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchInitialData();

      // Set up auto-refresh every 5 seconds
      const interval = setInterval(fetchInitialData, 5000);
      return () => clearInterval(interval);
    }
  }, [mounted, setIsLoading, setError]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-terminal-accent text-center">
          <div className="cursor">█</div>
          <p>Initializing Trading Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-terminal-bg text-terminal-text overflow-y-auto">
      {/* CRT scan line effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-repeat" 
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
          zIndex: 50
        }} />

      <div className="relative z-0">
        {/* Header */}
        <Header />

        {/* Main content */}
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Top row: Analysis Progress & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <AnalysisProgress />
            </div>
            <div className="lg:col-span-1 max-h-96">
              <FearGreedWidget />
            </div>
          </div>

          {/* Middle row: Price Board */}
          <div>
            <PriceBoard />
          </div>

          {/* Lower middle row: Signals and News */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SignalBoard />
            </div>
            <div className="lg:col-span-1">
              <NewsWidget />
            </div>
          </div>

          {/* Terminal Output */}
          <Terminal />
        </div>

        {/* Error display */}
        {error && (
          <div className="fixed bottom-4 right-4 max-w-sm bg-terminal-negative bg-opacity-20 border border-terminal-negative px-4 py-3 rounded text-terminal-negative text-sm">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed top-4 right-4 flex items-center space-x-2">
            <div className="animate-pulse text-terminal-accent">●</div>
            <span className="text-xs text-terminal-muted">Analyzing...</span>
          </div>
        )}

        {/* Last update timestamp */}
        {lastUpdate && (
          <div className="fixed bottom-4 left-4 text-xs text-terminal-muted">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>
    </main>
  );
}
