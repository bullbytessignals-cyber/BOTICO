-- Botico — Supabase setup
-- Run this in your project's SQL editor (safe to re-run — uses IF NOT EXISTS):
--   https://supabase.com/dashboard/project/awbdoyxplicnzgqfpcsb/sql/new
-- Paste everything below and click "Run".

-- ============================================================
-- 1) Custom-bot order requests (from /custom-bot → shown in /admin67)
-- ============================================================
create table if not exists public.custom_orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  contact       text,
  platform      text not null,
  strategy_type text,
  markets       text,
  timeframe     text,
  risk          text,
  indicators    text,
  description   text not null,
  price         numeric not null default 49.99,
  status        text not null default 'new'
);
alter table public.custom_orders enable row level security;
-- No public policies: only the server-side SECRET key can read/write.
create index if not exists custom_orders_created_at_idx
  on public.custom_orders (created_at desc);

-- ============================================================
-- 2) Marketplace bots (managed from the /admin67 panel)
-- ============================================================
create table if not exists public.bots (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  slug             text unique not null,
  name             text not null,
  tagline          text not null default '',
  developer        text not null default '',
  description      text not null default '',
  categories       text[] not null default '{}',
  platforms        text[] not null default '{}',
  assets           text[] not null default '{}',
  rating           numeric not null default 5,
  reviews          int not null default 0,
  downloads        int not null default 0,
  monthly_return   numeric not null default 0,
  max_drawdown     numeric not null default 0,
  win_rate         numeric not null default 0,
  avg_rr           numeric not null default 0,
  min_balance      int not null default 0,
  recommended_risk text not null default '',
  price_buy        int not null default 0,
  price_rent       int not null default 0,
  featured         boolean not null default false,
  verified         boolean not null default false,
  accent           text not null default 'linear-gradient(135deg,#22d3ee,#3b82f6)'
);
alter table public.bots enable row level security;
-- Bots are public catalogue data → allow anyone to read.
-- Inserts/updates/deletes happen server-side with the SECRET key (bypasses RLS).
drop policy if exists "public read bots" on public.bots;
create policy "public read bots" on public.bots
  for select to anon, authenticated using (true);
create index if not exists bots_created_at_idx on public.bots (created_at desc);
create index if not exists bots_featured_idx on public.bots (featured);

-- ============================================================
-- 3) Copy EA traders (managed from /admin67 → Copy EA)
-- ============================================================
create table if not exists public.copy_providers (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  slug         text unique not null,
  name         text not null,
  specialty    text not null default '',
  description  text not null default '',
  markets      text[] not null default '{}',
  platforms    text[] not null default '{}',
  win_rate     numeric not null default 0,
  copiers      int not null default 0,
  price_buy    int not null default 0,
  price_rent   int not null default 0,
  avatar_url   text not null default '',
  feature_url  text not null default '',
  accent       text not null default 'linear-gradient(135deg,#22d3ee,#3b82f6)',
  featured     boolean not null default false,
  verified     boolean not null default false
);
alter table public.copy_providers enable row level security;
drop policy if exists "public read copy_providers" on public.copy_providers;
create policy "public read copy_providers" on public.copy_providers
  for select to anon, authenticated using (true);
create index if not exists copy_providers_created_at_idx on public.copy_providers (created_at desc);

-- Public storage bucket for Copy EA images (trader pic + feature banner).
insert into storage.buckets (id, name, public)
values ('copy-ea', 'copy-ea', true)
on conflict (id) do nothing;
