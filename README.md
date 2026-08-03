# Botico — The World's First AI Trading Bot Marketplace

A premium marketplace to **discover, compare, buy and rent** professional
trading bots and Expert Advisors (MT4, MT5, cTrader, DXTrade, TradeLocker and
crypto exchanges) — all from one dashboard.

Dark‑luxury design, glassmorphism, cyan/blue accents, Framer‑Motion animations.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **Framer Motion** · shadcn‑style UI primitives
- **Auth.js (NextAuth v5)** — Google + GitHub
- **Prisma** + **PostgreSQL**

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. **It runs with zero configuration** — with no
database the app serves bundled seed data and uses stateless JWT sessions, so
the whole UI is immediately browsable.

## Enable Postgres + OAuth (optional)

1. Copy the env template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
   - `DATABASE_URL` — any Postgres (Supabase, Neon, local…)
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
   - `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`

2. Create the schema and seed the marketplace:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

Once `DATABASE_URL` is present the data layer automatically reads from Postgres
instead of the seed file, and Auth.js persists users/sessions via the Prisma
adapter. No code changes needed — see `src/lib/data/index.ts` and `src/lib/prisma.ts`.

## Project map

```
src/
  app/
    page.tsx                 Homepage (hero, categories, featured, figures, CTA)
    marketplace/             Filterable bot grid (search, category, sort)
    bots/[slug]/             Bot detail (performance, equity curve, buy panel)
    developers/              "Sell a Bot" seller landing
    pricing/                 3-tier pricing
    signin/                  Auth.js Google/GitHub sign-in
    dashboard/               Auth-protected buyer dashboard
    api/auth/[...nextauth]/  Auth.js route handler
  components/                site chrome, home sections, bot card, UI primitives
  lib/
    data/                    types, seed data, DB-with-fallback access layer
    prisma.ts  utils.ts
  auth.ts                    NextAuth config
prisma/
  schema.prisma  seed.ts
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Create/apply Prisma migrations |
| `npm run db:seed` | Seed categories, developers and bots |
| `npm run db:studio` | Open Prisma Studio |

---

_Trading involves substantial risk. Past performance is not indicative of
future results. Public‑figure strategies are community‑created and imply no
official affiliation._
