/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExchange } from '../context/ExchangeContext';
import { AnimatedLogo } from '../components/common/AnimatedLogo';
import { TerminalBackground } from '../components/auth/TerminalBackground';
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setCurrentPage, showToast } = useExchange();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Account identification
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your account email address or UID.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      showToast(`One-time security code sent to ${trimmed}`, 'info');
    }, 450);
  };

  // Step 2: OTP Entry
  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);
    if (errorMessage) setErrorMessage('');

    if (val && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the authentication code.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 450);
  };

  // Step 3: New Password
  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Password credentials updated successfully. Please sign in.', 'success');
      setCurrentPage('login');
    }, 550);
  };

  return (
    <TerminalBackground>
      <div className="w-full max-w-md">
        {/* Animated NEXORA Logo Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex justify-center"
        >
          <AnimatedLogo size="lg" showWordmark={true} />
        </motion.div>

        {/* Glass Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-slate-800/80 bg-[#070B14]/85 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(2,6,23,0.8)] overflow-hidden"
        >
          {/* Top Edge Neon Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          {/* Glowing Key Icon Emblem */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md pointer-events-none"
              />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-950 via-[#0B1120] to-slate-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
                <KeyRound className="w-6 h-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-black uppercase tracking-wider text-white">
              Password Recovery Terminal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verify your authorized identity to re-establish account access.
            </p>
          </div>

          {/* Smooth Three-Step Progress Indicator */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
              <span className={step >= 1 ? 'text-cyan-400' : 'text-slate-600'}>
                1. Identify
              </span>
              <span className={step >= 2 ? 'text-cyan-400' : 'text-slate-600'}>
                2. Verify
              </span>
              <span className={step >= 3 ? 'text-cyan-400' : 'text-slate-600'}>
                3. New Key
              </span>
            </div>

            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden flex gap-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '33.3%' }}
                className={`h-full rounded-full transition-colors duration-300 ${
                  step >= 1 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-800'
                }`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '33.3%' }}
                className={`h-full rounded-full transition-colors duration-300 ${
                  step >= 2 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-800'
                }`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '33.3%' }}
                className={`h-full rounded-full transition-colors duration-300 ${
                  step >= 3 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Identify Account */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleStep1}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Email or UID
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      autoComplete="username"
                      placeholder="Enter registered email or Account UID"
                      value={identifier}
                      onChange={e => {
                        setIdentifier(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                    />
                    <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Recovery Code</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Step 2: Verify Code */}
            {step === 2 && (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleStep2}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      6-Digit Security Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Change Account
                    </button>
                  </div>

                  {/* Digit inputs */}
                  <div className="grid grid-cols-6 gap-2">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-input-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpInput(i, e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !digit && i > 0) {
                            document.getElementById(`otp-input-${i - 1}`)?.focus();
                          }
                        }}
                        className="w-full h-11 bg-[#03060E] border border-slate-800 rounded-xl text-center text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    Check your inbox or mobile device for code sent to {identifier}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Validate Code</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Create New Password */}
            {step === 3 && (
              <motion.form
                key="step-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleStep3}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    New Security Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={e => {
                        setNewPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Update Credentials</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Return to Login link */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Remember your credentials?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors"
            >
              Back to Login →
            </button>
          </div>
        </motion.div>
      </div>
    </TerminalBackground>
  );
};
