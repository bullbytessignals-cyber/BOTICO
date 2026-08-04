export interface CryptoMethod {
  id: string;
  label: string;
  network: string;
  address: string;
  isUid?: boolean;
}

/** Receiving addresses shown on the checkout paywall. */
export const CRYPTO_METHODS: CryptoMethod[] = [
  {
    id: "usdt-trc20",
    label: "USDT · TRC20",
    network: "Tron (TRC20)",
    address: "TLa4N14cmcFP7sdT8hfxmELZhx9m3nP31k",
  },
  {
    id: "usdt-bep20",
    label: "USDT · BEP20",
    network: "BNB Smart Chain (BEP20)",
    address: "0xa1d81208a0c494613d3813281f1100fe4593b0fc",
  },
  {
    id: "btc",
    label: "Bitcoin",
    network: "Bitcoin network",
    address: "1P8fH9Chy5bLnFvsGANt4SEkgcby2U8qmY",
  },
  {
    id: "bnb",
    label: "BNB",
    network: "BNB Smart Chain (BEP20)",
    address: "0xa1d81208a0c494613d3813281f1100fe4593b0fc",
  },
  {
    id: "sol",
    label: "Solana",
    network: "Solana network",
    address: "9Mk6eqhLc88AmSSeFookp9d1Lh7BEUtNZRC2v9ZQ6eh",
  },
  {
    id: "binance-uid",
    label: "Binance Pay (UID)",
    network: "Binance internal transfer",
    address: "1055936285",
    isUid: true,
  },
];

export const PAYMENT_STATUSES = ["pending", "approved", "rejected"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** One-time fee for custom bot configuration (partial closes, TP/SL, break-even, execution). */
export const CUSTOM_CONFIG_FEE = 10;
