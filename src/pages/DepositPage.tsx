/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  ArrowDownLeft,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { assets, simulateDeposit, transactions, showToast } = useExchange();

  const [selectedAsset, setSelectedAsset] = useState<string>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('TRC-20');
  const [copied, setCopied] = useState(false);
  const [testAmount, setTestAmount] = useState<string>('2500');

  const networksForAsset: Record<string, string[]> = {
    USDT: ['TRC-20 (Tron)', 'ERC-20 (Ethereum)', 'BEP-20 (BNB Smart Chain)', 'Solana', 'Polygon', 'Arbitrum One'],
    BTC: ['Bitcoin Native (SegWit)', 'Lightning Network', 'BNB Smart Chain'],
    ETH: ['ERC-20 (Ethereum Mainnet)', 'Arbitrum One', 'Optimism', 'Base'],
    SOL: ['Solana Native'],
    XRP: ['Ripple XRP Ledger'],
  };

  const depositAddresses: Record<string, string> = {
    USDT: 'NX-SIM-USDT-TRC20-SAMPLE-ADDR-491029',
    BTC: 'bc1q-sim-btc-native-sample-addr-894102',
    ETH: '0xSIM-ETH-ERC20-SAMPLE-ADDR-2026-NEXORA',
    SOL: 'SOL-SIM-NATIVE-SAMPLE-ADDR-771829',
    XRP: 'rSIM-XRP-LEDGER-SAMPLE-ADDR-881920',
  };

  const currentAddress = depositAddresses[selectedAsset] || 'NX-SIM-SAMPLE-ADDRESS-DO-NOT-SEND-FUNDS';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    showToast('Sample address copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(testAmount) || 100;
    simulateDeposit(selectedAsset, amt, selectedNetwork);
  };

  const recentDeposits = transactions.filter(t => t.type === 'deposit');

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* Testnet & Sample Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-200">Simulation Environment (Testnet Mode):</strong> Do not send real digital assets from an external wallet or live exchange. All deposit addresses and balances displayed here are sample simulation templates for frontend testing.
        </div>
      </div>

      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ArrowDownLeft className="w-6 h-6 text-cyan-400" />
          <span>Deposit (Sample Simulation)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate cryptocurrency funding for testing order placement and margin calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Select Coin, Network & Address */}
        <div className="lg:col-span-7 bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {/* Asset Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Select Cryptocurrency
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {['USDT', 'BTC', 'ETH', 'SOL', 'XRP'].map(symbol => (
                <button
                  key={symbol}
                  onClick={() => {
                    setSelectedAsset(symbol);
                    const nets = networksForAsset[symbol] || ['Native'];
                    setSelectedNetwork(nets[0]);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedAsset === symbol
                      ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-[#0B1120] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{symbol}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {symbol === 'USDT' ? 'Tether' : symbol}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Network Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Deposit Network
            </label>
            <div className="space-y-1.5">
              {(networksForAsset[selectedAsset] || ['Native Network']).map(net => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork(net)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors ${
                    selectedNetwork === net
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                      : 'bg-[#0B1120] border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="font-semibold">{net}</span>
                  <span className="text-[11px] text-slate-500">
                    {net.includes('TRC') ? '≈ 1 Min (12 conf)' : '≈ 3 Mins (32 conf)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generated Address & QR */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              3. Deposit Address & QR Code
            </label>

            <div className="p-4 bg-[#0B1120] border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-5">
              {/* QR Code graphic */}
              <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                  <rect x="40" y="10" width="10" height="20" fill="currentColor" />
                  <rect x="55" y="5" width="10" height="10" fill="currentColor" />
                  <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                  <rect x="70" y="45" width="15" height="10" fill="currentColor" />
                  <rect x="45" y="75" width="20" height="15" fill="currentColor" />
                  <rect x="75" y="75" width="15" height="15" fill="currentColor" />
                </svg>
              </div>

              {/* Address string & Copy */}
              <div className="flex-1 w-full space-y-2">
                <div className="text-[11px] text-slate-400">
                  Send only <strong className="text-white">{selectedAsset}</strong> via{' '}
                  <strong className="text-cyan-400">{selectedNetwork}</strong> to this address:
                </div>
                <div className="p-2.5 bg-[#070B14] border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 break-all select-all">
                  {currentAddress}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Important Security Notice */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300/90 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Notice:</strong> Minimum deposit is 10 {selectedAsset}. Sending any unsupported asset or using an mismatched network will result in irreversible deposit loss.
            </div>
          </div>
        </div>

        {/* Right: Simulation & Instructions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulated Test Deposit Card */}
          <div className="bg-[#070B14] border border-cyan-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Reviewer Test Deposit Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Test adding funds into your NEXORA balance right away without real blockchain gas fees.
            </p>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Simulation Amount ({selectedAsset})
                </label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={e => setTestAmount(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4 text-slate-950" />
                <span>Simulate Instant Deposit ({testAmount} {selectedAsset})</span>
              </button>
            </form>
          </div>

          {/* Cold Custody Security FAQ */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Custody Guarantee</span>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All deposits are automatically routed to hardware air-gapped cold storage vaults protected by threshold signature schemes (TSS).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Recent Deposit Records */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Recent Deposits</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums">
              {recentDeposits.map(dep => (
                <tr key={dep.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-cyan-400 text-[11px]">{dep.id}</td>
                  <td className="py-3 px-4 font-bold text-white font-sans">{dep.asset}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">+{dep.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{dep.network || 'TRC-20'}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      {dep.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 text-[11px]">{dep.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
