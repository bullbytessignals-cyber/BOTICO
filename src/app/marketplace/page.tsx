import type { Metadata } from "next";
import { getBots, getCategories } from "@/lib/data";
import { MarketplaceClient } from "./marketplace-client";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse professional trading bots and Expert Advisors — HFT, scalping, news, smart money, AI and copy-trading strategies for MT4, MT5, cTrader and crypto.",
};

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [bots, categories] = await Promise.all([
    getBots(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16">
      <header className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Bot <span className="text-gradient">Marketplace</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Discover, compare and buy professional trading bots. Filter by
          strategy, asset class or session — every card shows verified live
          performance.
        </p>
      </header>

      <MarketplaceClient
        bots={bots}
        categories={categories}
        initialCategory={category}
      />
    </div>
  );
}
