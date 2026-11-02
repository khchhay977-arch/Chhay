/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Send } from 'lucide-react';

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', sender: '+1 415-***-2314', text: 'Yes 100% legit, withdrawals are processed instantly.', time: '11:08' },
  { id: '2', sender: '+34 68-***-7215', text: 'Tested your code on the 15m timeframe... insane accuracy man, thanks!', time: '11:08' },
  { id: '3', sender: '+63 999-***-8779', text: 'Legit ba tong platform na to mga boss?', time: '11:09' },
  { id: '4', sender: '+63 917-***-8868', text: 'Pm ka boss tuturan kita sa staking pool', time: '11:09' },
  { id: '5', sender: '+49 151-***-7020', text: 'Institutional liquidity provisioning is working flawlessly.', time: '11:09' },
  { id: '6', sender: '+63 908-***-2631', text: 'May mga tagalog ba dito?', time: '11:10' },
  { id: '7', sender: '+63 999-***-6213', text: 'May GC ba para sa mga Pinoy traders dito?', time: '11:10' },
];

export const TerminalLiveSession: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(81840.38);
  const [viewerCount, setViewerCount] = useState(1849);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Generate initial realistic candlestick data
  const [candles, setCandles] = useState<Candle[]>(() => {
    const list: Candle[] = [];
    let base = 81650;
    for (let i = 0; i < 30; i++) {
      const open = base;
      const delta = (Math.random() - 0.48) * 85;
      const close = open + delta;
      const high = Math.max(open, close) + Math.random() * 40;
      const low = Math.min(open, close) - Math.random() * 40;
      base = close;
      list.push({ time: `${i}m`, open, high, low, close });
    }
    return list;
  });

  // Live price fluctuation & candlestick tick
  useEffect(() => {
    const interval = setInterval(() => {
      // Micro price change
      const delta = (Math.random() - 0.47) * 12;
      setCurrentPrice(prev => {
        const next = Number((prev + delta).toFixed(2));
        setCandles(prevCandles => {
          if (prevCandles.length === 0) return prevCandles;
          const lastIdx = prevCandles.length - 1;
          const last = prevCandles[lastIdx];
          const updatedLast = {
            ...last,
            close: next,
            high: Math.max(last.high, next),
            low: Math.min(last.low, next),
          };
          return [...prevCandles.slice(0, lastIdx), updatedLast];
        });
        return next;
      });

      // Realistic watcher count fluctuation
      if (Math.random() > 0.6) {
        setViewerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: '+1 202-***-9841',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  // Dimensions & bounds for the candlestick SVG
  const width = 640;
  const height = 180;
  const minPrice = Math.min(...candles.map(c => c.low)) - 20;
  const maxPrice = Math.max(...candles.map(c => c.high)) + 20;
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => height - ((val - minPrice) / priceRange) * (height - 20) - 10;
  const candleWidth = width / candles.length;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-[#070B14] overflow-hidden shadow-2xl">
      {/* 1. Header: LIVE SESSION & Viewers Count */}
      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/50">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">
            LIVE SESSION
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white font-bold">{viewerCount.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">watching</span>
        </div>
      </div>

      {/* 2. Pair Info & Current Price Tag */}
      <div className="px-4 py-2.5 bg-[#050811] border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-white">BTC/USD 1M</span>
        </div>
        <div className="font-mono text-sm sm:text-base font-black text-emerald-400 tabular-nums">
          ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 3. Real Candlestick Chart Area */}
      <div className="relative w-full h-[180px] bg-[#04060E] overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 30px',
          }}
        />

        {/* Current price dashed horizontal line */}
        <div
          className="absolute left-0 right-0 border-b border-dashed border-emerald-400/60 pointer-events-none z-10 transition-all duration-300"
          style={{ top: `${getY(currentPrice)}px` }}
        >
          <span className="absolute right-1 -top-2.5 text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 rounded shadow">
            ${currentPrice.toFixed(2)}
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          {candles.map((candle, idx) => {
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#10b981' : '#f43f5e';
            const x = idx * candleWidth + candleWidth * 0.15;
            const cWidth = candleWidth * 0.7;
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);
            const top = Math.min(yOpen, yClose);
            const h = Math.max(Math.abs(yClose - yOpen), 2);
            const xMid = x + cWidth / 2;

            return (
              <g key={idx}>
                {/* Upper and Lower Wick */}
                <line x1={xMid} y1={yHigh} x2={xMid} y2={yLow} stroke={color} strokeWidth="1.2" />
                {/* Candle Body */}
                <rect x={x} y={top} width={cWidth} height={h} fill={color} rx="1" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4. Live Chat / Terminal Stream */}
      <div className="border-t border-slate-800 bg-[#070B14]">
        <div
          ref={chatScrollRef}
          className="h-44 sm:h-48 overflow-y-auto p-3 space-y-2 text-xs font-mono scroll-smooth"
        >
          {messages.map(msg => (
            <div key={msg.id} className="leading-snug flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold shrink-0">{msg.sender}:</span>
              <span className="text-slate-300">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-800/80 bg-[#050811] flex gap-2">
          <input
            type="text"
            placeholder="Message..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            className="flex-1 bg-[#070B14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>SEND</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
