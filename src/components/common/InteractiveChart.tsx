/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CryptoAsset } from '../../types/exchange';

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface InteractiveChartProps {
  asset: CryptoAsset;
  height?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ asset, height = 380 }) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W'>('1h');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showMA, setShowMA] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate synthetic but realistic deterministic candlesticks based on current price & timeframe
  const candles = useMemo(() => {
    const count = 48;
    const list: Candle[] = [];
    const basePrice = asset.price;
    let curr = basePrice * (1 - (asset.change24h / 100) * 0.75);

    const now = Date.now();
    const stepMinutes = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '1h': 60,
      '4h': 240,
      '1D': 1440,
      '1W': 10080,
    }[timeframe];

    for (let i = count - 1; i >= 0; i--) {
      const timeDate = new Date(now - i * stepMinutes * 60 * 1000);
      const timeStr =
        timeframe === '1D' || timeframe === '1W'
          ? `${timeDate.getMonth() + 1}/${timeDate.getDate()}`
          : `${timeDate.getHours().toString().padStart(2, '0')}:${timeDate.getMinutes().toString().padStart(2, '0')}`;

      // Pseudo-random walk with seed
      const seed = Math.sin(i * 12.9898 + (asset.price % 100)) * 43758.5453;
      const variation = (seed - Math.floor(seed) - 0.48) * 0.008 * basePrice;
      const open = curr;
      const close = i === 0 ? asset.price : Math.max(open * 0.9, open + variation);
      const high = Math.max(open, close) + Math.abs(variation) * 0.7;
      const low = Math.min(open, close) - Math.abs(variation) * 0.7;
      const volume = Math.floor(Math.abs(seed % 500) + 120);

      list.push({
        time: timeStr,
        open: Number(open.toFixed(asset.decimalPlaces)),
        high: Number(high.toFixed(asset.decimalPlaces)),
        low: Number(low.toFixed(asset.decimalPlaces)),
        close: Number(close.toFixed(asset.decimalPlaces)),
        volume,
      });

      curr = close;
    }

    return list;
  }, [asset.price, asset.change24h, asset.decimalPlaces, timeframe]);

  // Compute Moving Averages MA(7)
  const ma7 = useMemo(() => {
    return candles.map((_, idx) => {
      if (idx < 6) return null;
      const slice = candles.slice(idx - 6, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 7;
    });
  }, [candles]);

  // Geometry calculations
  const chartHeight = height - 70;
  const volumeHeight = 50;
  const paddingRight = 65;
  const paddingLeft = 10;
  const plotWidth = Math.max(200, containerWidth - paddingRight - paddingLeft);

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 30) - 20;
  };

  const candleSpacing = plotWidth / candles.length;
  const candleBodyWidth = Math.max(2, Math.min(10, candleSpacing * 0.65));

  // Current display candle in header (hovered or last)
  const currentView = hoveredCandle || candles[candles.length - 1];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - paddingLeft;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= plotWidth) {
      const idx = Math.min(candles.length - 1, Math.max(0, Math.floor(x / candleSpacing)));
      setHoveredCandle(candles[idx]);
      setMousePos({ x: x + paddingLeft, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setMousePos(null);
  };

  return (
    <div className="w-full bg-[#070B14] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col">
      {/* Chart Top Controls & Live HUD */}
      <div className="px-4 py-2.5 border-b border-slate-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Timeframes */}
        <div className="flex items-center gap-1 bg-[#0B1120] p-0.5 rounded-lg border border-slate-800">
          {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                timeframe === tf
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* HUD Data display (Open, High, Low, Close, Volume) */}
        {currentView && (
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono tabular-nums text-slate-400">
            <div>
              <span className="text-slate-500">O:</span>{' '}
              <span className="text-white">${currentView.open.toFixed(asset.decimalPlaces)}</span>
            </div>
            <div>
              <span className="text-slate-500">H:</span>{' '}
              <span className="text-white">${currentView.high.toFixed(asset.decimalPlaces)}</span>
            </div>
            <div>
              <span className="text-slate-500">L:</span>{' '}
              <span className="text-white">${currentView.low.toFixed(asset.decimalPlaces)}</span>
            </div>
            <div>
              <span className="text-slate-500">C:</span>{' '}
              <span
                className={
                  currentView.close >= currentView.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                }
              >
                ${currentView.close.toFixed(asset.decimalPlaces)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Vol:</span>{' '}
              <span className="text-slate-300">{currentView.volume}</span>
            </div>
          </div>
        )}

        {/* Display Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType(chartType === 'candles' ? 'line' : 'candles')}
            className="px-2.5 py-1 rounded border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            {chartType === 'candles' ? 'Line' : 'Candles'}
          </button>
          <button
            onClick={() => setShowMA(!showMA)}
            className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              showMA
                ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400'
                : 'border-slate-800 text-slate-500'
            }`}
          >
            MA(7)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full cursor-crosshair select-none"
        style={{ height }}
      >
        <svg width="100%" height={height} className="overflow-visible block">
          <defs>
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map(ratio => {
            const y = chartHeight * ratio;
            const p = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={containerWidth - paddingRight}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                />
                <text
                  x={containerWidth - paddingRight + 6}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  ${p.toFixed(asset.decimalPlaces)}
                </text>
              </g>
            );
          })}

          {/* Volume sub-chart separator line */}
          <line
            x1={paddingLeft}
            y1={chartHeight}
            x2={containerWidth - paddingRight}
            y2={chartHeight}
            stroke="#1E293B"
            strokeWidth="1"
          />

          {/* Render Volume Bars */}
          {candles.map((candle, idx) => {
            const x = paddingLeft + idx * candleSpacing + candleSpacing / 2;
            const barH = (candle.volume / maxVolume) * volumeHeight;
            const y = height - 20 - barH;
            const isBullish = candle.close >= candle.open;

            return (
              <rect
                key={`vol_${idx}`}
                x={x - candleBodyWidth / 2}
                y={y}
                width={candleBodyWidth}
                height={barH}
                fill={isBullish ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}
              />
            );
          })}

          {/* Candlesticks OR Line */}
          {chartType === 'candles' ? (
            candles.map((candle, idx) => {
              const x = paddingLeft + idx * candleSpacing + candleSpacing / 2;
              const yOpen = getY(candle.open);
              const yClose = getY(candle.close);
              const yHigh = getY(candle.high);
              const yLow = getY(candle.low);
              const isBullish = candle.close >= candle.open;
              const color = isBullish ? '#10B981' : '#F43F5E';
              const top = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));

              return (
                <g key={`c_${idx}`}>
                  {/* Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.25" />
                  {/* Body */}
                  <rect
                    x={x - candleBodyWidth / 2}
                    y={top}
                    width={candleBodyWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          ) : (
            <>
              {/* Area fill */}
              <polygon
                fill="url(#chartLineGrad)"
                points={[
                  `${paddingLeft + candleSpacing / 2},${chartHeight}`,
                  ...candles.map(
                    (c, i) => `${paddingLeft + i * candleSpacing + candleSpacing / 2},${getY(c.close)}`
                  ),
                  `${paddingLeft + (candles.length - 1) * candleSpacing + candleSpacing / 2},${chartHeight}`,
                ].join(' ')}
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={candles
                  .map(
                    (c, i) => `${paddingLeft + i * candleSpacing + candleSpacing / 2},${getY(c.close)}`
                  )
                  .join(' ')}
              />
            </>
          )}

          {/* Moving Average Line MA(7) */}
          {showMA && (
            <polyline
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              strokeLinecap="round"
              points={candles
                .map((_, i) => {
                  const val = ma7[i];
                  if (val === null) return '';
                  return `${paddingLeft + i * candleSpacing + candleSpacing / 2},${getY(val)}`;
                })
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* Current Live Price Horizontal Line */}
          {candles.length > 0 && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(asset.price)}
                x2={containerWidth - paddingRight}
                y2={getY(asset.price)}
                stroke="#06B6D4"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Price Tag badge on right axis */}
              <rect
                x={containerWidth - paddingRight + 2}
                y={getY(asset.price) - 9}
                width={60}
                height={18}
                fill="#0891B2"
                rx="3"
              />
              <text
                x={containerWidth - paddingRight + 6}
                y={getY(asset.price) + 4}
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="bold"
                fontFamily="var(--font-mono)"
              >
                ${asset.price.toFixed(asset.decimalPlaces)}
              </text>
            </g>
          )}

          {/* Interactive Crosshair & Cursor */}
          {mousePos && (
            <g>
              {/* Vertical line */}
              <line
                x1={mousePos.x}
                y1={0}
                x2={mousePos.x}
                y2={height - 20}
                stroke="#475569"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Horizontal line */}
              <line
                x1={paddingLeft}
                y1={mousePos.y}
                x2={containerWidth - paddingRight}
                y2={mousePos.y}
                stroke="#475569"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Bottom Time Axis Labels */}
        <div className="absolute bottom-1 left-2 right-16 flex justify-between text-[9px] text-slate-500 font-mono pointer-events-none">
          {candles
            .filter((_, idx) => idx % Math.max(1, Math.floor(candles.length / 6)) === 0)
            .map((c, i) => (
              <span key={i}>{c.time}</span>
            ))}
        </div>
      </div>
    </div>
  );
};
