/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Users,
  Gift,
  Copy,
  Check,
  Award,
  DollarSign,
  TrendingUp,
  Share2,
  ExternalLink,
} from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { user, referrals, showToast } = useExchange();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = `NEXORA-${user?.uid || '89410294'}`;
  const referralLink = `https://nexora.io/join?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Referral invitation link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast('Referral code copied!', 'info');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const totalEarnedUsd = referrals.reduce((acc, r) => acc + r.commissionEarnedUsd, 0) + 1245.50;
  const totalVolumeUsd = referrals.reduce((acc, r) => acc + r.tradingVolumeUsd, 0) + 850000;

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* Sample Program Notice Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-slate-300 text-xs flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>
          <strong className="text-white">Partner Program (Sample Data):</strong> Statistics and referral rebates shown below are sample values for interface demonstration.
        </span>
      </div>

      {/* 1. Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#070B14] p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
            <Gift className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXORA Affiliate & Partner Program</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Client Referral Program
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Invite professional traders and partners to NEXORA. Earn competitive fee rebates on eligible spot and perpetual trading volume.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Commission Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
            ${totalEarnedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Paid out in USDT</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Referred Team Volume</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            ${(totalVolumeUsd / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-slate-500 mt-1">30-day trailing volume</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Traders</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 tabular-nums">
            {referrals.length + 18}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Across 6 countries</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Partner Rebate Tier</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            Tier 3 (35%)
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Next tier: Ambassador (40%)</div>
        </div>
      </div>

      {/* 3. Share Links & Tier Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Referral Links Card */}
        <div className="lg:col-span-7 bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Your Exclusive Invitation Links</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Referral Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralCode}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono font-bold select-all"
                />
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Direct Registration URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono select-all truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Copy URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Progression Gauge */}
        <div className="lg:col-span-5 bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Partner Commission Tier Ladder</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-400">Bronze (Standard)</div>
                <div className="text-[10px] text-slate-500">Trading Volume &lt; $500k</div>
              </div>
              <span className="font-mono font-bold text-slate-300">20% Rebate</span>
            </div>

            <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-300">Silver Partner</div>
                <div className="text-[10px] text-slate-500">Trading Volume &gt; $500k</div>
              </div>
              <span className="font-mono font-bold text-cyan-400">28% Rebate</span>
            </div>

            <div className="p-3 bg-cyan-950/50 border border-cyan-500/50 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Gold Partner</span>
                  <span className="text-[9px] bg-cyan-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                    CURRENT
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Trading Volume &gt; $1.5M</div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">35% Rebate</span>
            </div>

            <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-300">NEXORA Ambassador</div>
                <div className="text-[10px] text-slate-500">Trading Volume &gt; $5M</div>
              </div>
              <span className="font-mono font-bold text-amber-400">40% Rebate</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Friends & Commission History Table */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Referred Traders & Rebate Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User UID</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4">Trader Tier</th>
                <th className="py-3 px-4">30d Trading Volume</th>
                <th className="py-3 px-4">Your Commission</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums">
              {referrals.map(friend => (
                <tr key={friend.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-cyan-400 font-bold">{friend.userId}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{friend.registerDate}</td>
                  <td className="py-3 px-4 text-slate-200 font-sans font-semibold">{friend.tier}</td>
                  <td className="py-3 px-4 text-white">${friend.tradingVolumeUsd.toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    +${friend.commissionEarnedUsd.toFixed(2)} USDT
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      {friend.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
