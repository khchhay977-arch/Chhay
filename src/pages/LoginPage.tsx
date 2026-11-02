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
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

const COUNTRY_CALLING_CODES = [
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+855', country: 'Cambodia', flag: '🇰🇭' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
];

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useExchange();

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [emailOrUid, setEmailOrUid] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let identifier = '';
    if (authMode === 'email') {
      const trimmed = emailOrUid.trim();
      if (!trimmed) {
        setErrorMessage('Please enter your email address or Account UID.');
        return;
      }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      const isUid = /^\d{6,12}$/.test(trimmed);
      if (!isEmail && !isUid) {
        setErrorMessage('Please enter a valid email address or 6-12 digit Account UID.');
        return;
      }
      identifier = trimmed;
    } else {
      const trimmedPhone = phoneNumber.trim();
      if (!trimmedPhone || trimmedPhone.length < 6) {
        setErrorMessage('Please enter a valid mobile telephone number.');
        return;
      }
      identifier = `${countryCode} ${trimmedPhone}`;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      login(identifier);
      setCurrentPage('dashboard');
    }, 600);
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

        {/* Glass Card Container with Smooth Slide-in */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-slate-800/80 bg-[#070B14]/85 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(2,6,23,0.8)] overflow-hidden"
        >
          {/* Top Edge Neon Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          {/* Subtitle / Terminal Welcome */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-black uppercase tracking-wider text-white">
              Institutional Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Secure authentication for spot, futures, and digital custody desks.
            </p>
          </div>

          {/* Smooth Phone / Email Selector Tabs */}
          <div className="relative mb-5 p-1 bg-[#03060E] rounded-xl border border-slate-800 flex items-center">
            {/* Animated Tab Indicator */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-blue-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              style={{
                left: authMode === 'email' ? '4px' : '50%',
                right: authMode === 'email' ? '50%' : '4px',
              }}
            />

            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setErrorMessage('');
              }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                authMode === 'email' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email / UID</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setErrorMessage('');
              }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                authMode === 'phone' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
          </div>

          {/* Validation Error Banner */}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dynamic Input depending on Auth Mode */}
            <AnimatePresence mode="wait">
              {authMode === 'email' ? (
                <motion.div
                  key="email-field"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address or Account UID
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      autoComplete="username"
                      placeholder="trader@domain.com or 8-digit UID"
                      value={emailOrUid}
                      onChange={e => {
                        setEmailOrUid(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                    />
                    <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="phone-field"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Calling Code Selector */}
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="h-full bg-[#03060E] border border-slate-800 rounded-xl pl-3 pr-7 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all appearance-none cursor-pointer"
                      >
                        {COUNTRY_CALLING_CODES.map(c => (
                          <option key={c.code} value={c.code} className="bg-[#070B14] text-white">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Phone Input */}
                    <div className="relative flex-1 group">
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. 555-0199"
                        value={phoneNumber}
                        onChange={e => {
                          setPhoneNumber(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                      />
                      <Phone className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field with Show/Hide Animation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentPage('forgot-password')}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter security password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showPassword ? 'hide' : 'show'}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-[#03060E] cursor-pointer"
                />
                <span className="text-[11px] group-hover:text-white transition-colors">
                  Remember Me on this device
                </span>
              </label>

              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Secure Login Button with Subtle Neon Glow & Press Feedback */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 overflow-hidden"
            >
              {/* Subtle ambient light sweep across button */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Secure Login</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </motion.button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Don&apos;t have a NEXORA account?{' '}
            <button
              onClick={() => setCurrentPage('register')}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors"
            >
              Register Now →
            </button>
          </div>
        </motion.div>
      </div>
    </TerminalBackground>
  );
};
