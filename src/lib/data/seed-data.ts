import type { Category, PlatformStat } from "./types";

/* ------------------------------------------------------------------ */
/*  Categories — fixed taxonomy (bots reference these slugs).          */
/*  This is config, not fake catalogue data. Real bots are created in  */
/*  the /admin67 panel and stored in Supabase.                         */
/* ------------------------------------------------------------------ */
export const CATEGORIES: Category[] = [
  { slug: "hft", name: "High Frequency", group: "strategy", icon: "Zap", blurb: "Ultra-low-latency execution bots" },
  { slug: "scalping", name: "Scalping", group: "strategy", icon: "Timer", blurb: "Fast in-and-out precision entries" },
  { slug: "news", name: "News Trading", group: "strategy", icon: "Newspaper", blurb: "React to CPI, NFP, FOMC in ms" },
  { slug: "smart-money", name: "Smart Money", group: "strategy", icon: "Landmark", blurb: "Order blocks, FVG, liquidity" },
  { slug: "ict", name: "ICT Concepts", group: "strategy", icon: "Crosshair", blurb: "Inner circle trading models" },
  { slug: "trend", name: "Trend Following", group: "strategy", icon: "TrendingUp", blurb: "Ride momentum across sessions" },
  { slug: "grid", name: "Grid", group: "strategy", icon: "Grid3x3", blurb: "Layered grid & recovery logic" },
  { slug: "swing", name: "Swing", group: "strategy", icon: "Waves", blurb: "Multi-day positional trades" },
  { slug: "breakout", name: "Breakout", group: "strategy", icon: "Rocket", blurb: "Volatility expansion entries" },
  { slug: "mean-reversion", name: "Mean Reversion", group: "strategy", icon: "Repeat", blurb: "Fade extremes to the mean" },
  { slug: "copy", name: "Copy Trading", group: "strategy", icon: "Copy", blurb: "Mirror verified signal providers" },
  { slug: "ai", name: "AI Strategies", group: "strategy", icon: "BrainCircuit", blurb: "ML-optimised adaptive models" },

  { slug: "gold", name: "Gold", group: "asset", icon: "Coins", blurb: "XAUUSD specialists" },
  { slug: "forex", name: "Forex", group: "asset", icon: "DollarSign", blurb: "Major & minor FX pairs" },
  { slug: "crypto", name: "Crypto", group: "asset", icon: "Bitcoin", blurb: "BTC, ETH & alt exchanges" },
  { slug: "indices", name: "Indices", group: "asset", icon: "BarChart3", blurb: "US30, NAS100, SPX500" },

  { slug: "london", name: "London Open", group: "session", icon: "Sunrise", blurb: "European session momentum" },
  { slug: "new-york", name: "New York Open", group: "session", icon: "Building2", blurb: "US session liquidity" },
  { slug: "asian", name: "Asian Session", group: "session", icon: "Moon", blurb: "Tokyo range & breakout" },

  { slug: "copy-ea", name: "Copy EA", group: "community", icon: "Copy", blurb: "Auto-copy star traders into your account" },
  { slug: "prop-firm", name: "Prop Firm", group: "community", icon: "ShieldCheck", blurb: "Pass challenges & stay funded" },
  { slug: "verified", name: "Verified", group: "community", icon: "BadgeCheck", blurb: "Audited live track records" },
  { slug: "community", name: "Community", group: "community", icon: "Users", blurb: "Built by the Botico community" },
];

/* ------------------------------------------------------------------ */
/*  Hero live statistics                                               */
/* ------------------------------------------------------------------ */
export const PLATFORM_STATS: PlatformStat[] = [
  { label: "Active Bots", value: "10,000+" },
  { label: "Volume Traded", value: "$500M+" },
  { label: "Strategies", value: "150+" },
  { label: "Developers", value: "40+" },
  { label: "Uptime", value: "99.99%" },
];
