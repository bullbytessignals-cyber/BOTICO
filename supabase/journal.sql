-- Botico — Trading Journal
-- Run this in your Supabase SQL editor (safe to re-run):
--   https://supabase.com/dashboard/project/awbdoyxplicnzgqfpcsb/sql/new

create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null,                 -- owner, matches the signed-in user's email
  traded_on   date,                          -- date of the trade
  symbol      text not null default '',      -- e.g. XAUUSD, BTCUSDT
  side        text not null default 'buy',   -- buy | sell
  entry       numeric,
  exit        numeric,
  size        numeric,                       -- lots / quantity
  pnl         numeric not null default 0,    -- realised profit / loss (USD)
  notes       text
);

alter table public.journal_entries enable row level security;
-- No public policies: only the server-side SECRET key reads/writes (scoped by email in code).
create index if not exists journal_email_idx on public.journal_entries (email, created_at desc);
