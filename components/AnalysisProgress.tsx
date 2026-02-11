'use client';

import React, { useState } from 'react';

export default function AnalysisProgress() {
  const [progress, setProgress] = useState(42);

  const steps = [
    { number: 1, name: 'Fetch Prices' },
    { number: 2, name: 'News Analysis' },
    { number: 3, name: 'Sentiment Check' },
    { number: 4, name: 'On-Chain Data' },
    { number: 5, name: 'Dev Activity' },
    { number: 6, name: 'Signal Gen' },
    { number: 7, name: 'Save Results' },
  ];

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold glow-text">ANALYSIS WORKFLOW</h2>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse" />
          <span className="text-xs text-terminal-muted">Ready</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-terminal-border rounded-full h-1 w-full overflow-hidden">
          <div
            className="h-full bg-terminal-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-xs text-terminal-muted">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm bg-terminal-border text-terminal-muted">
              {step.number}
            </div>
            <div className="text-xs text-center text-terminal-muted mt-1 truncate w-full">
              {step.name}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-terminal-border text-xs text-terminal-muted">
        <p>⏳ Waiting to start analysis...</p>
      </div>
    </div>
  );
}
