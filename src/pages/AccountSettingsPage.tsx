/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Settings,
  User,
  ShieldCheck,
  CheckCircle,
  Globe,
  Smartphone,
  Laptop,
  LogOut,
  Save,
  Award,
} from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
  const { user, updateSecuritySettings, showToast } = useExchange();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Institutional Prime');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [orderConfirmations, setOrderConfirmations] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecuritySettings({ displayName });
    showToast('Profile preferences updated.', 'success');
  };

  const handleTerminateSessions = () => {
    showToast('All 2 other remote device sessions terminated.', 'info');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>Account Settings & Identity</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, verification limits, and exchange preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profile & KYC Status */}
        <div className="lg:col-span-6 space-y-6">
          {/* User Profile Card */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>User Identity Overview</span>
            </h3>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-white">{displayName}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
                    UID: {user?.uid}
                  </span>
                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-semibold">
                    Standard Account
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Display Alias
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Registered Institutional Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* KYC Tier Status */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Identity Verification (KYC)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0B1120] border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Tier 1: Basic Verification</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Government ID & Face Scan verified</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1120] border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Tier 2: Advanced Institutional</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Proof of Address & Corporate LEI verified</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-300">Tier 3: Unlimited Prime Broker</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Custody sub-accounts & API co-location</div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Application submitted for Tier 3 Institutional review.', 'success')}
                  className="px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preferences & Active Device Sessions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Trading & Interface Preferences */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Regional & Interface Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Base Display Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="JPY">JPY (¥ - Japanese Yen)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={orderConfirmations}
                  onChange={e => setOrderConfirmations(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900"
                />
                <span>Enable double-confirmation popups for orders &gt; $50,000 USD</span>
              </label>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>Active Device Sessions</span>
              </h3>
              <button
                type="button"
                onClick={handleTerminateSessions}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Terminate Other Sessions
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#0B1120] border border-cyan-800/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>MacBook Pro (Chrome 130)</span>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded">
                        Current Session
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">IP: 198.51.100.42 · New York, US</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-bold text-slate-200">iPhone 16 Pro (NEXORA App)</div>
                    <div className="text-[11px] text-slate-400 font-mono">IP: 203.0.113.19 · London, UK</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">Active 2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
