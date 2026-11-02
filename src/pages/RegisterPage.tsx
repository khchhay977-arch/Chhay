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
  CheckCircle2,
  Tag,
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

export const RegisterPage: React.FC = () => {
  const { register, setCurrentPage } = useExchange();

  const [registerMode, setRegisterMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralId, setReferralId] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Password Strength Calculations
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaList = [
    { label: '8+ Characters', met: hasMinLength },
    { label: 'Uppercase Letter', met: hasUpperCase },
    { label: 'Lowercase Letter', met: hasLowerCase },
    { label: 'Number (0-9)', met: hasNumber },
    { label: 'Special Symbol', met: hasSpecial },
  ];

  const passedCriteriaCount = criteriaList.filter(c => c.met).length;

  let strengthLabel = 'Too Weak';
  let strengthColor = 'bg-rose-500 text-rose-400';
  let strengthPercent = 20;

  if (passedCriteriaCount >= 5) {
    strengthLabel = 'Institutional Grade';
    strengthColor = 'bg-cyan-400 text-cyan-300';
    strengthPercent = 100;
  } else if (passedCriteriaCount >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-400 text-emerald-400';
    strengthPercent = 80;
  } else if (passedCriteriaCount >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-400 text-amber-400';
    strengthPercent = 55;
  } else if (passedCriteriaCount >= 1) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-rose-500 text-rose-400';
    strengthPercent = 30;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let identifier = '';
    if (registerMode === 'email') {
      const emailTrimmed = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      identifier = emailTrimmed;
    } else {
      const phoneTrimmed = phoneNumber.trim();
      if (!phoneTrimmed || phoneTrimmed.length < 6) {
        setErrorMessage('Please enter a valid mobile phone number.');
        return;
      }
      identifier = `${countryCode} ${phoneTrimmed}`;
    }

    if (!hasMinLength) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please review and agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      register(identifier, referralId.trim() || undefined);
      setCurrentPage('dashboard');
    }, 600);
  };

  return (
    <TerminalBackground>
      <div className="w-full max-w-lg">
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

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              CREATE TRADING ACCOUNT
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Open your institutional digital asset account with tier-1 security.
            </p>
          </div>

          {/* Email / Mobile Phone Selector Tabs */}
          <div className="relative mb-5 p-1 bg-[#03060E] rounded-xl border border-slate-800 flex items-center">
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-blue-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              style={{
                left: registerMode === 'email' ? '4px' : '50%',
                right: registerMode === 'email' ? '50%' : '4px',
              }}
            />

            <button
              type="button"
              onClick={() => {
                setRegisterMode('email');
                setErrorMessage('');
              }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                registerMode === 'email' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Registration</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegisterMode('phone');
                setErrorMessage('');
              }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                registerMode === 'phone' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
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
            {/* Dynamic Identifier Input */}
            <AnimatePresence mode="wait">
              {registerMode === 'email' ? (
                <motion.div
                  key="reg-email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="trader@company.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                    />
                    <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reg-phone"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
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

                    <div className="relative flex-1 group">
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="Mobile number"
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

            {/* Create Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Animated Password Strength Indicator */}
            <AnimatePresence>
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-3 bg-[#03060E] border border-slate-800/80 rounded-xl space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Password Security:</span>
                    <span className={`font-mono text-[11px] font-bold ${strengthColor.split(' ')[1]}`}>
                      {strengthLabel}
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strengthPercent}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`h-full rounded-full shadow-[0_0_8px_currentColor] ${strengthColor.split(' ')[0]}`}
                    />
                  </div>

                  {/* Checklist criteria */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                    {criteriaList.map((crit, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 transition-colors ${
                          crit.met ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>{crit.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
              />
            </div>

            {/* Optional Referral Code Toggle */}
            <div>
              {!showReferralInput ? (
                <button
                  type="button"
                  onClick={() => setShowReferralInput(true)}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Have a Referral Code? (Optional)</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Referral / Invitation Code (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. NEXO-PRO"
                      value={referralId}
                      onChange={e => setReferralId(e.target.value)}
                      className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
                    />
                    <Tag className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Terms and Privacy Consent */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 select-none group">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => {
                    setAgreedTerms(e.target.checked);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0 bg-[#03060E] cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  I confirm I am of legal age and agree to the{' '}
                  <span className="text-cyan-400 hover:underline">User Agreement</span> and{' '}
                  <span className="text-cyan-400 hover:underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Large REGISTER NOW Button with Subtle Cyan Glow */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Here link */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors"
            >
              Login Here →
            </button>
          </div>
        </motion.div>
      </div>
    </TerminalBackground>
  );
};
