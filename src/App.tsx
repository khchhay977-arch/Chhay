/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExchangeProvider, useExchange } from './context/ExchangeContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SpotTradingPage } from './pages/SpotTradingPage';
import { FuturesTradingPage } from './pages/FuturesTradingPage';
import { MarketsPage } from './pages/MarketsPage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawalPage } from './pages/WithdrawalPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { SecuritySettingsPage } from './pages/SecuritySettingsPage';
import { ReferralPage } from './pages/ReferralPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AuthRequiredView } from './components/auth/AuthRequiredView';

const MainLayout: React.FC = () => {
  const { currentPage, isLoggedIn } = useExchange();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    // Unauthenticated access controls: protect private balance & funding pages
    if (!isLoggedIn) {
      switch (currentPage) {
        case 'dashboard':
          return <AuthRequiredView pageName="Portfolio Dashboard" />;
        case 'deposit':
          return <AuthRequiredView pageName="Deposit Wallet" />;
        case 'withdrawal':
          return <AuthRequiredView pageName="Withdrawal Desk" />;
        case 'history':
          return <AuthRequiredView pageName="Transaction Ledger" />;
        case 'settings':
          return <AuthRequiredView pageName="Account Settings" />;
        case 'referral':
          return <AuthRequiredView pageName="Affiliate Partner Portal" />;
        default:
          break;
      }
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'register':
        return <RegisterPage />;
      case 'login':
        return <LoginPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'spot':
        return <SpotTradingPage />;
      case 'futures':
        return <FuturesTradingPage />;
      case 'markets':
        return <MarketsPage />;
      case 'deposit':
        return <DepositPage />;
      case 'withdrawal':
        return <WithdrawalPage />;
      case 'history':
        return <TransactionHistoryPage />;
      case 'settings':
        return <AccountSettingsPage />;
      case 'security':
        return <SecuritySettingsPage />;
      case 'referral':
        return <ReferralPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Content Viewport with smooth page transition */}
      <main className="flex-1 pb-16 lg:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer (displayed on non-home pages) */}
      {currentPage !== 'home' && <Footer />}

      {/* Mobile Bottom Dock & Slide-Over Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ExchangeProvider>
      <MainLayout />
    </ExchangeProvider>
  );
}
