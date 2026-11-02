/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { Sparkline } from '../components/common/Sparkline';
import {
  Search,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';

export const MarketsPage: React.FC = () => {
  const { assets, setSelectedSymbol, setCurrentPage } = useExchange();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'marketCap' | 'price' | 'change24h' | 'volume24h'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAssets = assets
    .filter(a => {
      const matchSearch =
        a.symbol.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || a.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    });

  const handleSort = (field: 'marketCap' | 'price' | 'change24h' | 'volume24h') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const topGainer = [...assets].sort((a, b) => b.change24h - a.change24h)[0];
  const topVolume = [...assets].sort((a, b) => b.volume24h - a.volume24h)[0];

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* 1. Header & Summary Spotlight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Cryptocurrency Markets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time market depth, 24h volume benchmarks, and liquidity across 350+ digital assets.
          </p>
        </div>

        {/* Spotlights */}
        <div className="flex items-center gap-3">
          {topGainer && (
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="text-slate-400 text-[10px]">Top 24h Gainer</div>
                <div className="font-bold text-white flex items-center gap-1">
                  <span>{topGainer.symbol}</span>
                  <span className="text-emerald-400 font-mono tabular-nums">+{topGainer.change24h.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          {topVolume && (
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center gap-3 hidden sm:flex">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="text-slate-400 text-[10px]">Highest Volume</div>
                <div className="font-bold text-white flex items-center gap-1">
                  <span>{topVolume.symbol}</span>
                  <span className="text-cyan-400 font-mono tabular-nums">
                    ${(topVolume.volume24h / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Controls Strip: Category Tabs & Live Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#070B14] p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'L1/L2', 'DeFi', 'AI', 'Meme'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                category === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search symbol or coin name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* 3. Full Markets Table */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Market Asset</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  onClick={() => handleSort('change24h')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  24h Change {sortBy === 'change24h' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="py-3.5 px-4 hidden md:table-cell">24h High / Low</th>
                <th
                  onClick={() => handleSort('volume24h')}
                  className="py-3.5 px-4 hidden sm:table-cell cursor-pointer hover:text-white"
                >
                  24h Volume {sortBy === 'volume24h' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="py-3.5 px-4 hidden lg:table-cell cursor-pointer hover:text-white"
                >
                  Market Cap {sortBy === 'marketCap' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="py-3.5 px-4 hidden xl:table-cell text-center">Trend (7d)</th>
                <th className="py-3.5 px-4 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAssets.map((asset, idx) => {
                const isPos = asset.change24h >= 0;
                return (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedSymbol(asset.symbol);
                      setCurrentPage('spot');
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500 tabular-nums">{idx + 1}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: asset.iconColor }}
                        >
                          {asset.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            <span>{asset.symbol}</span>
                            <span className="text-[10px] text-slate-500 font-normal">/USDT</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{asset.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-white tabular-nums">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: asset.decimalPlaces })}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${
                          isPos
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell font-mono text-[11px] text-slate-400 tabular-nums">
                      <div>${asset.high24h.toLocaleString()}</div>
                      <div className="text-slate-500">${asset.low24h.toLocaleString()}</div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-slate-300 tabular-nums">
                      ${(asset.volume24h / 1000000).toFixed(2)}M
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-slate-400 tabular-nums">
                      ${(asset.marketCap / 1000000000).toFixed(2)}B
                    </td>

                    <td className="py-3.5 px-4 hidden xl:table-cell text-center">
                      <div className="flex justify-center">
                        <Sparkline data={asset.sparkline} isPositive={isPos} width={80} height={20} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedSymbol(asset.symbol);
                          setCurrentPage('spot');
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/50 text-cyan-300 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <span>Spot</span>
                        <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedSymbol(asset.symbol);
                          setCurrentPage('futures');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-950/70 hover:bg-blue-900 border border-blue-800/50 text-blue-300 text-xs font-semibold transition-all inline-flex items-center gap-1 hidden sm:inline-flex"
                      >
                        <span>Futures</span>
                        <Zap className="w-3 h-3 text-blue-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
