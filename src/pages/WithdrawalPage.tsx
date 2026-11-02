/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  ArrowUpRight,
  Shield,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const WithdrawalPage: React.FC = () => {
  const { balances, requestWithdrawal, transactions, showToast } = useExchange();

  const [selectedAsset, setSelectedAsset] = useState<string>('USDT');
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('TRC-20');
  const [amount, setAmount] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const currentBalance = balances.find(b => b.symbol === selectedAsset)?.available || 0;
  const numAmount = parseFloat(amount) || 0;
  const fee = selectedAsset === 'USDT' ? 1.0 : selectedAsset === 'BTC' ? 0.0002 : 0.005;
  const receiveAmount = Math.max(0, numAmount - fee);

  const handleMax = () => {
    setAmount(currentBalance.toString());
  };

  const handleStartWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= fee) {
      showToast('Amount must exceed network gas fee.', 'error');
      return;
    }
    if (numAmount > currentBalance) {
      showToast('Insufficient available balance.', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Please specify destination address.', 'error');
      return;
    }
    setConfirmModal(true);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = requestWithdrawal(selectedAsset, numAmount, address, network);
    if (success) {
      setConfirmModal(false);
      setAmount('');
      setAddress('');
      setTwoFactorCode('');
    }
  };

  const recentWithdrawals = transactions.filter(t => t.type === 'withdrawal');

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* Sample Environment Notice */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-slate-300 text-xs flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>
          <strong className="text-white">Sample Environment Notice:</strong> Withdrawals are processed in simulated preview mode. No live blockchain transactions or real asset disbursements occur.
        </span>
      </div>

      {/* 1. Header & Quota */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-cyan-400" />
            <span>Withdrawal Portal (Sample)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate address verification and withdrawal order dispatch.
          </p>
        </div>

        {/* 24h Quota Badge */}
        <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-xl text-xs">
          <div className="text-slate-400 text-[10px]">24h Sample Limit</div>
          <div className="text-white font-mono font-bold tabular-nums">
            $850,000 / $1,000,000 USD
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Withdrawal Form */}
        <div className="lg:col-span-7 bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleStartWithdraw} className="space-y-4">
            {/* Asset Selector */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-2 font-bold text-slate-300 uppercase">
                <span>Select Asset</span>
                <span className="text-cyan-400 font-mono normal-case">
                  Available: {currentBalance.toLocaleString()} {selectedAsset}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['USDT', 'BTC', 'ETH', 'SOL', 'XRP'].map(symbol => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => setSelectedAsset(symbol)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedAsset === symbol
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-[#0B1120] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">{symbol}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Address Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Destination Recipient Address
              </label>
              <input
                type="text"
                required
                placeholder={`Enter valid ${selectedAsset} address`}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Network Protocol
              </label>
              <select
                value={network}
                onChange={e => setNetwork(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="TRC-20">TRC-20 (Tron) — Fast & Lowest Fee</option>
                <option value="ERC-20">ERC-20 (Ethereum Mainnet)</option>
                <option value="BEP-20">BEP-20 (BNB Smart Chain)</option>
                <option value="Solana">Solana Native</option>
                <option value="Arbitrum">Arbitrum One</option>
              </select>
            </div>

            {/* Amount input with Max button */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-1.5 font-bold text-slate-300 uppercase">
                <span>Withdrawal Amount</span>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-cyan-400 font-semibold hover:underline normal-case"
                >
                  Use Maximum
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">{selectedAsset}</span>
              </div>
            </div>

            {/* Fee & Net Receive Calculation */}
            <div className="p-4 bg-[#0B1120] border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Network Execution Fee:</span>
                <span className="font-mono text-white tabular-nums">
                  {fee} {selectedAsset}
                </span>
              </div>
              <div className="flex justify-between text-slate-300 font-bold pt-2 border-t border-slate-800">
                <span>You will receive:</span>
                <span className="font-mono text-emerald-400 text-sm tabular-nums">
                  {receiveAmount.toFixed(4)} {selectedAsset}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Review & Confirm Withdrawal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Security & Policy Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Withdrawal Security Policy</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              For your fund safety, any password reset or email update triggers an automatic 24-hour withdrawal freeze. Large volume withdrawals ($100k+) undergo dual key-holder authorization.
            </p>
          </div>

          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Processing Latency</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              99.2% of automated withdrawals are broadcast to the network within 90 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Recent Withdrawals Table */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Recent Withdrawals</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">TX ID</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums">
              {recentWithdrawals.map(w => (
                <tr key={w.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-cyan-400 text-[11px]">{w.id}</td>
                  <td className="py-3 px-4 font-bold text-white font-sans">{w.asset}</td>
                  <td className="py-3 px-4 text-rose-400 font-bold">-{w.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{w.network || 'TRC-20'}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 text-[11px]">{w.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Security 2FA Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1120] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Security Verification</h3>
            </div>

            <div className="p-3 bg-[#070B14] border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Amount:</span>
                <span className="text-white font-mono font-bold">{numAmount} {selectedAsset}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Network:</span>
                <span className="text-cyan-400">{network}</span>
              </div>
              <div className="text-[10px] text-slate-500 break-all">
                Destination: {address}
              </div>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Google Authenticator 2FA Code (6 Digits)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 582914"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  className="w-full bg-[#070B14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
