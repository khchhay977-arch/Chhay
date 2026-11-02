/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { InteractiveChart } from '../components/common/InteractiveChart';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ChevronDown,
  Percent,
  Sliders,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const FuturesTradingPage: React.FC = () => {
  const {
    assets,
    selectedAsset,
    setSelectedSymbol,
    balances,
    futuresPositions,
    openFuturesPosition,
    closeFuturesPosition,
  } = useExchange();

  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(20);
  const [orderSide, setOrderSide] = useState<'long' | 'short'>('long');
  const [marginAmount, setMarginAmount] = useState<string>('500');
  const [tpPrice, setTpPrice] = useState<string>('');
  const [slPrice, setSlPrice] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');

  const usdtBalance = balances.find(b => b.symbol === 'USDT')?.available || 0;
  const entryPrice = selectedAsset.price;
  const numMargin = parseFloat(marginAmount) || 0;
  const notionalValue = numMargin * leverage;
  const contractSize = entryPrice > 0 ? notionalValue / entryPrice : 0;

  // Real-time liquidation calculation
  const estimatedLiqPrice = orderSide === 'long'
    ? entryPrice * (1 - 0.9 / leverage)
    : entryPrice * (1 + 0.9 / leverage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numMargin <= 0) return;

    openFuturesPosition({
      symbol: selectedAsset.symbol,
      side: orderSide,
      leverage,
      marginMode,
      marginAmount: numMargin,
    });
  };

  return (
    <div className="w-full bg-[#050811] text-slate-100 min-h-[calc(100vh-64px)] p-2 sm:p-4 space-y-3">
      {/* 1. Futures Header Bar with Funding & Mark Price */}
      <div className="bg-[#070B14] border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-black text-sm text-white">
              <span>{selectedAsset.symbol}/USDT Perpetual</span>
              <span className="text-[10px] bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                {leverage}x
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Next Funding: <span className="text-cyan-400 font-mono">+0.0100% in 03:22:15</span></div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 sm:gap-8 text-xs font-mono tabular-nums">
          <div>
            <div className="text-[10px] text-slate-400 font-sans">Mark Price</div>
            <div className="text-base font-bold text-cyan-400">${selectedAsset.price.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-sans">Index Price</div>
            <div className="text-slate-200">${(selectedAsset.price * 1.0002).toFixed(2)}</div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 font-sans">24h Volume</div>
            <div className="text-slate-200">${(selectedAsset.volume24h * 1.4 / 1000000).toFixed(2)}M</div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 font-sans">Open Interest</div>
            <div className="text-slate-200">18,420.5 {selectedAsset.symbol}</div>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Chart + Futures Order Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Chart */}
        <div className="lg:col-span-8 space-y-3">
          <InteractiveChart asset={selectedAsset} height={420} />
        </div>

        {/* Right: Leverage & Margin Order Panel */}
        <div className="lg:col-span-4 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode & Leverage Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex p-0.5 bg-[#0B1120] rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setMarginMode('cross')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    marginMode === 'cross' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cross
                </button>
                <button
                  type="button"
                  onClick={() => setMarginMode('isolated')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    marginMode === 'isolated' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Isolated
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B1120] border border-slate-800 text-xs font-mono font-bold text-cyan-400">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>{leverage}x Leverage</span>
              </div>
            </div>

            {/* Leverage Quick Stepper */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Select Leverage</span>
                <span className="text-cyan-400 font-mono font-bold">1x — 125x</span>
              </div>
              <input
                type="range"
                min="1"
                max="125"
                step="1"
                value={leverage}
                onChange={e => setLeverage(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                <span>1x</span>
                <span>20x</span>
                <span>50x</span>
                <span>100x</span>
                <span>125x</span>
              </div>
            </div>

            {/* Long vs Short Toggle */}
            <div className="grid grid-cols-2 p-1 bg-[#0B1120] rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setOrderSide('long')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  orderSide === 'long'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Open Long</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderSide('short')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  orderSide === 'short'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span>Open Short</span>
              </button>
            </div>

            {/* Margin Amount Input */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Initial Margin (USDT)</span>
                <span>Avail: ${usdtBalance.toFixed(2)}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={marginAmount}
                  onChange={e => setMarginAmount(e.target.value)}
                  placeholder="Margin amount"
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setMarginAmount((usdtBalance * 0.5).toFixed(2))}
                  className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-400 font-semibold"
                >
                  50%
                </button>
              </div>
            </div>

            {/* Notional size & Estimated Liq Price */}
            <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl space-y-1.5 text-[11px] font-mono tabular-nums">
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">Notional Position Value:</span>
                <span className="text-white font-bold">${notionalValue.toLocaleString()} USDT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">Contract Size:</span>
                <span className="text-white">{contractSize.toFixed(4)} {selectedAsset.symbol}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. Liquidation Price:</span>
                </span>
                <span className="text-amber-400 font-bold">${estimatedLiqPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                orderSide === 'long'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
              }`}
            >
              {orderSide === 'long'
                ? `Confirm Long (${leverage}x) · $${notionalValue.toLocaleString()}`
                : `Confirm Short (${leverage}x) · $${notionalValue.toLocaleString()}`}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Perpetual Positions & Open Orders Desk */}
      <div className="bg-[#070B14] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="flex border-b border-slate-800 bg-[#0B1120] px-4">
          <button
            onClick={() => setActiveTab('positions')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'positions'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Positions ({futuresPositions.length})
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'positions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Contract</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Entry Price</th>
                    <th className="py-2.5 px-3">Mark Price</th>
                    <th className="py-2.5 px-3">Liq. Price</th>
                    <th className="py-2.5 px-3">Margin</th>
                    <th className="py-2.5 px-3">Unrealized PnL</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                  {futuresPositions.map(pos => (
                    <tr key={pos.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-sans font-bold">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                              pos.side === 'long'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                            }`}
                          >
                            {pos.side} {pos.leverage}x
                          </span>
                          <span className="text-white">{pos.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-white font-bold">{pos.size}</td>
                      <td className="py-3 px-3">${pos.entryPrice.toLocaleString()}</td>
                      <td className="py-3 px-3 text-cyan-400">${pos.markPrice.toLocaleString()}</td>
                      <td className="py-3 px-3 text-amber-400">${pos.liqPrice.toLocaleString()}</td>
                      <td className="py-3 px-3">${pos.margin.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold ${
                            pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnlPercentage.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => closeFuturesPosition(pos.id)}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-semibold font-sans border border-slate-700 transition-colors"
                        >
                          Market Close
                        </button>
                      </td>
                    </tr>
                  ))}
                  {futuresPositions.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 font-sans text-xs">
                        No open perpetual futures positions. Open a Long or Short contract above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
