'use client';

import React, { useEffect, useState } from 'react';

interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
}

export default function FearGreedWidget() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/feargreed');
        const result = await res.json();
        if (result.success) {
          setData(result.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching fear & greed:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColorClass = (value: number) => {
    if (value < 25) return 'from-red-900 to-red-700';
    if (value < 45) return 'from-orange-900 to-orange-700';
    if (value < 55) return 'from-gray-700 to-gray-600';
    if (value < 75) return 'from-green-900 to-green-700';
    return 'from-cyan-900 to-cyan-700';
  };

  const getInterpretation = (value: number) => {
    if (value < 25) return 'EXTREME FEAR';
    if (value < 45) return 'FEAR';
    if (value < 55) return 'NEUTRAL';
    if (value < 75) return 'GREED';
    return 'EXTREME GREED';
  };

  if (loading) {
    return (
      <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4 h-full flex items-center justify-center">
        <span className="text-terminal-muted text-sm">Loading...</span>
      </div>
    );
  }

  const value = data?.value || 50;

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4 flex flex-col">
      <h2 className="text-sm font-bold glow-text mb-2">FEAR & GREED</h2>

      <div className="flex flex-col items-center space-y-2">
        {/* Gauge visualization */}
        <div className="relative w-48 h-32">
          <svg viewBox="0 0 200 120" className="w-full h-auto">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            
            {/* Fear section (0-25)*/}
            <path
              d="M 20 100 A 80 80 0 0 1 60 25"
              fill="none"
              stroke="#ff0055"
              strokeWidth="8"
              opacity="0.5"
            />
            
            {/* Greed section (75-100) */}
            <path
              d="M 140 25 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#00ff00"
              strokeWidth="8"
              opacity="0.5"
            />

            {/* Current value indicator */}
            <g transform={`rotate(${(value / 100) * 160 - 80} 100 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="25"
                stroke="#0ff"
                strokeWidth="2"
              />
              <circle cx="100" cy="100" r="4" fill="#0ff" />
            </g>

            {/* Value text */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#0ff"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {value}
            </text>
          </svg>
        </div>

        {/* Interpretation */}
        <div className="w-full text-center">
          <p className="text-xs font-bold glow-text mb-1">
            {getInterpretation(value)}
          </p>
          <p className="text-xs text-terminal-muted">
            {data?.value_classification}
          </p>
        </div>

        {/* Signal indicator */}
        <div className="w-full">
          <div className="bg-terminal-border rounded-full h-2 w-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getColorClass(value)}`}
              style={{ width: `${value}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-terminal-muted mt-2 px-1">
            <span>FEAR</span>
            <span>NEUTRAL</span>
            <span>GREED</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-terminal-muted text-center mt-4 border-t border-terminal-border pt-2">
        Last update: {new Date(data?.timestamp || '').toLocaleTimeString()}
      </div>
    </div>
  );
}
