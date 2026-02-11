import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0a0e27',
        'terminal-border': '#1e293b',
        'terminal-text': '#e2e8f0',
        'terminal-accent': '#0ff',
        'terminal-muted': '#64748b',
        'terminal-positive': '#00ff00',
        'terminal-negative': '#ff0055',
        'terminal-warning': '#ffaa00',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 255, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 255, 255, 0.5)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blink: 'blink 1s infinite',
        'scan-line': 'scanLine 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%, 100%': { opacity: '1' },
          '50%, 99%': { opacity: '0' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
