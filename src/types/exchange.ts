/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'home'
  | 'register'
  | 'login'
  | 'dashboard'
  | 'spot'
  | 'futures'
  | 'markets'
  | 'deposit'
  | 'withdrawal'
  | 'history'
  | 'settings'
  | 'security'
  | 'referral'
  | 'forgot-password';

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
  category: 'L1/L2' | 'DeFi' | 'AI' | 'Meme' | 'Gaming';
  iconColor: string;
  decimalPlaces: number;
}

export interface UserBalance {
  symbol: string;
  name: string;
  total: number;
  available: number;
  inOrders: number;
  usdValue: number;
  iconColor: string;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface MarketTrade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: 'buy' | 'sell';
}

export interface SpotOrder {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop_limit';
  price: number;
  amount: number;
  filled: number;
  total: number;
  status: 'filled' | 'open' | 'cancelled';
  timestamp: string;
}

export interface FuturesPosition {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  leverage: number;
  marginMode: 'cross' | 'isolated';
  size: number;
  entryPrice: number;
  markPrice: number;
  liqPrice: number;
  margin: number;
  pnl: number;
  pnlPercentage: number;
  timestamp: string;
}

export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdrawal' | 'spot_buy' | 'spot_sell' | 'futures_pnl' | 'referral_bonus' | 'transfer';
  asset: string;
  amount: number;
  usdValue: number;
  status: 'completed' | 'processing' | 'failed';
  timestamp: string;
  txHash?: string;
  network?: string;
  address?: string;
  fee?: number;
}

export interface ReferralFriend {
  id: string;
  userId: string;
  registerDate: string;
  tier: string;
  tradingVolumeUsd: number;
  commissionEarnedUsd: number;
  status: 'active' | 'inactive';
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  uid: string;
  vipLevel: number;
  kycTier: number;
  twoFactorEnabled: boolean;
  antiPhishingCode: string;
  whitelistEnabled: boolean;
  createdAt: string;
}
