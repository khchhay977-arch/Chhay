/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { TransactionRecord } from '../types/exchange';
import {
  History,
  Download,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Gift,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const { transactions, showToast } = useExchange();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchType = typeFilter === 'all' || t.type.includes(typeFilter);
    const matchAsset = assetFilter === 'all' || t.asset === assetFilter;
    return matchType && matchAsset;
  });

  const handleExportCsv = () => {
    showToast('Exporting complete transaction ledger to CSV...', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* 1. Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Transaction History & Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of deposits, withdrawals, spot orders, and futures realized PnL.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1120] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#070B14] p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'withdrawal', label: 'Withdrawals' },
            { id: 'spot', label: 'Spot Trades' },
            { id: 'futures', label: 'Futures PnL' },
            { id: 'referral', label: 'Referral Bonuses' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                typeFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={assetFilter}
            onChange={e => setAssetFilter(e.target.value)}
            className="bg-[#0B1120] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="all">All Currencies</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
      </div>

      {/* 3. Transaction Table */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1120] border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">TX ID</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Valuation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Fee</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums">
              {filteredTransactions.map(tx => {
                const isPositive =
                  tx.type === 'deposit' || tx.type === 'spot_buy' || tx.type === 'referral_bonus' || (tx.type === 'futures_pnl' && tx.amount >= 0);

                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-cyan-400 font-bold group-hover:underline">
                      {tx.id}
                    </td>

                    <td className="py-3.5 px-4 font-sans font-semibold">
                      <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white font-sans">{tx.asset}</td>

                    <td className="py-3.5 px-4 font-bold">
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        {isPositive ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell text-slate-300">
                      ${tx.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          tx.status === 'completed'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/40'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-400">
                      {tx.fee ? `$${tx.fee.toFixed(2)}` : '0.00'}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px] font-sans">
                      {tx.timestamp}
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                    No transactions found matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1120] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Transaction Details</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Operation Type:</span>
                <span className="capitalize font-semibold text-white">{selectedTx.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Amount & Asset:</span>
                <span className="font-mono font-bold text-white">
                  {selectedTx.amount} {selectedTx.asset} (${selectedTx.usdValue.toLocaleString()})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-300">{selectedTx.timestamp}</span>
              </div>
              {selectedTx.network && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Network:</span>
                  <span className="font-mono text-slate-300">{selectedTx.network}</span>
                </div>
              )}
              {selectedTx.address && (
                <div className="py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 block mb-1">Destination / Source Address:</span>
                  <span className="font-mono text-cyan-300 break-all text-[11px] select-all bg-[#070B14] p-1.5 rounded block">
                    {selectedTx.address}
                  </span>
                </div>
              )}
              {selectedTx.txHash && (
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">On-Chain Transaction Hash:</span>
                  <span className="font-mono text-slate-300 break-all text-[11px] select-all bg-[#070B14] p-1.5 rounded block">
                    {selectedTx.txHash}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
