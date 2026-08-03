export type CategoryGroup = "strategy" | "asset" | "session" | "community";

export interface Category {
  slug: string;
  name: string;
  group: CategoryGroup;
  icon: string; // lucide icon name
  blurb: string;
}

export interface Developer {
  slug: string;
  name: string;
  avatar: string; // gradient seed / initials
  verified: boolean;
  bots: number;
  followers: number;
}

export interface EquityPoint {
  t: number; // index
  v: number; // equity value
}

export type BotKind = "forex" | "crypto";

export interface Bot {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  kind: BotKind; // forex → MT5 install · crypto → Binance API
  developer: string; // developer display name
  categories: string[]; // category slugs
  platforms: string[]; // MT4, MT5, cTrader...
  assets: string[]; // XAUUSD, EURUSD...
  rating: number;
  reviews: number;
  downloads: number;
  monthlyReturn: number; // %
  maxDrawdown: number; // %
  winRate: number; // %
  avgRR: number;
  minBalance: number;
  recommendedRisk: string;
  priceBuy: number; // one-time permanent license (0 = not for permanent sale)
  priceRent: number; // per month
  priceAnnual: number; // per year (0 = no annual plan)
  featured: boolean;
  verified: boolean;
  accent: string; // gradient css
  equity: EquityPoint[];
}

export interface CopyProvider {
  slug: string;
  name: string; // trader name
  specialty: string;
  description: string;
  markets: string[];
  platforms: string[];
  winRate: number; // accuracy %
  copiers: number;
  priceBuy: number;
  priceRent: number;
  priceAnnual: number;
  avatarUrl: string; // trader / bot pic
  featureUrl: string; // feature banner pic
  accent: string;
  featured: boolean;
  verified: boolean;
}

export interface PlatformStat {
  label: string;
  value: string;
}
