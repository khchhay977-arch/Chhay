/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Shield,
  Smartphone,
  Key,
  Lock,
  Bell,
  Laptop,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SecuritySettingsPage: React.FC = () => {
  const { user, updateSecuritySettings, showToast } = useExchange();

  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [passkeys, setPasskeys] = useState([
    { id: 'pk_1', name: 'MacBook Touch ID', date: '2026-10-15', status: 'Active' },
  ]);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [whitelistEnabled, setWhitelistEnabled] = useState<boolean>(user?.whitelistEnabled ?? true);
  const [withdrawalDualAuth, setWithdrawalDualAuth] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    showToast('Account password updated successfully.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleRegisterPasskey = () => {
    const id = 'pk_' + Math.random().toString(36).substring(2, 6);
    setPasskeys(prev => [...prev, { id, name: 'FIDO2 Hardware Key', date: 'Just now', status: 'Active' }]);
    showToast('FIDO2 / WebAuthn passkey registered successfully.', 'success');
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) {
      showToast('Please enter the full 6-digit authenticator code.', 'error');
      return;
    }
    updateSecuritySettings({ twoFactorEnabled: true });
    setTwoFactorModalOpen(false);
    setTwoFactorCode('');
    showToast('Two-Factor Authentication (2FA) verified and active.', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>NEXORA Security Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account authentication methods, trusted devices, and withdrawal confirmation rules.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="p-1 px-2.5 rounded-lg bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Account Status: Protected</span>
          </span>
        </div>
      </div>

      {/* 2. Grid of Core Security Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): 2FA, Passkey, Withdrawal Settings, Password Management */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Two-Factor Authentication (2FA) */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 mt-0.5">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                      ENABLED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Time-based One-Time Password (TOTP) via Google Authenticator, Authy, or compatible authenticator applications. Required for high-value actions and withdrawals.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0B1120] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors shrink-0"
              >
                Configure
              </button>
            </div>
          </div>

          {/* Section 2: Passkey Support (FIDO2 / WebAuthn) */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400 mt-0.5">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Passkey Support (FIDO2 / WebAuthn)</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Use biometric verification (Touch ID, Face ID, Windows Hello) or a hardware security key (YubiKey) for seamless and phishing-resistant sign-in.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegisterPasskey}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                + Add Passkey
              </button>
            </div>

            {/* Configured passkeys list */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              {passkeys.map(pk => (
                <div
                  key={pk.id}
                  className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-white font-semibold">{pk.name}</span>
                      <span className="text-[10px] text-slate-500 ml-2">Added: {pk.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">Verified</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Withdrawal Confirmation Settings */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Withdrawal Confirmation Settings</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enforce strict verification safeguards before any digital asset can be transferred out of your NEXORA account.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1120] border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Withdrawal Address Whitelist</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Only allow withdrawals to pre-approved addresses saved in your address book.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !whitelistEnabled;
                    setWhitelistEnabled(next);
                    updateSecuritySettings({ whitelistEnabled: next });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    whitelistEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                      whitelistEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1120] border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Dual-Channel Authorization</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Require both Email confirmation link AND Authenticator code for all withdrawals.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawalDualAuth(!withdrawalDualAuth);
                    showToast(`Dual-channel authorization ${!withdrawalDualAuth ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    withdrawalDualAuth ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                      withdrawalDualAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Password Management */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Password Management</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your master account password regularly to maintain account integrity.
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    New Password (min 8 chars)
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{showPassword ? 'Hide passwords' : 'Show passwords'}</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Login Alerts, Trusted Devices, Login History, Account Recovery Roadmap */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 5: Login Alerts */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">Login Alerts</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Automated email dispatch for logins from unrecognized IP addresses, new browser agents, or geographic regions.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-300">Instant Email Notifications</span>
              <button
                type="button"
                onClick={() => {
                  setLoginAlerts(!loginAlerts);
                  showToast(`Login alerts ${!loginAlerts ? 'enabled' : 'disabled'}.`, 'info');
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  loginAlerts ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-slate-950 transition-transform ${
                    loginAlerts ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 6: Trusted Devices */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">Trusted Devices</h3>
              </div>
              <button
                onClick={() => showToast('Secondary device session revoked.', 'info')}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
              >
                Revoke Other
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0B1120] border border-cyan-800/30">
                <div className="flex items-center justify-between text-white font-semibold text-[11px]">
                  <span>MacBook Pro · Chrome 130</span>
                  <span className="text-[9px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded font-mono">Current</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">United States · Active now</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B1120] border border-slate-800">
                <div className="flex items-center justify-between text-slate-200 font-semibold text-[11px]">
                  <span>iPhone 16 Pro · Mobile App</span>
                  <span className="text-[9px] text-slate-500">2h ago</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">United Kingdom · Trusted</div>
              </div>
            </div>
          </div>

          {/* Section 7: Login History */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">Recent Login History</h3>
            </div>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-[#0B1120] border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-white">Web Portal (Passkey)</div>
                  <div className="text-[10px] text-slate-500">2026-11-02 07:15 UTC</div>
                </div>
                <span className="text-emerald-400 font-sans font-bold text-[10px]">SUCCESS</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0B1120] border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-white">Mobile Device (2FA)</div>
                  <div className="text-[10px] text-slate-500">2026-11-01 19:42 UTC</div>
                </div>
                <span className="text-emerald-400 font-sans font-bold text-[10px]">SUCCESS</span>
              </div>
            </div>
          </div>

          {/* Section 8: Account Recovery Options (Clearly Distinguished Roadmap / Coming Soon) */}
          <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white">Enterprise Custody Recovery</h3>
              </div>
              <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                In Development
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Decentralized multi-signature key guardians and institutional social recovery frameworks are currently being architected for enterprise accounts.
            </p>
            <div className="p-2.5 rounded-lg bg-[#0B1120] border border-slate-800/80 text-[10px] text-slate-500">
              Feature availability will be announced alongside official institutional custodial audits.
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {twoFactorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1120] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Configure 2FA Authenticator</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Scan this QR code with Google Authenticator, Authy, or 1Password, then enter the 6-digit confirmation code below.
            </p>

            <div className="flex justify-center p-4 bg-white rounded-xl w-36 h-36 mx-auto shadow-md">
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
              </svg>
            </div>

            <div className="p-3 bg-[#070B14] border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-slate-500 uppercase">Manual Setup Key</div>
              <div className="font-mono text-xs font-bold text-cyan-300 mt-1 select-all">
                NEXO-RA89-4102-94PR-IME
              </div>
            </div>

            <form onSubmit={handleConfirm2FA} className="space-y-3">
              <input
                type="text"
                required
                maxLength={6}
                value={twoFactorCode}
                onChange={e => setTwoFactorCode(e.target.value)}
                placeholder="Enter 6-Digit Authenticator Code"
                className="w-full bg-[#070B14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-cyan-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTwoFactorModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
