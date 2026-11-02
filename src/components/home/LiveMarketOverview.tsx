/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useLiveCryptoPrices } from '../../hooks/useLiveCryptoPrices';
import { useExchange } from '../../context/ExchangeContext';
import { Sparkline } from '../common/Sparkline';
import {
  TrendingUp,
  RefreshCw,
  Radio,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const LiveMarketOverview: React.FC = () => {
  const { tickers, feedStatus, lastUpdated, dataSource, refresh } = useLiveCryptoPrices();
  const { setCurrentPage, setSelectedSymbol } = useExchange();

  const handleSelectAsset = (baseSymbol: string) => {
    setSelectedSymbol(baseSymbol);
    setCurrentPage('spot');
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 border-b border-slate-800/80 bg-[#050811]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header & Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                Cryptocurrency Market Overview
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Transparent digital asset pricing, 24h volume, and liquidity telemetry.
            </p>
          </div>

          {/* Transparent Live Data Feed Status */}
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border ${
                feedStatus === 'live'
                  ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-300'
                  : feedStatus === 'connecting'
                  ? 'bg-amber-950/50 border-amber-800/50 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  feedStatus === 'live'
                    ? 'text-emerald-400 animate-pulse'
                    : feedStatus === 'connecting'
                    ? 'text-amber-400 animate-spin'
                    : 'text-slate-400'
                }`}
              />
              <span className="font-semibold text-[11px]">
                {feedStatus === 'live'
                  ? 'LIVE FEED: BINANCE API'
                  : feedStatus === 'connecting'
                  ? 'CONNECTING TO FEED...'
                  : 'STANDBY / BASELINE FEED'}
              </span>
            </div>

            <button
              onClick={refresh}
              title="Refresh Market Prices"
              className="p-2 rounded-xl bg-[#070B14] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Market Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {tickers.slice(0, 4).map((ticker, index) => {
            const isPos = ticker.change24h >= 0;
            return (
              <motion.div
                key={ticker.symbol}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => handleSelectAsset(ticker.baseSymbol)}
                className="group relative p-4 rounded-2xl bg-[#070B14] border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden"
              >
                {/* Glow pill hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                        style={{ backgroundColor: ticker.color }}
                      >
                        {ticker.baseSymbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                          <span>{ticker.baseSymbol}</span>
                          <span className="text-[10px] text-slate-500 font-normal">/USDT</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{ticker.name}</div>
                      </div>
                    </div>

                    <div
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${
                        isPos
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      <span>{isPos ? '+' : ''}{ticker.change24h.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="font-mono text-xl font-black text-white tabular-nums my-1">
                    ${ticker.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: ticker.price < 1 ? 4 : 2,
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>24h High: ${ticker.high24h.toLocaleString()}</span>
                    <span>24h Low: ${ticker.low24h.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 font-mono">
                    Vol: {ticker.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })} {ticker.baseSymbol}
                  </div>
                  <Sparkline data={ticker.sparkline} isPositive={isPos} width={90} height={20} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Detailed Markets Table */}
        <div className="bg-[#070B14] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Spot & Futures Quotations
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Source: {dataSource}
              {lastUpdated && ` · ${lastUpdated.toLocaleTimeString()}`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Last Price</th>
                  <th className="py-3 px-4">24h Change</th>
                  <th className="py-3 px-4 hidden md:table-cell">24h Range</th>
                  <th className="py-3 px-4 hidden lg:table-cell">24h Volume</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tickers.map(ticker => {
                  const isPos = ticker.change24h >= 0;
                  return (
                    <tr
                      key={ticker.symbol}
                      onClick={() => handleSelectAsset(ticker.baseSymbol)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-sans">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                            style={{ backgroundColor: ticker.color }}
                          >
                            {ticker.baseSymbol.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {ticker.baseSymbol}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1.5">{ticker.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white tabular-nums">
                        ${ticker.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: ticker.price < 1 ? 4 : 2,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold tabular-nums px-2 py-0.5 rounded ${
                            isPos ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'
                          }`}
                        >
                          {isPos ? '+' : ''}{ticker.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 hidden md:table-cell tabular-nums text-[11px]">
                        ${ticker.low24h.toLocaleString()} — ${ticker.high24h.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 hidden lg:table-cell tabular-nums text-[11px]">
                        {ticker.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })} {ticker.baseSymbol}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleSelectAsset(ticker.baseSymbol);
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-800/50 text-cyan-300 text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <span>Trade</span>
                          <ArrowRight className="w-3 h-3" />
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
    </section>
  );
};
