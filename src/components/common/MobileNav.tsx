/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExchange } from '../../context/ExchangeContext';
import { PageId } from '../../types/exchange';
import {
  Home,
  BarChart2,
  TrendingUp,
  Zap,
  Wallet,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Shield,
  Settings,
  Users,
  LogIn,
  UserPlus,
  KeyRound,
  LogOut,
  Globe,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, isLoggedIn, logout, user, language, setLanguage } = useExchange();

  const handleNav = (page: PageId) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <>
      {/* 1. Sticky Mobile Bottom Dock (under 15% viewport height cap) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B14]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {isLoggedIn ? (
          /* Authenticated Users Bottom Bar: Home, Markets, Spot, Futures, Assets */
          <>
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                currentPage === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('markets')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                currentPage === 'markets' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Markets</span>
            </button>

            <button
              onClick={() => setCurrentPage('spot')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                currentPage === 'spot' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Spot</span>
            </button>

            <button
              onClick={() => setCurrentPage('futures')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                currentPage === 'futures' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Futures</span>
            </button>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                currentPage === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wallet className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Assets</span>
            </button>
          </>
        ) : (
          /* Visitor Bottom Bar: Clean Public Navigation */
          <>
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-lg transition-colors ${
                currentPage === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('markets')}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-lg transition-colors ${
                currentPage === 'markets' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Markets</span>
            </button>

            <button
              onClick={() => setCurrentPage('login')}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-lg transition-colors ${
                currentPage === 'login' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Log In</span>
            </button>

            <button
              onClick={() => setCurrentPage('register')}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-lg transition-colors ${
                currentPage === 'register' ? 'text-cyan-400 font-bold' : 'text-cyan-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Register</span>
            </button>
          </>
        )}
      </nav>

      {/* 2. Slide-over Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <div className="relative w-4/5 max-w-xs bg-[#070B14] border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm">
                  N
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-wider text-white">
                    NEX<span className="text-amber-400">O</span>RA
                  </div>
                  <div className="text-[8px] text-cyan-400 font-semibold tracking-widest uppercase">EXCHANGE</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Snippet */}
            {isLoggedIn ? (
              <div className="p-4 bg-slate-900/60 border-b border-slate-800">
                <div className="text-xs font-bold text-white">{user?.displayName}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                    UID: {user?.uid}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-center"
                >
                  Register
                </button>
              </div>
            )}

            {/* Navigation Lists */}
            <div className="p-3 space-y-4 flex-1">
              <div>
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Navigation
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => handleNav('home')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentPage === 'home' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-cyan-400" />
                    <span>Homepage</span>
                  </button>
                  <button
                    onClick={() => handleNav('markets')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentPage === 'markets' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <BarChart2 className="w-4 h-4 text-blue-400" />
                    <span>Markets Overview</span>
                  </button>
                  <button
                    onClick={() => handleNav('spot')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentPage === 'spot' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Spot Trading</span>
                  </button>
                  <button
                    onClick={() => handleNav('futures')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentPage === 'futures' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Perpetual Futures</span>
                  </button>
                  <button
                    onClick={() => handleNav('security')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentPage === 'security' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Security Center</span>
                  </button>
                </div>
              </div>

              {isLoggedIn && (
                <>
                  <div>
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Account & Assets
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <button
                        onClick={() => handleNav('dashboard')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPage === 'dashboard' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <Wallet className="w-4 h-4 text-cyan-400" />
                        <span>Asset Dashboard</span>
                      </button>
                      <button
                        onClick={() => handleNav('deposit')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPage === 'deposit' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                        <span>Deposit</span>
                      </button>
                      <button
                        onClick={() => handleNav('withdrawal')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPage === 'withdrawal' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4 text-blue-400" />
                        <span>Withdrawal</span>
                      </button>
                      <button
                        onClick={() => handleNav('history')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPage === 'history' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <History className="w-4 h-4 text-purple-400" />
                        <span>Transaction Ledger</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Security & Settings
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <button
                        onClick={() => handleNav('security')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPage === 'security' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Security Center</span>
                      </button>
                      <button
                        onClick={() => handleNav('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPage === 'settings' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Account Settings</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sign Out or Footer */}
            {isLoggedIn && (
              <div className="p-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/30 hover:bg-rose-950/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
