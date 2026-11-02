/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExchange } from '../../context/ExchangeContext';
import { PageId } from '../../types/exchange';
import { ShieldCheck, Lock, Layers, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useExchange();

  const handleNav = (p: PageId) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#04060C] text-slate-400 text-xs pb-20 lg:pb-8">
      {/* Upper highlight trust bar */}
      <div className="border-b border-slate-800/50 bg-[#070B14]/40 py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs">Account Segregation</div>
              <div className="text-[11px] text-slate-500">Separated operational controls</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs">Multi-Factor Security</div>
              <div className="text-[11px] text-slate-500">2FA & FIDO2 passkey protection</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs">Transparent Execution</div>
              <div className="text-[11px] text-slate-500">Published maker & taker schedules</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs">Dedicated Client Support</div>
              <div className="text-[11px] text-slate-500">24/7 technical and trading desk</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                N
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                NEX<span className="text-amber-400">O</span>RA
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              NEXORA is a premier cryptocurrency exchange platform offering high-liquidity spot trading, perpetual contracts, and institutional-grade digital asset infrastructure.
            </p>
            <div className="text-[11px] text-slate-500">
              Platform Status: All Systems Operational
            </div>
          </div>

          {/* Col 1: Products */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">Trading</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('spot')} className="hover:text-cyan-400 transition-colors">
                  Spot Trading
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('futures')} className="hover:text-cyan-400 transition-colors">
                  Perpetual Futures
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('markets')} className="hover:text-cyan-400 transition-colors">
                  Markets Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Asset Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Wallet & Finance */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">Wallet</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('deposit')} className="hover:text-cyan-400 transition-colors">
                  Deposit Funds
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('withdrawal')} className="hover:text-cyan-400 transition-colors">
                  Withdrawal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('history')} className="hover:text-cyan-400 transition-colors">
                  Transaction Ledger
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('referral')} className="hover:text-cyan-400 transition-colors">
                  Affiliate Program
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Security & Compliance */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">Security & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('security')} className="hover:text-cyan-400 transition-colors">
                  Security Center
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('settings')} className="hover:text-cyan-400 transition-colors">
                  Account Verification
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('forgot-password')} className="hover:text-cyan-400 transition-colors">
                  Password Recovery
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimer */}
        <div className="pt-8 border-t border-slate-800/60 space-y-3 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Risk Warning:</strong> Cryptocurrency trading and digital asset derivative contracts involve substantial financial risk. Prices of virtual assets can fluctuate rapidly, and you may lose some or all of your invested capital. You should ensure that digital asset trading is suitable for your financial situation and seek independent financial advice if necessary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400">
            <div>© {new Date().getFullYear()} NEXORA Holdings Inc. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-200 cursor-pointer">Fee Schedule</span>
              <span className="hover:text-slate-200 cursor-pointer">Compliance Disclosures</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
