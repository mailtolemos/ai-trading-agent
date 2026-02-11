'use client';

import React, { useEffect, useState } from 'react';

interface CryptoPrice {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap: number;
  total_volume: number;
}

export default function PriceBoard() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/prices');
        const data = await res.json();
        if (data.success) {
          setPrices(data.data.slice(0, 10)); // Top 10
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(2)}K`;
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold glow-text">PRICE TRACKER</h2>
        <span className="text-xs text-terminal-muted">
          {prices.length} assets monitored
        </span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-terminal-muted">
          Loading prices...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-32">ASSET</th>
                <th className="text-right">PRICE</th>
                <th className="text-right">24h</th>
                <th className="text-right">7d</th>
                <th className="text-right">MARKET CAP</th>
                <th className="text-right">VOLUME</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price.symbol}>
                  <td className="font-bold">{price.symbol}</td>
                  <td className="text-right">{formatPrice(price.current_price)}</td>
                  <td className={`text-right ${price.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {formatChange(price.price_change_percentage_24h)}
                  </td>
                  <td className={`text-right ${price.price_change_percentage_7d >= 0 ? 'positive' : 'negative'}`}>
                    {formatChange(price.price_change_percentage_7d)}
                  </td>
                  <td className="text-right text-xs text-terminal-muted">
                    {formatPrice(price.market_cap || 0)}
                  </td>
                  <td className="text-right text-xs text-terminal-muted">
                    {formatPrice(price.total_volume || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
