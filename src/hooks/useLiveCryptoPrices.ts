/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

export interface LiveTicker {
  symbol: string;
  baseSymbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
  color: string;
}

export type FeedStatus = 'connecting' | 'live' | 'fallback' | 'error';

const INITIAL_FALLBACK_DATA: Record<string, { name: string; base: string; price: number; change24h: number; high: number; low: number; vol: number; color: string }> = {
  BTCUSDT: { name: 'Bitcoin', base: 'BTC', price: 68432.17, change24h: 2.45, high: 69120.5, low: 66800.0, vol: 24890.5, color: '#F7931A' },
  ETHUSDT: { name: 'Ethereum', base: 'ETH', price: 3421.85, change24h: 1.82, high: 3490.2, low: 3340.0, vol: 182400.0, color: '#627EEA' },
  SOLUSDT: { name: 'Solana', base: 'SOL', price: 142.67, change24h: 3.21, high: 146.5, low: 137.8, vol: 1450000.0, color: '#14F195' },
  BNBUSDT: { name: 'BNB', base: 'BNB', price: 584.12, change24h: 1.67, high: 592.0, low: 571.5, vol: 89400.0, color: '#F3BA2F' },
  XRPUSDT: { name: 'XRP', base: 'XRP', price: 0.5423, change24h: 0.98, high: 0.558, low: 0.531, vol: 48900000.0, color: '#23292F' },
  DOGEUSDT: { name: 'Dogecoin', base: 'DOGE', price: 0.1687, change24h: 2.12, high: 0.174, low: 0.162, vol: 87600000.0, color: '#C2A633' },
  ADAUSDT: { name: 'Cardano', base: 'ADA', price: 0.3621, change24h: -0.84, high: 0.375, low: 0.354, vol: 29400000.0, color: '#0033AD' },
  AVAXUSDT: { name: 'Avalanche', base: 'AVAX', price: 28.45, change24h: 4.15, high: 29.2, low: 26.8, vol: 480000.0, color: '#E84142' },
};

export const useLiveCryptoPrices = () => {
  const [tickers, setTickers] = useState<LiveTicker[]>(() =>
    Object.entries(INITIAL_FALLBACK_DATA).map(([pair, item]) => ({
      symbol: pair,
      baseSymbol: item.base,
      name: item.name,
      price: item.price,
      change24h: item.change24h,
      high24h: item.high,
      low24h: item.low,
      volume24h: item.vol,
      sparkline: [item.low, (item.low + item.price) / 2, item.price * 0.98, item.high, item.price],
      color: item.color,
    }))
  );
  const [feedStatus, setFeedStatus] = useState<FeedStatus>('connecting');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string>('Initializing Public Feed...');

  const fetchLivePrices = useCallback(async () => {
    try {
      const symbols = JSON.stringify(Object.keys(INITIAL_FALLBACK_DATA));
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTickers(prev =>
          prev.map(ticker => {
            const match = data.find((d: { symbol: string }) => d.symbol === ticker.symbol);
            if (!match) return ticker;

            const livePrice = parseFloat(match.lastPrice) || ticker.price;
            const liveChange = parseFloat(match.priceChangePercent) || ticker.change24h;
            const liveHigh = parseFloat(match.highPrice) || ticker.high24h;
            const liveLow = parseFloat(match.lowPrice) || ticker.low24h;
            const liveVol = parseFloat(match.volume) || ticker.volume24h;

            const updatedSparkline = [...ticker.sparkline.slice(1), livePrice];

            return {
              ...ticker,
              price: livePrice,
              change24h: liveChange,
              high24h: liveHigh,
              low24h: liveLow,
              volume24h: liveVol,
              sparkline: updatedSparkline,
            };
          })
        );
        setFeedStatus('live');
        setDataSource('Binance Global Public Market Feed');
        setLastUpdated(new Date());
        return;
      }
      throw new Error('Empty payload');
    } catch {
      // Graceful fallback to verified platform baseline
      setFeedStatus('fallback');
      setDataSource('Platform Baseline (Public API Offline / Rate-limited)');
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 10000);
    return () => clearInterval(interval);
  }, [fetchLivePrices]);

  return {
    tickers,
    feedStatus,
    lastUpdated,
    dataSource,
    refresh: fetchLivePrices,
  };
};
