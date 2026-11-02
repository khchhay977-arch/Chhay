/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useExchange } from '../../context/ExchangeContext';
import { AnimatedLogo } from '../common/AnimatedLogo';
import { ArrowRight, Lock, TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, isLoggedIn } = useExchange();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/80 bg-[#040711]">
      {/* 1. Cinematic Ambient Lighting & Neon Waves */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.28, 0.15],
          x: ['-50%', '-48%', '-50%'],
          y: ['-50%', '-52%', '-50%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/2 w-[850px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-600/30 via-sky-500/20 to-blue-700/30 blur-[170px] pointer-events-none -z-0"
      />

      {/* Subtle moving grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Headline, Subtitle & Prominent CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-cyan-300">
                Institutional Cryptocurrency Exchange
              </span>
            </div>

            {/* Exact Required Headline: TRADE. GROW. TOGETHER. */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.05]">
              TRADE.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                GROW.
              </span>{' '}
              TOGETHER.
            </h1>

            {/* Exact Required Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A modern digital asset trading experience built around technology, transparency, and security.
            </p>

            {/* Two Prominent CTA Buttons: 1. REGISTER NOW, 2. LOGIN */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              {/* Button 1: REGISTER NOW */}
              <motion.button
                onClick={() => setCurrentPage(isLoggedIn ? 'dashboard' : 'register')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(6,182,212,0.65)] transition-all flex items-center gap-2.5 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                <span>{isLoggedIn ? 'OPEN TRADING DESK' : 'REGISTER NOW'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Button 2: LOGIN */}
              <motion.button
                onClick={() => setCurrentPage(isLoggedIn ? 'dashboard' : 'login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 rounded-xl bg-[#070B14] hover:bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/60 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center gap-2.5 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                <span>{isLoggedIn ? 'MY ACCOUNT' : 'LOGIN'}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Operational Quality Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/60 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-300 font-semibold">100% Segregated</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] text-slate-300 font-semibold">Sub-Millisecond Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[11px] text-slate-300 font-semibold">Deep Orderbooks</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual with Animated NEXORA Geometric N Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Terminal Holographic Presentation Card */}
            <div className="relative w-full max-w-md rounded-3xl border border-slate-800/90 bg-[#070B14]/90 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center text-center overflow-hidden group">
              {/* Glowing Corner Accents */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

              {/* Central 3D Animated NEXORA Logo with Rotating Ring */}
              <div className="py-4">
                <AnimatedLogo size="xl" showWordmark={true} />
              </div>

              {/* Dynamic Telemetry Metrics Panel */}
              <div className="w-full mt-6 pt-5 border-t border-slate-800/80 space-y-3 font-mono text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Order Routing Protocol</span>
                  <span className="text-cyan-400 font-bold">NEX-CORE v4.8</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Trading Desk Security</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    HARDENED
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Market Feed Status</span>
                  <span className="text-white font-bold">REAL-TIME REST / WS</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
