"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ShieldCheck, X } from "lucide-react";
import type { Bot, Category } from "@/lib/data/types";
import { BotCard } from "@/components/bots/bot-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SortKey = "downloads" | "return" | "rating" | "drawdown";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "downloads", label: "Most popular" },
  { key: "return", label: "Highest return" },
  { key: "rating", label: "Top rated" },
  { key: "drawdown", label: "Lowest drawdown" },
];

export function MarketplaceClient({
  bots,
  categories,
  initialCategory,
}: {
  bots: Bot[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(initialCategory ?? null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("downloads");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = bots.filter((b) => {
      if (active && !b.categories.includes(active)) return false;
      if (verifiedOnly && !b.verified) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${b.name} ${b.tagline} ${b.developer} ${b.assets.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "return": return b.monthlyReturn - a.monthlyReturn;
        case "rating": return b.rating - a.rating;
        case "drawdown": return a.maxDrawdown - b.maxDrawdown;
        default: return b.downloads - a.downloads;
      }
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bots, active, verifiedOnly, query, sort]);

  const groups = ["strategy", "asset", "session", "community"] as const;
  const closeOnMobile = () => setShowFilters(false);
  const activeCount = (active ? 1 : 0) + (verifiedOnly ? 1 : 0);

  return (
    <div>
      {/* Mobile filters toggle */}
      <button
        onClick={() => setShowFilters((v) => !v)}
        className="lg:hidden flex items-center justify-center gap-2 w-full h-11 mb-4 rounded-full glass text-sm font-medium"
      >
        {showFilters ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />}
        {showFilters ? "Close filters" : "Filters & search"}
        {!showFilters && activeCount > 0 && (
          <span className="grid place-items-center min-w-5 h-5 px-1.5 rounded-full bg-cyan text-[#03121a] text-[11px] font-bold">{activeCount}</span>
        )}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      {/* Filters sidebar */}
      <aside className={cn(
        "lg:sticky lg:top-24 h-max space-y-6",
        showFilters ? "block" : "hidden lg:block"
      )}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bots, assets…"
            className="w-full h-11 pl-10 pr-4 rounded-full glass text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted"
          />
        </div>

        <button
          onClick={() => setVerifiedOnly((v) => !v)}
          className={cn(
            "flex items-center gap-2 w-full h-10 px-4 rounded-full text-sm transition-colors",
            verifiedOnly ? "bg-cyan/15 text-cyan-bright border border-cyan/30" : "glass text-muted hover:text-foreground"
          )}
        >
          <ShieldCheck className="size-4" /> Verified only
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted mb-3">
            <SlidersHorizontal className="size-3.5" /> Categories
          </div>
          <button
            onClick={() => { setActive(null); closeOnMobile(); }}
            className={cn(
              "block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
              !active ? "bg-white/5 text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            All categories
          </button>
          {groups.map((g) => (
            <div key={g} className="mt-3">
              <div className="px-3 text-[10px] uppercase tracking-wider text-muted/70">{g}</div>
              {categories.filter((c) => c.group === g).map((c) => (
                <button
                  key={c.slug}
                  onClick={() => { setActive(c.slug); closeOnMobile(); }}
                  className={cn(
                    "block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                    active === c.slug ? "bg-cyan/15 text-cyan-bright" : "text-muted hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <p className="text-sm text-muted">
            <span className="text-foreground font-semibold">{filtered.length}</span> bots
            {active && <> in <Badge variant="cyan">{categories.find((c) => c.slug === active)?.name}</Badge></>}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={cn(
                  "whitespace-nowrap h-9 px-4 rounded-full text-xs transition-colors",
                  sort === s.key ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-muted">
            No bots match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((bot) => (
              <BotCard key={bot.slug} bot={bot} developerName={bot.developer} />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
