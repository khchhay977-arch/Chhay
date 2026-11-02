/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useExchange } from '../context/ExchangeContext';
import { TerminalLiveSession } from '../components/home/TerminalLiveSession';
import { DownloadAppModal } from '../components/home/DownloadAppModal';

interface MarketCard {
  symbol: string;
  pair: string;
  price: number;
  change24h: number;
  isPositive: boolean;
}

const INITIAL_CARDS: MarketCard[] = [
  { symbol: 'BTC', pair: 'BTC/USD', price: 81704.77, change24h: 4.12, isPositive: true },
  { symbol: 'ETH', pair: 'ETH/USD', price: 3532.63, change24h: 2.65, isPositive: true },
  { symbol: 'SOL', pair: 'SOL/USD', price: 189.42, change24h: -0.85, isPositive: false },
  { symbol: 'NEX', pair: 'NEX/USD', price: 24.84, change24h: 18.40, isPositive: true },
];

export const HomePage: React.FC = () => {
  const { setCurrentPage, setSelectedSymbol } = useExchange();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [marketCards, setMarketCards] = useState<MarketCard[]>(INITIAL_CARDS);

  // Subtle real-time price tick
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketCards(prev =>
        prev.map(item => {
          if (Math.random() > 0.5) return item;
          const delta = (Math.random() - 0.48) * (item.price * 0.001);
          const newPrice = Number((item.price + delta).toFixed(2));
          return {
            ...item,
            price: newPrice,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectCoin = (symbol: string) => {
    setSelectedSymbol(symbol);
    setCurrentPage('spot');
  };

  return (
    <div className="min-h-screen bg-[#03060E] text-slate-100 flex flex-col items-center justify-start pt-6 pb-16 px-4 sm:px-6 relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Main Column Container — Formatted to Match Reference Video */}
      <div className="w-full max-w-xl mx-auto space-y-6 relative z-10">
        
        {/* 1. Official Updated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070B14] border border-slate-800 text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-slate-300 font-semibold text-[11px] sm:text-xs">
              Official Updated: <span className="text-white font-bold">October 1, 2026</span>
            </span>
          </div>
        </motion.div>

        {/* 2. Main Headline & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center space-y-3 px-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Next-Gen Crypto{' '}
            <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              Trading Infrastructure
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Institutional-grade security standards with transparent liquidity pools and end-to-end cryptographic blockchain validation.
          </p>
        </motion.div>

        {/* 3. Three Prominent Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 w-full px-1"
        >
          {/* Button 1: LOGIN ACCOUNT */}
          <button
            onClick={() => setCurrentPage('login')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center cursor-pointer active:scale-[0.99]"
          >
            LOGIN ACCOUNT
          </button>

          {/* Button 2: REGISTER ACCOUNT */}
          <button
            onClick={() => setCurrentPage('register')}
            className="w-full py-3.5 rounded-xl bg-[#070B14] hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-[0.99]"
          >
            REGISTER ACCOUNT
          </button>

          {/* Button 3: DOWNLOAD APP */}
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="w-full py-3.5 rounded-xl bg-[#070B14] hover:bg-slate-800/80 border border-emerald-500/60 hover:border-emerald-400 text-emerald-400 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center cursor-pointer active:scale-[0.99]"
          >
            DOWNLOAD APP
          </button>
        </motion.div>

        {/* 4. Cryptocurrency Market Cards Grid (BTC, ETH, SOL, NEX) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 pt-1"
        >
          {marketCards.map(item => (
            <div
              key={item.pair}
              onClick={() => handleSelectCoin(item.symbol)}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#070B14] border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between"
            >
              {/* Top Row: Pair & 24h Change Pill */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                  {item.pair}
                </span>

                <span
                  className={`text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-md flex items-center ${
                    item.isPositive
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                      : 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                  }`}
                >
                  {item.isPositive ? '+' : ''}{item.change24h.toFixed(2)}%
                </span>
              </div>

              {/* Bottom Row: Large Tabular Price */}
              <div className="font-mono text-base sm:text-xl font-black text-white tabular-nums tracking-tight">
                ${item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 5. Trading Chart / Live Session Terminal Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-1"
        >
          <TerminalLiveSession />
        </motion.div>
      </div>

      {/* Verified Mobile Client Download Modal */}
      <DownloadAppModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};
