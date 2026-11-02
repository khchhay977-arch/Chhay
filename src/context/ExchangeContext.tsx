/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  PageId,
  CryptoAsset,
  UserBalance,
  SpotOrder,
  FuturesPosition,
  TransactionRecord,
  UserProfile,
  ReferralFriend,
} from '../types/exchange';
import {
  INITIAL_ASSETS,
  INITIAL_USER,
  INITIAL_BALANCES,
  INITIAL_SPOT_ORDERS,
  INITIAL_FUTURES_POSITIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_REFERRALS,
} from '../data/mockExchangeData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ExchangeContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  assets: CryptoAsset[];
  selectedAsset: CryptoAsset;
  user: UserProfile | null;
  isLoggedIn: boolean;
  balances: UserBalance[];
  totalBalanceUsd: number;
  totalBalanceBtc: number;
  spotOrders: SpotOrder[];
  futuresPositions: FuturesPosition[];
  transactions: TransactionRecord[];
  referrals: ReferralFriend[];
  toasts: ToastMessage[];
  language: string;
  setLanguage: (lang: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  login: (email: string) => void;
  logout: () => void;
  register: (email: string, referralCode?: string) => void;
  placeSpotOrder: (order: {
    pair: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    price: number;
    amount: number;
  }) => boolean;
  cancelSpotOrder: (orderId: string) => void;
  openFuturesPosition: (pos: {
    symbol: string;
    side: 'long' | 'short';
    leverage: number;
    marginMode: 'cross' | 'isolated';
    marginAmount: number;
  }) => boolean;
  closeFuturesPosition: (positionId: string) => void;
  simulateDeposit: (assetSymbol: string, amount: number, network: string) => void;
  requestWithdrawal: (assetSymbol: string, amount: number, address: string, network: string) => boolean;
  updateSecuritySettings: (settings: Partial<UserProfile>) => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const ExchangeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_ASSETS);
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [balances, setBalances] = useState<UserBalance[]>(INITIAL_BALANCES);
  const [spotOrders, setSpotOrders] = useState<SpotOrder[]>(INITIAL_SPOT_ORDERS);
  const [futuresPositions, setFuturesPositions] = useState<FuturesPosition[]>(INITIAL_FUTURES_POSITIONS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [referrals] = useState<ReferralFriend[]>(INITIAL_REFERRALS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<string>('en');

  // Keep dark class on html root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Subtle real-time market price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev =>
        prev.map(asset => {
          // 30% chance each second of a micro-tick
          if (Math.random() > 0.4) return asset;
          const deltaFactor = 1 + (Math.random() * 0.003 - 0.0014);
          const newPrice = Number((asset.price * deltaFactor).toFixed(asset.decimalPlaces));
          const newChange = Number((asset.change24h + (deltaFactor - 1) * 10).toFixed(2));
          const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            change24h: newChange,
            sparkline: updatedSparkline,
            high24h: Math.max(asset.high24h, newPrice),
            low24h: Math.min(asset.low24h, newPrice),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.symbol === selectedSymbol) || assets[0];
  }, [assets, selectedSymbol]);

  // Dynamic balance calculation based on current prices
  const { totalBalanceUsd, totalBalanceBtc } = useMemo(() => {
    let totalUsd = 0;
    balances.forEach(b => {
      if (b.symbol === 'USDT') {
        totalUsd += b.total;
      } else {
        const found = assets.find(a => a.symbol === b.symbol);
        const price = found ? found.price : 1;
        totalUsd += b.total * price;
      }
    });

    const btcAsset = assets.find(a => a.symbol === 'BTC');
    const btcPrice = btcAsset ? btcAsset.price : 68000;
    const totalBtc = totalUsd / btcPrice;

    return { totalBalanceUsd: totalUsd, totalBalanceBtc: totalBtc };
  }, [balances, assets]);

  const login = (email = 'trader@nexora.io') => {
    setIsLoggedIn(true);
    setUser({
      ...INITIAL_USER,
      email,
      displayName: email.split('@')[0],
    });
    showToast(`Welcome back, ${email.split('@')[0]}! Institutional session established.`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('You have been securely signed out.', 'info');
  };

  const register = (email: string, referralCode?: string) => {
    const newUser: UserProfile = {
      id: 'usr_nx_' + Math.floor(10000000 + Math.random() * 90000000),
      email,
      displayName: email.split('@')[0],
      uid: Math.floor(10000000 + Math.random() * 90000000).toString(),
      vipLevel: 1,
      kycTier: 1,
      twoFactorEnabled: false,
      antiPhishingCode: '',
      whitelistEnabled: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsLoggedIn(true);
    // Give trial welcome balance
    setBalances([
      { symbol: 'USDT', name: 'Tether USD', total: 10000, available: 10000, inOrders: 0, usdValue: 10000, iconColor: '#26A17B' },
      { symbol: 'BTC', name: 'Bitcoin', total: 0.15, available: 0.15, inOrders: 0, usdValue: 10264, iconColor: '#F7931A' },
      { symbol: 'ETH', name: 'Ethereum', total: 2.0, available: 2.0, inOrders: 0, usdValue: 6843, iconColor: '#627EEA' },
    ]);
    if (referralCode) {
      showToast(`Account registered with referral code "${referralCode}"! VIP Tier 1 fee discount applied.`, 'success');
    } else {
      showToast('Welcome to NEXORA! $10,000 USDT practice trading assets credited.', 'success');
    }
  };

  const placeSpotOrder = ({
    pair,
    side,
    type,
    price,
    amount,
  }: {
    pair: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    price: number;
    amount: number;
  }): boolean => {
    const [baseCoin, quoteCoin] = pair.split('/');
    const totalCost = price * amount;

    if (side === 'buy') {
      const usdtBalance = balances.find(b => b.symbol === quoteCoin);
      if (!usdtBalance || usdtBalance.available < totalCost) {
        showToast(`Insufficient ${quoteCoin} balance. Needed: ${totalCost.toFixed(2)}, Available: ${usdtBalance?.available.toFixed(2) || 0}`, 'error');
        return false;
      }
    } else {
      const coinBalance = balances.find(b => b.symbol === baseCoin);
      if (!coinBalance || coinBalance.available < amount) {
        showToast(`Insufficient ${baseCoin} balance. Available: ${coinBalance?.available.toFixed(4) || 0}`, 'error');
        return false;
      }
    }

    const newOrder: SpotOrder = {
      id: 'ord_sp_' + Math.floor(100000 + Math.random() * 900000),
      pair,
      side,
      type,
      price,
      amount,
      filled: type === 'market' ? amount : 0,
      total: totalCost,
      status: type === 'market' ? 'filled' : 'open',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setSpotOrders(prev => [newOrder, ...prev]);

    // Update balances
    if (type === 'market') {
      if (side === 'buy') {
        setBalances(prev =>
          prev.map(b => {
            if (b.symbol === quoteCoin) {
              return { ...b, available: b.available - totalCost, total: b.total - totalCost };
            }
            if (b.symbol === baseCoin) {
              return { ...b, available: b.available + amount, total: b.total + amount };
            }
            return b;
          })
        );
      } else {
        setBalances(prev =>
          prev.map(b => {
            if (b.symbol === baseCoin) {
              return { ...b, available: b.available - amount, total: b.total - amount };
            }
            if (b.symbol === quoteCoin) {
              return { ...b, available: b.available + totalCost, total: b.total + totalCost };
            }
            return b;
          })
        );
      }
      showToast(`Market ${side.toUpperCase()} order for ${amount} ${baseCoin} executed at $${price.toLocaleString()}!`, 'success');
    } else {
      // Limit order holds funds
      if (side === 'buy') {
        setBalances(prev =>
          prev.map(b =>
            b.symbol === quoteCoin
              ? { ...b, available: b.available - totalCost, inOrders: b.inOrders + totalCost }
              : b
          )
        );
      } else {
        setBalances(prev =>
          prev.map(b =>
            b.symbol === baseCoin
              ? { ...b, available: b.available - amount, inOrders: b.inOrders + amount }
              : b
          )
        );
      }
      showToast(`Limit ${side.toUpperCase()} order placed for ${amount} ${baseCoin} at $${price.toLocaleString()}.`, 'success');
    }

    // Add to transaction record
    setTransactions(prev => [
      {
        id: 'tx_' + Math.floor(100000 + Math.random() * 900000),
        type: side === 'buy' ? 'spot_buy' : 'spot_sell',
        asset: baseCoin,
        amount,
        usdValue: totalCost,
        status: 'completed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        fee: totalCost * 0.0004,
      },
      ...prev,
    ]);

    return true;
  };

  const cancelSpotOrder = (orderId: string) => {
    const order = spotOrders.find(o => o.id === orderId);
    if (!order || order.status !== 'open') return;

    const [baseCoin, quoteCoin] = order.pair.split('/');

    setSpotOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );

    // Release held balances
    if (order.side === 'buy') {
      setBalances(prev =>
        prev.map(b =>
          b.symbol === quoteCoin
            ? { ...b, available: b.available + order.total, inOrders: Math.max(0, b.inOrders - order.total) }
            : b
        )
      );
    } else {
      setBalances(prev =>
        prev.map(b =>
          b.symbol === baseCoin
            ? { ...b, available: b.available + order.amount, inOrders: Math.max(0, b.inOrders - order.amount) }
            : b
        )
      );
    }

    showToast(`Order #${orderId} cancelled successfully.`, 'info');
  };

  const openFuturesPosition = ({
    symbol,
    side,
    leverage,
    marginMode,
    marginAmount,
  }: {
    symbol: string;
    side: 'long' | 'short';
    leverage: number;
    marginMode: 'cross' | 'isolated';
    marginAmount: number;
  }): boolean => {
    const usdtBalance = balances.find(b => b.symbol === 'USDT');
    if (!usdtBalance || usdtBalance.available < marginAmount) {
      showToast(`Insufficient USDT margin. Available: $${usdtBalance?.available.toFixed(2) || 0}`, 'error');
      return false;
    }

    const asset = assets.find(a => symbol.startsWith(a.symbol)) || assets[0];
    const entryPrice = asset.price;
    const notionalValue = marginAmount * leverage;
    const positionSize = Number((notionalValue / entryPrice).toFixed(4));
    const liqPrice = side === 'long'
      ? entryPrice * (1 - 0.9 / leverage)
      : entryPrice * (1 + 0.9 / leverage);

    const newPos: FuturesPosition = {
      id: 'pos_fut_' + Math.floor(1000 + Math.random() * 9000),
      symbol: `${asset.symbol}/USDT Perp`,
      side,
      leverage,
      marginMode,
      size: positionSize,
      entryPrice,
      markPrice: entryPrice,
      liqPrice: Number(liqPrice.toFixed(2)),
      margin: marginAmount,
      pnl: 0,
      pnlPercentage: 0,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setFuturesPositions(prev => [newPos, ...prev]);

    // Deduct available margin
    setBalances(prev =>
      prev.map(b =>
        b.symbol === 'USDT'
          ? { ...b, available: b.available - marginAmount, inOrders: b.inOrders + marginAmount }
          : b
      )
    );

    showToast(`Opened ${leverage}x ${side.toUpperCase()} position on ${asset.symbol}/USDT Perp!`, 'success');
    return true;
  };

  const closeFuturesPosition = (positionId: string) => {
    const pos = futuresPositions.find(p => p.id === positionId);
    if (!pos) return;

    const returnAmount = pos.margin + pos.pnl;

    setFuturesPositions(prev => prev.filter(p => p.id !== positionId));

    setBalances(prev =>
      prev.map(b =>
        b.symbol === 'USDT'
          ? {
              ...b,
              available: b.available + returnAmount,
              inOrders: Math.max(0, b.inOrders - pos.margin),
              total: b.total + pos.pnl,
            }
          : b
      )
    );

    setTransactions(prev => [
      {
        id: 'tx_' + Math.floor(100000 + Math.random() * 900000),
        type: 'futures_pnl',
        asset: 'USDT',
        amount: pos.pnl,
        usdValue: pos.pnl,
        status: 'completed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        fee: 0.85,
      },
      ...prev,
    ]);

    showToast(`Position closed. Realized PnL: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)} USDT.`, 'success');
  };

  const simulateDeposit = (assetSymbol: string, amount: number, network: string) => {
    const existing = balances.find(b => b.symbol === assetSymbol);
    const assetObj = assets.find(a => a.symbol === assetSymbol);
    const unitPrice = assetObj ? assetObj.price : 1;
    const usdVal = amount * unitPrice;

    if (existing) {
      setBalances(prev =>
        prev.map(b =>
          b.symbol === assetSymbol
            ? { ...b, total: b.total + amount, available: b.available + amount, usdValue: (b.total + amount) * unitPrice }
            : b
        )
      );
    } else {
      setBalances(prev => [
        ...prev,
        {
          symbol: assetSymbol,
          name: assetObj?.name || assetSymbol,
          total: amount,
          available: amount,
          inOrders: 0,
          usdValue: usdVal,
          iconColor: assetObj?.iconColor || '#38BDF8',
        },
      ]);
    }

    const txId = 'tx_' + Math.floor(100000 + Math.random() * 900000);
    setTransactions(prev => [
      {
        id: txId,
        type: 'deposit',
        asset: assetSymbol,
        amount,
        usdValue: usdVal,
        status: 'completed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        network,
        address: 'NX7vK9Lp2mQ5wE8zR1xT3yU6iO0pAsDf',
        fee: 0,
      },
      ...prev,
    ]);

    showToast(`Deposit confirmed! +${amount} ${assetSymbol} ($${usdVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}) credited to your account.`, 'success');
  };

  const requestWithdrawal = (assetSymbol: string, amount: number, address: string, network: string): boolean => {
    const b = balances.find(item => item.symbol === assetSymbol);
    if (!b || b.available < amount) {
      showToast(`Insufficient ${assetSymbol} available for withdrawal.`, 'error');
      return false;
    }

    const assetObj = assets.find(a => a.symbol === assetSymbol);
    const unitPrice = assetObj ? assetObj.price : 1;
    const usdVal = amount * unitPrice;

    setBalances(prev =>
      prev.map(item =>
        item.symbol === assetSymbol
          ? { ...item, available: item.available - amount, total: item.total - amount }
          : item
      )
    );

    const txId = 'tx_' + Math.floor(100000 + Math.random() * 900000);
    setTransactions(prev => [
      {
        id: txId,
        type: 'withdrawal',
        asset: assetSymbol,
        amount,
        usdValue: usdVal,
        status: 'processing',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        network,
        address,
        fee: assetSymbol === 'USDT' ? 1.0 : 0.0002,
      },
      ...prev,
    ]);

    showToast(`Withdrawal dispatch initiated for ${amount} ${assetSymbol} via ${network}. Security check passed.`, 'success');
    return true;
  };

  const updateSecuritySettings = (settings: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...settings });
    showToast('Security preferences updated successfully.', 'success');
  };

  return (
    <ExchangeContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedSymbol,
        setSelectedSymbol,
        assets,
        selectedAsset,
        user,
        isLoggedIn,
        balances,
        totalBalanceUsd,
        totalBalanceBtc,
        spotOrders,
        futuresPositions,
        transactions,
        referrals,
        toasts,
        language,
        setLanguage,
        theme,
        toggleTheme,
        showToast,
        login,
        logout,
        register,
        placeSpotOrder,
        cancelSpotOrder,
        openFuturesPosition,
        closeFuturesPosition,
        simulateDeposit,
        requestWithdrawal,
        updateSecuritySettings,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) throw new Error('useExchange must be used within an ExchangeProvider');
  return context;
};
