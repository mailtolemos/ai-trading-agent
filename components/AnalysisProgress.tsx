'use client';

import React, { useEffect, useState } from 'react';

interface Step {
  number: number;
  name: string;
  status: 'pending' | 'running' | 'completed';
}

const STEPS: Step[] = [
  { number: 1, name: 'Fetch Prices', status: 'pending' },
  { number: 2, name: 'News Analysis', status: 'pending' },
  { number: 3, name: 'Sentiment Check', status: 'pending' },
  { number: 4, name: 'On-Chain Data', status: 'pending' },
  { number: 5, name: 'Dev Activity', status: 'pending' },
  { number: 6, name: 'Signal Gen', status: 'pending' },
  { number: 7, name: 'Save Results', status: 'pending' },
];

export default function AnalysisProgress() {
  const [steps, setSteps] = useState<Step[]>(STEPS);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Simulate or fetch actual progress
    const updateProgress = async () => {
      try {
        // Try to get real progress from analysis job
        // For now, simulate progress
        if (Math.random() > 0.5) {
          setIsRunning(true);
          const newSteps = [...steps];
          const currentStep = Math.floor(Math.random() * 7);
          
          for (let i = 0; i < currentStep; i++) {
            if (newSteps[i]) {
              newSteps[i].status = 'completed';
            }
          }
          if (currentStep < 7 && newSteps[currentStep]) {
            newSteps[currentStep].status = 'running';
          }
          
          setSteps(newSteps);
          setProgress(((currentStep + 1) / 7) * 100);

          if (currentStep === 6) {
            setIsRunning(false);
          }
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [steps]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-terminal-positive text-black';
      case 'running':
        return 'bg-terminal-accent text-black animate-pulse';
      default:
        return 'bg-terminal-border text-terminal-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'running':
        return '●';
      default:
        return '○';
    }
  };

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold glow-text">ANALYSIS WORKFLOW</h2>
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse" />
              <span className="text-xs text-terminal-muted">Running</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
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

      {/* Steps visualization */}
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm transition-all ${getStatusColor(step.status)}`}
            >
              {step.number}
            </div>
            <div className="text-xs text-center text-terminal-muted mt-1 truncate w-full">
              {step.name}
            </div>
            <div className={`text-xs mt-1 ${
              step.status === 'completed' ? 'text-terminal-positive' :
              step.status === 'running' ? 'text-terminal-accent' :
              'text-terminal-muted'
            }`}>
              {getStatusIcon(step.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Step details */}
      <div className="mt-4 pt-4 border-t border-terminal-border text-xs text-terminal-muted">
        <p>
          {steps[0]?.status === 'pending' && '⏳ Waiting to start...'}
          {steps.some((s) => s.status === 'running') &&
            `→ Running step ${steps.findIndex((s) => s.status === 'running') + 1}/7`}
          {steps.every((s) => s.status === 'completed') && '✓ Analysis complete'}
        </p>
      </div>
    </div>
  );
}
