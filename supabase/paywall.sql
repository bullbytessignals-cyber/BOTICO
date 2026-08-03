-- Botico — Paywall / deposits migration
-- Run this in your Supabase SQL editor (safe to re-run — all idempotent):
--   https://supabase.com/dashboard/project/awbdoyxplicnzgqfpcsb/sql/new
-- Paste everything below and click "Run".

-- ============================================================
-- 1) Bot kind — forex (MT5) vs crypto (Binance API)
-- ============================================================
alter table public.bots
  add column if not exists kind text not null default 'forex';

-- ============================================================
-- 2) Payments / deposits (crypto paywall → shown in /admin67/payments)
--    Created here if it doesn't already exist.
-- ============================================================
create table if not exists public.payments (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  item_type     text not null default 'bot',   -- bot | copy-ea | custom
  item_slug     text,
  item_name     text not null default 'Order',
  item_kind     text not null default 'forex', -- forex | crypto
  amount        numeric not null default 0,
  coin          text not null default '',      -- chosen payment method label
  name          text not null default '',
  country_code  text,                          -- WhatsApp dial code e.g. +92
  contact       text not null default '',      -- WhatsApp / phone number
  email         text,
  -- Forex bots → MT5 credentials so we can install the EA:
  mt5_login     text,
  mt5_password  text,
  mt5_server    text,
  -- Crypto bots → Binance API credentials:
  binance_api_key    text,
  binance_api_secret text,
  -- Proof of payment:
  tx_hash       text,
  proof_url     text,
  status        text not null default 'pending' -- pending | approved | rejected
);

-- Add the newer columns to a pre-existing payments table (no-op if present):
alter table public.payments add column if not exists item_kind          text not null default 'forex';
alter table public.payments add column if not exists country_code       text;
alter table public.payments add column if not exists binance_api_key    text;
alter table public.payments add column if not exists binance_api_secret text;

alter table public.payments enable row level security;
-- No public policies: only the server-side SECRET key can read/write.
create index if not exists payments_created_at_idx on public.payments (created_at desc);
create index if not exists payments_status_idx     on public.payments (status);

-- Private storage bucket for payment screenshots (server reads via secret key).
insert into storage.buckets (id, name, public)
values ('payments', 'payments', true)
on conflict (id) do nothing;
