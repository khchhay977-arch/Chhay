/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Eye,
  EyeOff,
  Shield,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    balances,
    totalBalanceUsd,
    totalBalanceBtc,
    spotOrders,
    futuresPositions,
    setCurrentPage,
    setSelectedSymbol,
    showToast,
  } = useExchange();

  const [hideBalances, setHideBalances] = useState(false);
  const [convertFrom, setConvertFrom] = useState('USDT');
  const [convertTo, setConvertTo] = useState('BTC');
  const [convertAmount, setConvertAmount] = useState('1000');

  const openOrdersCount = spotOrders.filter(o => o.status === 'open').length;
  const activeFuturesCount = futuresPositions.length;

  const handleQuickConvert = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Quick Swap executed: Converted ${convertAmount} ${convertFrom} to ${convertTo} with zero slippage!`, 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* Sample Environment Notice Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            <strong className="text-white">Sample Environment (Preview Mode):</strong> Account balances and order simulation are labeled sample data for UI evaluation. Real assets are not accepted.
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 bg-cyan-900/60 px-2 py-0.5 rounded">
          Simulation
        </span>
      </div>

      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Client Asset Dashboard</h1>
            <span className="text-[10px] bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
              UID: {user?.uid || '89410294'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time portfolio evaluation, multi-asset margin, and account health.
          </p>
        </div>

        {/* Action Fast Row */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage('deposit')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 text-slate-950" />
            <span>Deposit</span>
          </button>

          <button
            onClick={() => setCurrentPage('withdrawal')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1120] hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setCurrentPage('spot')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1120] hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Trade</span>
          </button>
        </div>
      </div>

      {/* 2. Portfolio Balance & Security Score Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Assets Main Card */}
        <div className="lg:col-span-8 bg-[#070B14] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sample Portfolio Valuation (USD)
              </span>
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="text-slate-500 hover:text-slate-300"
                title={hideBalances ? 'Show Balances' : 'Hide Balances'}
              >
                {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono tabular-nums">
              <span>Sample P&L: +$1,428.50 (+4.82%)</span>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight tabular-nums">
              {hideBalances
                ? '••••••••••'
                : `$${totalBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className="text-xs font-mono text-cyan-400 tabular-nums">
              ≈ {hideBalances ? '••••••' : `${totalBalanceBtc.toFixed(4)} BTC`}
            </div>
          </div>

          {/* Allocation Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Asset Distribution</span>
              <span className="text-cyan-400 font-semibold">5 Assets</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden flex">
              {balances.map(b => {
                const pct = totalBalanceUsd > 0 ? (b.usdValue / totalBalanceUsd) * 100 : 20;
                return (
                  <div
                    key={b.symbol}
                    style={{ width: `${pct}%`, backgroundColor: b.iconColor }}
                    className="h-full transition-all duration-300"
                    title={`${b.symbol}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400">
              {balances.map(b => (
                <div key={b.symbol} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.iconColor }} />
                  <span className="font-semibold text-slate-200">{b.symbol}</span>
                  <span className="font-mono tabular-nums">
                    {totalBalanceUsd > 0 ? ((b.usdValue / totalBalanceUsd) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Security Health
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">85% High</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[85%]" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              2FA is enabled. Whitelist withdrawal protection active with 24h verification cooldown.
            </p>
            <button
              onClick={() => setCurrentPage('security')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Security Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Swap Utility */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                Instant Zero-Fee Swap
              </span>
            </div>
            <form onSubmit={handleQuickConvert} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-1/2">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">From</label>
                  <select
                    value={convertFrom}
                    onChange={e => setConvertFrom(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">To</label>
                  <select
                    value={convertTo}
                    onChange={e => setConvertTo(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={e => setConvertAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono tabular-nums"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 font-bold text-xs transition-colors"
              >
                Convert Instantly
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Detailed Assets Table */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Cryptocurrency Balances</h3>
          </div>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Transaction Ledger</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Total Balance</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4 hidden sm:table-cell">In Orders / Margin</th>
                <th className="py-3 px-4">USD Valuation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {balances.map(b => (
                <tr key={b.symbol} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: b.iconColor }}
                      >
                        {b.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{b.symbol}</div>
                        <div className="text-[10px] text-slate-400">{b.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-100 tabular-nums">
                    {hideBalances ? '••••' : b.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-emerald-400 tabular-nums">
                    {hideBalances ? '••••' : b.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>

                  <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-slate-400 tabular-nums">
                    {hideBalances ? '••••' : b.inOrders.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                    {hideBalances
                      ? '••••'
                      : `$${b.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSymbol(b.symbol === 'USDT' ? 'BTC' : b.symbol);
                        setCurrentPage('spot');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Trade
                    </button>
                    <button
                      onClick={() => setCurrentPage('deposit')}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 text-xs font-medium transition-colors"
                    >
                      Deposit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active Orders & Perpetual Positions Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Orders */}
        <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Active Spot Orders ({openOrdersCount})</h3>
            </div>
            <button
              onClick={() => setCurrentPage('spot')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Spot Desk →
            </button>
          </div>

          {openOrdersCount > 0 ? (
            <div className="space-y-2">
              {spotOrders
                .filter(o => o.status === 'open')
                .slice(0, 3)
                .map(order => (
                  <div
                    key={order.id}
                    className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold uppercase ${
                            order.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {order.side}
                        </span>
                        <span className="font-semibold text-white">{order.pair}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{order.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Amount: {order.amount} · Price: ${order.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white tabular-nums">${order.total.toLocaleString()}</div>
                      <div className="text-[10px] text-cyan-400">Status: {order.status}</div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">No active limit orders currently pending.</div>
          )}
        </div>

        {/* Futures Positions */}
        <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Futures Positions ({activeFuturesCount})</h3>
            </div>
            <button
              onClick={() => setCurrentPage('futures')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Futures Desk →
            </button>
          </div>

          {activeFuturesCount > 0 ? (
            <div className="space-y-2">
              {futuresPositions.map(pos => (
                <div
                  key={pos.id}
                  className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
                          pos.side === 'long'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {pos.side} {pos.leverage}x
                      </span>
                      <span className="font-semibold text-white">{pos.symbol}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Entry: ${pos.entryPrice.toLocaleString()} · Mark: ${pos.markPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono font-bold tabular-nums ${
                        pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnlPercentage.toFixed(2)}%)
                    </div>
                    <div className="text-[10px] text-slate-500">Margin: ${pos.margin.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">No active perpetual contract positions.</div>
          )}
        </div>
      </div>
    </div>
  );
};
