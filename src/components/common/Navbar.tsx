/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useExchange } from '../../context/ExchangeContext';
import {
  Search,
  Sun,
  Moon,
  ChevronDown,
  User,
  Shield,
  CreditCard,
  History,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Menu,
  Zap,
  Globe,
  Check,
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'ja', label: '日本語', short: 'JA' },
  { code: 'fr', label: 'Français', short: 'FR' },
];

export const Navbar: React.FC<{ onOpenMobileMenu: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    currentPage,
    setCurrentPage,
    setSelectedSymbol,
    assets,
    user,
    isLoggedIn,
    totalBalanceUsd,
    logout,
    theme,
    toggleTheme,
    language,
    setLanguage,
  } = useExchange();

  const [tradeDropdownOpen, setTradeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const tradeRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tradeRef.current && !tradeRef.current.contains(e.target as Node)) {
        setTradeDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAssets = searchQuery.trim()
    ? assets.filter(
        a =>
          a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : assets.slice(0, 6);

  const handleSelectCoin = (symbol: string) => {
    setSelectedSymbol(symbol);
    setCurrentPage('spot');
    setSearchOpen(false);
    setSearchQuery('');
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070B14]/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Primary Nav Links */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            {/* NEXORA Animated 3D-Style N with Orbiting Dashed Ring */}
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-md group-hover:bg-cyan-400/40 transition-all pointer-events-none" />
              {/* Rotating outer ring */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full scale-125 animate-spin [animation-duration:16s] pointer-events-none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="6 8 14 8"
                  strokeLinecap="round"
                  className="opacity-80"
                />
                <circle cx="50" cy="6" r="3" fill="#38bdf8" />
              </svg>

              {/* 3D Geometric N */}
              <div className="relative z-10 w-full h-full p-1 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path d="M 22 22 L 36 14 L 36 86 L 22 78 Z" fill="#06b6d4" />
                  <path d="M 32 17 L 78 75 L 66 85 L 20 27 Z" fill="#38bdf8" />
                  <path d="M 64 14 L 78 22 L 78 86 L 64 78 Z" fill="#2563eb" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="font-extrabold text-lg tracking-[0.16em] text-white flex items-center">
                <span>NEX</span>
                <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">O</span>
                <span>RA</span>
              </div>
              <span className="text-[7.5px] sm:text-[8px] font-bold tracking-[0.2em] text-cyan-400 uppercase -mt-0.5 block">
                TRADE · GROW · TOGETHER
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setCurrentPage('markets')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'markets'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Markets
            </button>

            <button
              onClick={() => setCurrentPage('spot')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'spot'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Spot
            </button>

            <button
              onClick={() => setCurrentPage('futures')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'futures'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Futures
            </button>

            <button
              onClick={() => setCurrentPage('security')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'security'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Security
            </button>

            {isLoggedIn && (
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPage === 'dashboard'
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>
        </div>

        {/* Right: Search, Language, Theme Toggle, Authentication / Profile Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Coins bar */}
          <div className="relative hidden xl:block" ref={searchRef}>
            <div
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-[#0B1120] hover:bg-slate-800/70 border border-slate-800 rounded-lg px-3 py-1.5 cursor-pointer text-xs text-slate-400 transition-colors w-48"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search market pairs..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
              />
            </div>

            {searchOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-72 rounded-xl bg-[#0B1120] border border-slate-800 shadow-2xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
                  <span>Cryptocurrency</span>
                  <span>Price / 24h</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map(coin => (
                      <button
                        key={coin.symbol}
                        onClick={() => handleSelectCoin(coin.symbol)}
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{coin.symbol}</span>
                          <span className="text-[11px] text-slate-400">{coin.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-white tabular-nums">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          <div
                            className={`text-[10px] font-semibold tabular-nums ${
                              coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {coin.change24h >= 0 ? '+' : ''}
                            {coin.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-xs text-slate-500">
                      No matching pairs found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#0B1120] text-xs font-medium text-slate-300 hover:text-white transition-colors"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">{currentLangObj.short}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-40 rounded-xl bg-[#0B1120] border border-slate-800 shadow-2xl py-1 z-50">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <span className={language === lang.code ? 'text-cyan-400 font-bold' : 'text-slate-300'}>
                      {lang.label}
                    </span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#0B1120] text-slate-400 hover:text-slate-100 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* User state */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setCurrentPage('deposit')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all whitespace-nowrap"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-slate-950" />
                <span>Deposit</span>
              </button>

              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-800 bg-[#0B1120] hover:border-slate-700 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-tight">
                      {user?.displayName}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">
                      UID: {user?.uid}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-60 rounded-xl bg-[#0B1120] border border-slate-800 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800/60">
                      <div className="text-xs font-bold text-white">{user?.displayName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                      <div className="flex items-center justify-between text-[11px] mt-1.5">
                        <span className="text-slate-400">Sample Balance:</span>
                        <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                          ${totalBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentPage('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 flex items-center gap-2.5"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Asset Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('security');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 flex items-center gap-2.5"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Security Center</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 flex items-center gap-2.5"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('history');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 flex items-center gap-2.5"
                      >
                        <History className="w-3.5 h-3.5 text-purple-400" />
                        <span>Transaction Ledger</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800/60 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-rose-400 hover:bg-rose-950/20 flex items-center gap-2.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-4 py-1.5 text-xs font-bold rounded-full border border-slate-700/80 hover:border-cyan-500/80 bg-[#070B14] hover:bg-slate-800 text-white transition-all whitespace-nowrap cursor-pointer shadow-sm"
              >
                Portal
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 border border-slate-800"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
