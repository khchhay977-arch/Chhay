/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../../context/ExchangeContext';
import { Sparkline } from '../common/Sparkline';
import { ArrowUpRight, TrendingUp, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export const TopMarketsTable: React.FC = () => {
  const { assets, setSelectedSymbol, setCurrentPage } = useExchange();
  const [tab, setTab] = useState<'hot' | 'gainers' | 'volume'>('hot');

  const displayedAssets = [...assets].sort((a, b) => {
    if (tab === 'gainers') return b.change24h - a.change24h;
    if (tab === 'volume') return b.volume24h - a.volume24h;
    return b.marketCap - a.marketCap;
  });

  const handleTrade = (symbol: string) => {
    setSelectedSymbol(symbol);
    setCurrentPage('spot');
  };

  return (
    <section className="py-12 border-b border-slate-800/60 bg-[#050811]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Live Market Dynamics</h2>
            <p className="text-xs text-slate-400 mt-1">
              Institutional-grade order execution across top liquid pairs with sub-millisecond latency.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0B1120] rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setTab('hot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'hot'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setTab('gainers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'gainers'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top Gainers</span>
            </button>
            <button
              onClick={() => setTab('volume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'volume'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>24h Volume</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-xl border border-slate-800 bg-[#070B14] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Market Asset</th>
                  <th className="py-3.5 px-4">Last Price</th>
                  <th className="py-3.5 px-4">24h Change</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">24h High / Low</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">24h Volume (USDT)</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell text-center">Trend (7d)</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {displayedAssets.slice(0, 8).map(asset => {
                  const isPos = asset.change24h >= 0;
                  return (
                    <tr
                      key={asset.symbol}
                      onClick={() => handleTrade(asset.symbol)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Asset */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
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

                      {/* Last Price */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-100 tabular-nums">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: asset.decimalPlaces })}
                      </td>

                      {/* 24h Change */}
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

                      {/* 24h High / Low */}
                      <td className="py-3.5 px-4 hidden md:table-cell font-mono text-[11px] text-slate-400 tabular-nums">
                        <div>H: ${asset.high24h.toLocaleString()}</div>
                        <div>L: ${asset.low24h.toLocaleString()}</div>
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-slate-300 tabular-nums">
                        ${(asset.volume24h / 1000000).toFixed(2)}M
                      </td>

                      {/* Sparkline */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-center">
                        <div className="flex justify-center">
                          <Sparkline data={asset.sparkline} isPositive={isPos} width={80} height={20} />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleTrade(asset.symbol);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/50 text-cyan-300 text-xs font-semibold transition-all inline-flex items-center gap-1 group-hover:border-cyan-500"
                        >
                          <span>Trade</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing real-time order books & deep liquidity</span>
            <button
              onClick={() => setCurrentPage('markets')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All 350+ Markets</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
