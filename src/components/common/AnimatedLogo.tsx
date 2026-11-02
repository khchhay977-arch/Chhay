/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'lg',
  showWordmark = true,
  className = '',
}) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', svg: 32, ring: 36, text: 'text-base', sub: 'text-[8px]' },
    md: { box: 'w-12 h-12', svg: 48, ring: 54, text: 'text-xl', sub: 'text-[9px]' },
    lg: { box: 'w-20 h-20', svg: 80, ring: 92, text: 'text-2xl sm:text-3xl', sub: 'text-[10px]' },
    xl: { box: 'w-28 h-28', svg: 112, ring: 128, text: 'text-4xl', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Geometric N with Orbiting Rings */}
      <div className={`relative ${dimensions.box} flex items-center justify-center`}>
        {/* Ambient radial pulsing cyan glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 -m-3 rounded-full bg-gradient-to-tr from-cyan-500/30 via-sky-400/20 to-blue-600/30 blur-xl pointer-events-none"
        />

        {/* Outer Circular Dashed Neon Ring (Clockwise Rotation) */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full scale-125 pointer-events-none"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray="5 7 12 7"
            strokeLinecap="round"
            className="opacity-70 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
          />
          {/* Orbiting glowing node 1 */}
          <circle cx="50" cy="6" r="2.5" fill="#22d3ee" className="drop-shadow-[0_0_8px_#22d3ee]" />
          {/* Orbiting glowing node 2 */}
          <circle cx="50" cy="94" r="1.8" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Inner Counter-Rotating Precision Ring */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full scale-110 pointer-events-none"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="0.8"
            strokeDasharray="2 10"
            className="opacity-40"
          />
          {/* Secondary energetic satellite node */}
          <circle cx="90" cy="50" r="1.5" fill="#67e8f9" className="drop-shadow-[0_0_5px_#67e8f9]" />
        </motion.svg>

        {/* Futuristic Geometric 3D-Style N Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-[0_0_15px_rgba(6,182,212,0.45)]"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1"
          >
            <defs>
              {/* Outer Neon Glow Filter */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 3D Cyan Gradient (Left Pillar) */}
              <linearGradient id="pillarLeft" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="60%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>

              {/* 3D Diagonal Gradient (Cross Beam) */}
              <linearGradient id="crossBeam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="40%" stopColor="#06b6d4" />
                <stop offset="80%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>

              {/* 3D Electric Blue Gradient (Right Pillar) */}
              <linearGradient id="pillarRight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Metallic Chamfer Highlights */}
              <linearGradient id="metallicEdge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
              </linearGradient>

              {/* Facet Shading */}
              <linearGradient id="facetShadow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#020617" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Left Vertical Pillar - Faceted 3D Polygon */}
            <path
              d="M 22 22 L 36 14 L 36 86 L 22 78 Z"
              fill="url(#pillarLeft)"
              filter="url(#neonGlow)"
            />
            {/* Left Pillar Front Bevel */}
            <path
              d="M 22 22 L 28 18 L 28 82 L 22 78 Z"
              fill="url(#metallicEdge)"
            />

            {/* Center Dynamic Diagonal Shard - Primary 3D Light Stream */}
            <path
              d="M 32 17 L 78 75 L 66 85 L 20 27 Z"
              fill="url(#crossBeam)"
              filter="url(#neonGlow)"
            />
            {/* Center Diagonal Upper Edge Light Stroke */}
            <path
              d="M 32 17 L 78 75"
              stroke="url(#metallicEdge)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Right Vertical Pillar - Deep Perspective Facet */}
            <path
              d="M 64 14 L 78 22 L 78 86 L 64 78 Z"
              fill="url(#pillarRight)"
              filter="url(#neonGlow)"
            />
            {/* Right Bevel Highlight */}
            <path
              d="M 72 18 L 78 22 L 78 86 L 72 82 Z"
              fill="url(#metallicEdge)"
              opacity="0.7"
            />

            {/* Micro Futuristic Circuit Nodes */}
            <circle cx="29" cy="20" r="1.5" fill="#ffffff" />
            <circle cx="71" cy="80" r="1.5" fill="#67e8f9" />
          </svg>
        </motion.div>
      </div>

      {/* Wordmark with Gold Accent on the O */}
      {showWordmark && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-center flex flex-col items-center"
        >
          <div className={`font-black tracking-[0.22em] text-white flex items-center ${dimensions.text}`}>
            {/* N E X */}
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              NEX
            </span>
            {/* Animated Gold Accent O */}
            <span className="relative inline-block mx-[1px]">
              <span className="bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.85)]">
                O
              </span>
              {/* Subtle gold halo ping */}
              <span className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm -z-10 animate-pulse" />
            </span>
            {/* R A */}
            <span className="bg-gradient-to-r from-slate-200 via-slate-100 to-white bg-clip-text text-transparent">
              RA
            </span>
          </div>

          <div
            className={`font-mono uppercase tracking-[0.35em] text-cyan-400/90 font-bold mt-1 ${dimensions.sub} drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]`}
          >
            Digital Asset Exchange
          </div>
        </motion.div>
      )}
    </div>
  );
};
