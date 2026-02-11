'use client';

import React, { useEffect, useState } from 'react';

interface NewsArticle {
  source: {
    id: string;
    name: string;
  };
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export default function NewsWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news?limit=5');
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="glow-border bg-terminal-bg bg-opacity-50 rounded p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold glow-text">CRYPTO NEWS</h2>
        <span className="text-xs text-terminal-muted">
          {articles.length} articles
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-terminal-muted text-sm">
          Loading news...
        </div>
      ) : articles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-terminal-muted text-xs">
          No news articles available
        </div>
      ) : (
        <div className="flex-1 space-y-2 overflow-y-auto">
          {articles.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-terminal-border border-opacity-50 rounded p-2 hover:bg-terminal-border hover:bg-opacity-20 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-terminal-accent line-clamp-2 group-hover:text-terminal-text">
                    {article.title}
                  </h3>
                  <p className="text-xs text-terminal-muted line-clamp-2 mt-1">
                    {article.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-terminal-border border-opacity-20">
                <span className="text-xs text-terminal-muted truncate">
                  {article.source.name}
                </span>
                <span className="text-xs text-terminal-muted flex-shrink-0">
                  {getTimeAgo(article.publishedAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
