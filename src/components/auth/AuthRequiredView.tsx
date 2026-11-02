/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useExchange } from '../../context/ExchangeContext';
import { AnimatedLogo } from '../common/AnimatedLogo';
import { TerminalBackground } from './TerminalBackground';
import { Lock, ArrowRight, ShieldCheck, UserPlus, ArrowLeft } from 'lucide-react';

interface AuthRequiredViewProps {
  pageName?: string;
}

export const AuthRequiredView: React.FC<AuthRequiredViewProps> = ({ pageName = 'Trading Account' }) => {
  const { setCurrentPage } = useExchange();

  return (
    <TerminalBackground>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-[#070B14]/90 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(2,6,23,0.8)] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="mb-6 flex justify-center">
          <AnimatedLogo size="md" showWordmark={true} />
        </div>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Lock className="w-7 h-7 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </div>

        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Authentication Required
        </h2>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Access to private <span className="text-cyan-400 font-semibold">{pageName}</span> balances, funding rails, and transaction histories is restricted to verified NEXORA account holders.
        </p>

        <div className="space-y-3 pt-6">
          <button
            onClick={() => setCurrentPage('login')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>LOGIN TO ACCESS ACCOUNT</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={() => setCurrentPage('register')}
            className="w-full py-3 rounded-xl bg-[#03060E] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>REGISTER NEW TRADING ACCOUNT</span>
          </button>

          <button
            onClick={() => setCurrentPage('home')}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors pt-2 flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Public Welcome Page</span>
          </button>
        </div>
      </motion.div>
    </TerminalBackground>
  );
};
