/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { InteractiveChart } from '../components/common/InteractiveChart';
import {
  ChevronDown,
  TrendingUp,
  Search,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const SpotTradingPage: React.FC = () => {
  const {
    assets,
    selectedSymbol,
    setSelectedSymbol,
    selectedAsset,
    balances,
    spotOrders,
    placeSpotOrder,
    cancelSpotOrder,
  } = useExchange();

  const [pairSelectorOpen, setPairSelectorOpen] = useState(false);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [priceInput, setPriceInput] = useState<string>(selectedAsset.price.toString());
  const [amountInput, setAmountInput] = useState<string>('0.1');
  const [bottomTab, setBottomTab] = useState<'open' | 'history' | 'assets'>('open');

  // Sync price if user changes coin
  const handleSelectCoin = (symbol: string) => {
    setSelectedSymbol(symbol);
    const target = assets.find(a => a.symbol === symbol);
    if (target) setPriceInput(target.price.toString());
    setPairSelectorOpen(false);
  };

  const currentPair = `${selectedAsset.symbol}/USDT`;

  // Balances for this pair
  const usdtBalance = balances.find(b => b.symbol === 'USDT')?.available || 0;
  const coinBalance = balances.find(b => b.symbol === selectedAsset.symbol)?.available || 0;

  const currentPrice = orderType === 'market' ? selectedAsset.price : (parseFloat(priceInput) || selectedAsset.price);
  const currentAmount = parseFloat(amountInput) || 0;
  const totalCost = currentPrice * currentAmount;

  // Percentage slider / chips
  const handlePercentage = (pct: number) => {
    if (side === 'buy') {
      const maxSpend = usdtBalance * (pct / 100);
      const computedAmount = maxSpend / currentPrice;
      setAmountInput(computedAmount.toFixed(4));
    } else {
      const computedAmount = coinBalance * (pct / 100);
      setAmountInput(computedAmount.toFixed(4));
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    placeSpotOrder({
      pair: currentPair,
      side,
      type: orderType,
      price: currentPrice,
      amount: currentAmount,
    });
  };

  // Generate deterministic realistic Order Book depth around current price
  const { orderBookAsks, orderBookBids, spread, spreadPercentage } = useMemo(() => {
    const p = selectedAsset.price;
    const dp = selectedAsset.decimalPlaces;
    const asks = [];
    const bids = [];

    let totalAskVol = 0;
    for (let i = 5; i >= 1; i--) {
      const askPrice = Number((p + i * (p * 0.00035)).toFixed(dp));
      const amount = Number((Math.random() * 0.8 + 0.15).toFixed(3));
      totalAskVol += amount;
      asks.push({ price: askPrice, amount, total: Number(totalAskVol.toFixed(3)) });
    }

    let totalBidVol = 0;
    for (let i = 1; i <= 5; i++) {
      const bidPrice = Number((p - i * (p * 0.00035)).toFixed(dp));
      const amount = Number((Math.random() * 0.9 + 0.2).toFixed(3));
      totalBidVol += amount;
      bids.push({ price: bidPrice, amount, total: Number(totalBidVol.toFixed(3)) });
    }

    const lowestAsk = asks[asks.length - 1]?.price || p;
    const highestBid = bids[0]?.price || p;
    const spreadVal = Number((lowestAsk - highestBid).toFixed(dp));
    const spreadPct = ((spreadVal / p) * 100).toFixed(3);

    return { orderBookAsks: asks, orderBookBids: bids, spread: spreadVal, spreadPercentage: spreadPct };
  }, [selectedAsset.price, selectedAsset.decimalPlaces]);

  // Live market trades simulation
  const marketTrades = useMemo(() => {
    const list = [];
    const p = selectedAsset.price;
    for (let i = 0; i < 8; i++) {
      const isBuy = i % 2 === 0;
      const tradePrice = isBuy ? p + (i * 0.4) : p - (i * 0.4);
      list.push({
        id: `tr_${i}`,
        price: Number(tradePrice.toFixed(selectedAsset.decimalPlaces)),
        amount: Number((Math.random() * 0.6 + 0.05).toFixed(4)),
        time: new Date(Date.now() - i * 45000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        side: isBuy ? ('buy' as const) : ('sell' as const),
      });
    }
    return list;
  }, [selectedAsset.price, selectedAsset.decimalPlaces]);

  return (
    <div className="w-full bg-[#050811] text-slate-100 min-h-[calc(100vh-64px)] p-2 sm:p-4 space-y-3">
      {/* 1. Header Pair Ribbon & 24h Stats */}
      <div className="bg-[#070B14] border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Pair selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setPairSelectorOpen(!pairSelectorOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white"
              style={{ backgroundColor: selectedAsset.iconColor }}
            >
              {selectedAsset.symbol.charAt(0)}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 font-black text-sm text-white">
                <span>{selectedAsset.symbol}/USDT</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-[10px] text-cyan-400 font-semibold">{selectedAsset.category}</div>
            </div>
          </button>

          {/* Coin Selector Dropdown */}
          {pairSelectorOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#0B1120] border border-slate-800 shadow-2xl p-2 z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Select Spot Market</div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {assets.map(a => (
                  <button
                    key={a.symbol}
                    onClick={() => handleSelectCoin(a.symbol)}
                    className="w-full px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{a.symbol}</span>
                      <span className="text-[11px] text-slate-400">{a.name}</span>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div className="text-white">${a.price.toLocaleString()}</div>
                      <div className={`text-[10px] ${a.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 24h Stats Ribbon */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-8 text-xs font-mono tabular-nums">
          <div>
            <div className="text-[10px] text-slate-400 font-sans">Spot Price</div>
            <div className="text-base font-bold text-white">
              ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: selectedAsset.decimalPlaces })}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-sans">24h Change</div>
            <div className={`font-semibold ${selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 font-sans">24h High</div>
            <div className="text-slate-200">${selectedAsset.high24h.toLocaleString()}</div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 font-sans">24h Low</div>
            <div className="text-slate-200">${selectedAsset.low24h.toLocaleString()}</div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 font-sans">24h Turnover (USDT)</div>
            <div className="text-slate-200">${(selectedAsset.volume24h / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      </div>

      {/* 2. Main Trading Grid: Chart (Left), Order Book (Middle), Order Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Interactive Candlestick Chart */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-3">
          <InteractiveChart asset={selectedAsset} height={420} />
        </div>

        {/* Middle: Live Order Book & Recent Trades */}
        <div className="lg:col-span-3 xl:col-span-2 bg-[#070B14] border border-slate-800 rounded-xl p-3 flex flex-col justify-between text-xs font-mono">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-sans font-semibold">
              <span>Order Book</span>
              <span>Spread: {spreadPercentage}%</span>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Price (USDT)</span>
              <span>Size ({selectedAsset.symbol})</span>
            </div>

            {/* Asks (Sell orders - Red) */}
            <div className="space-y-1 mb-2">
              {orderBookAsks.map((ask, i) => (
                <div key={i} className="flex justify-between text-[11px] relative py-0.5">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-rose-500/10 rounded"
                    style={{ width: `${Math.min(100, ask.amount * 100)}%` }}
                  />
                  <span className="text-rose-400 font-semibold relative z-10">{ask.price}</span>
                  <span className="text-slate-300 relative z-10">{ask.amount}</span>
                </div>
              ))}
            </div>

            {/* Current Price Divider */}
            <div className="py-1.5 my-1 border-y border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">${selectedAsset.price.toLocaleString()}</span>
              <span className={`text-[10px] ${selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedAsset.change24h >= 0 ? '↑' : '↓'}
              </span>
            </div>

            {/* Bids (Buy orders - Green) */}
            <div className="space-y-1">
              {orderBookBids.map((bid, i) => (
                <div key={i} className="flex justify-between text-[11px] relative py-0.5">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 rounded"
                    style={{ width: `${Math.min(100, bid.amount * 100)}%` }}
                  />
                  <span className="text-emerald-400 font-semibold relative z-10">{bid.price}</span>
                  <span className="text-slate-300 relative z-10">{bid.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades Mini Feed */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="text-[10px] font-sans font-semibold text-slate-400 mb-1.5 uppercase">Market Trades</div>
            <div className="space-y-1">
              {marketTrades.slice(0, 4).map(t => (
                <div key={t.id} className="flex justify-between text-[10px]">
                  <span className={t.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}>{t.price}</span>
                  <span className="text-slate-400">{t.amount}</span>
                  <span className="text-slate-500">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Entry Panel */}
        <div className="lg:col-span-3 xl:col-span-3 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#0B1120] rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  side === 'buy'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Buy {selectedAsset.symbol}
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  side === 'sell'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sell {selectedAsset.symbol}
              </button>
            </div>

            {/* Limit / Market selector */}
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOrderType('limit')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  orderType === 'limit'
                    ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Limit
              </button>
              <button
                type="button"
                onClick={() => setOrderType('market')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  orderType === 'market'
                    ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Market
              </button>
            </div>

            {/* Price field */}
            {orderType === 'limit' ? (
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Order Price (USDT)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={priceInput}
                    onChange={e => setPriceInput(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-500">USDT</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#0B1120] border border-slate-800 text-xs text-slate-400 flex justify-between items-center">
                <span>Execution Price:</span>
                <span className="text-white font-mono font-bold">Best Market Price</span>
              </div>
            )}

            {/* Amount field */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-1">
                <label className="font-semibold text-slate-400">Amount ({selectedAsset.symbol})</label>
                <span className="text-slate-500">
                  Avail: {side === 'buy' ? `${usdtBalance.toFixed(2)} USDT` : `${coinBalance.toFixed(4)} ${selectedAsset.symbol}`}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-500">{selectedAsset.symbol}</span>
              </div>
            </div>

            {/* Quick Percentage Chips */}
            <div className="grid grid-cols-4 gap-1.5">
              {[25, 50, 75, 100].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentage(pct)}
                  className="py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Total calculation & fee */}
            <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Order Total:</span>
                <span className="font-mono text-white font-bold tabular-nums">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Standard Fee:</span>
                <span className="font-mono text-cyan-400 tabular-nums">0.02% (Maker)</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                side === 'buy'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              {side === 'buy' ? `Buy ${selectedAsset.symbol}` : `Sell ${selectedAsset.symbol}`}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Bottom Trading Desk Tabs (Open Orders, Order History, Assets) */}
      <div className="bg-[#070B14] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="flex border-b border-slate-800 bg-[#0B1120] px-4">
          <button
            onClick={() => setBottomTab('open')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              bottomTab === 'open'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Open Orders ({spotOrders.filter(o => o.status === 'open').length})
          </button>
          <button
            onClick={() => setBottomTab('history')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              bottomTab === 'history'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setBottomTab('assets')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              bottomTab === 'assets'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Spot Balances
          </button>
        </div>

        <div className="p-4">
          {bottomTab === 'open' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Pair</th>
                    <th className="py-2.5 px-3">Side</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Filled</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                  {spotOrders
                    .filter(o => o.status === 'open')
                    .map(order => (
                      <tr key={order.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{order.timestamp}</td>
                        <td className="py-2.5 px-3 font-bold text-white font-sans">{order.pair}</td>
                        <td className="py-2.5 px-3 uppercase font-bold">
                          <span className={order.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}>
                            {order.side}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">${order.price.toLocaleString()}</td>
                        <td className="py-2.5 px-3">{order.amount}</td>
                        <td className="py-2.5 px-3">{order.filled}</td>
                        <td className="py-2.5 px-3">${order.total.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => cancelSpotOrder(order.id)}
                            className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 text-[11px] font-sans transition-colors"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  {spotOrders.filter(o => o.status === 'open').length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-500 font-sans text-xs">
                        No active open orders found for spot market.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {bottomTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Pair</th>
                    <th className="py-2.5 px-3">Side</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Executed Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                  {spotOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">{order.timestamp}</td>
                      <td className="py-2.5 px-3 text-cyan-400">{order.id}</td>
                      <td className="py-2.5 px-3 font-bold text-white font-sans">{order.pair}</td>
                      <td className="py-2.5 px-3 uppercase font-bold">
                        <span className={order.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}>
                          {order.side}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">${order.price.toLocaleString()}</td>
                      <td className="py-2.5 px-3">{order.amount}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            order.status === 'filled'
                              ? 'bg-emerald-950/80 text-emerald-400'
                              : order.status === 'open'
                              ? 'bg-cyan-950/80 text-cyan-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {bottomTab === 'assets' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {balances.slice(0, 4).map(b => (
                <div key={b.symbol} className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl">
                  <div className="text-xs font-bold text-white">{b.symbol}</div>
                  <div className="text-[11px] text-slate-400">Avail: {b.available.toLocaleString()}</div>
                  <div className="text-sm font-mono font-bold text-cyan-400 mt-1 tabular-nums">
                    ${b.usdValue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
