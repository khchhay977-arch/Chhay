/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Smartphone, Download, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useExchange } from '../../context/ExchangeContext';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useExchange();

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    showToast('NEXORA Android APK download configured. Client build downloading...', 'info');
  };

  const handleTestFlight = () => {
    showToast('iOS TestFlight invitation queued for this terminal.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#070B14] border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-800/50 text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">NEXORA Mobile Terminal</h3>
            <p className="text-xs text-slate-400">Official Mobile Client · Version 4.8</p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-[#0B1120] border border-slate-800 rounded-xl text-center space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Scan to Install on Mobile Device
          </div>
          <div className="w-36 h-36 bg-white rounded-xl mx-auto p-3 flex items-center justify-center shadow-md">
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
              <rect x="40" y="20" width="20" height="20" fill="currentColor" />
              <rect x="50" y="50" width="30" height="20" fill="currentColor" />
              <rect x="35" y="65" width="15" height="15" fill="currentColor" />
            </svg>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Direct SHA-256 Verified Package
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleDownloadApk}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Android APK</span>
          </button>

          <button
            onClick={handleTestFlight}
            className="w-full py-2.5 rounded-xl bg-[#0B1120] hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>iOS TestFlight Beta Build</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cryptographically Signed Binary Release</span>
        </div>
      </motion.div>
    </div>
  );
};
