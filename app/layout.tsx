import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Trading Agent | Real-Time Crypto Analysis',
  description: 'Production-ready AI-powered crypto trading signals with real-time sentiment analysis and on-chain metrics',
  generator: 'Next.js 15',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="scan-effect crt">
        {children}
      </body>
    </html>
  );
}
