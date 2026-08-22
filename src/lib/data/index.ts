import { supabaseService } from "@/lib/supabase/server";
import type { Bot, BotKind, Category, Developer, CopyProvider, EquityPoint, PlatformStat } from "./types";
import { CATEGORIES, PLATFORM_STATS } from "./seed-data";

/**
 * Public marketplace data.
 *
 * Bots are stored in Supabase and managed from the /admin67 panel — there is
 * NO fake/seed bot data. When Supabase isn't configured (or is empty) these
 * return empty arrays so the site shows proper empty states. Categories are a
 * fixed taxonomy kept in config; developers are derived from the bots.
 */

/* Deterministic equity curve so cards render a chart without storing points. */
function equityFromSlug(slug: string, monthlyReturn: number): EquityPoint[] {
  let seed = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    seed ^= slug.charCodeAt(i);
    seed = Math.imul(seed, 16777619) >>> 0;
  }
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const drift = Math.max(1.6, Math.min(5, Math.abs(monthlyReturn) / 4 + 1.6));
  let v = 10000;
  const out: EquityPoint[] = [];
  for (let i = 0; i < 48; i++) {
    v = Math.max(8500, v * (1 + ((rand() - 0.42) * drift) / 100));
    out.push({ t: i, v: Math.round(v) });
  }
  return out;
}

type BotRow = {
  slug: string; name: string; tagline: string; description: string; kind: string; developer: string;
  categories: string[]; platforms: string[]; assets: string[];
  rating: number; reviews: number; downloads: number;
  monthly_return: number; max_drawdown: number; win_rate: number; avg_rr: number;
  min_balance: number; recommended_risk: string; price_buy: number; price_rent: number; price_annual: number; price_original?: number | null;
  featured: boolean; verified: boolean; accent: string; feature_url?: string | null; file_path?: string | null;
  delivery?: string | null; demo_server?: string | null; demo_login?: string | null; demo_password?: string | null; demo_platform?: string | null;
};

function mapBot(r: BotRow): Bot {
  return {
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description ?? "",
    kind: (r.kind as BotKind) === "crypto" ? "crypto" : "forex",
    developer: r.developer,
    categories: r.categories ?? [],
    platforms: r.platforms ?? [],
    assets: r.assets ?? [],
    rating: Number(r.rating),
    reviews: r.reviews,
    downloads: r.downloads,
    monthlyReturn: Number(r.monthly_return),
    maxDrawdown: Number(r.max_drawdown),
    winRate: Number(r.win_rate),
    avgRR: Number(r.avg_rr),
    minBalance: r.min_balance,
    recommendedRisk: r.recommended_risk,
    priceBuy: r.price_buy,
    priceRent: r.price_rent,
    priceAnnual: Number(r.price_annual ?? 0),
    priceOriginal: Number(r.price_original ?? 0),
    featured: r.featured,
    verified: r.verified,
    accent: r.accent,
    featureUrl: (r.feature_url as string) ?? "",
    hasFile: Boolean(r.file_path),
    delivery: (r.delivery as string) === "managed" ? "managed" : "file",
    demoServer: (r.demo_server as string) ?? "",
    demoLogin: (r.demo_login as string) ?? "",
    demoPassword: (r.demo_password as string) ?? "",
    demoPlatform: (r.demo_platform as string) ?? "",
    equity: equityFromSlug(r.slug, Number(r.monthly_return)),
  };
}

export async function getBots(): Promise<Bot[]> {
  const sb = supabaseService();
  if (!sb) return [];
  const { data, error } = await sb.from("bots").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as BotRow[]).map(mapBot);
}

export async function getFeaturedBots(): Promise<Bot[]> {
  const bots = await getBots();
  const featured = bots.filter((b) => b.featured);
  return featured.length ? featured : bots.slice(0, 6);
}

export async function getBotBySlug(slug: string): Promise<Bot | null> {
  const sb = supabaseService();
  if (!sb) return null;
  const { data, error } = await sb.from("bots").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapBot(data as BotRow);
}

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

/** Developers are derived from the bots that exist. */
export async function getDevelopers(): Promise<Developer[]> {
  const bots = await getBots();
  const byName = new Map<string, Developer>();
  for (const b of bots) {
    const name = b.developer?.trim() || "Independent";
    const existing = byName.get(name);
    if (existing) {
      existing.bots += 1;
      existing.followers += b.downloads;
      existing.verified = existing.verified || b.verified;
    } else {
      byName.set(name, {
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name,
        avatar: name.slice(0, 2).toUpperCase(),
        verified: b.verified,
        bots: 1,
        followers: b.downloads,
      });
    }
  }
  return [...byName.values()].sort((a, b) => b.bots - a.bots);
}

export async function getDeveloper(slug: string): Promise<Developer | null> {
  const devs = await getDevelopers();
  return devs.find((d) => d.slug === slug || d.name === slug) ?? null;
}

export async function getCopyProviders(): Promise<CopyProvider[]> {
  const sb = supabaseService();
  if (!sb) return [];
  const { data, error } = await sb
    .from("copy_providers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    slug: r.slug as string,
    name: r.name as string,
    kind: (r.kind as BotKind) === "crypto" ? "crypto" : "forex",
    specialty: (r.specialty as string) ?? "",
    description: (r.description as string) ?? "",
    markets: (r.markets as string[]) ?? [],
    platforms: (r.platforms as string[]) ?? [],
    winRate: Number(r.win_rate ?? 0),
    copiers: Number(r.copiers ?? 0),
    priceBuy: Number(r.price_buy ?? 0),
    priceRent: Number(r.price_rent ?? 0),
    priceAnnual: Number(r.price_annual ?? 0),
    avatarUrl: (r.avatar_url as string) ?? "",
    featureUrl: (r.feature_url as string) ?? "",
    accent: (r.accent as string) ?? "linear-gradient(135deg,#22d3ee,#3b82f6)",
    featured: Boolean(r.featured),
    verified: Boolean(r.verified),
    demoServer: (r.demo_server as string) ?? "",
    demoLogin: (r.demo_login as string) ?? "",
    demoPassword: (r.demo_password as string) ?? "",
    demoPlatform: (r.demo_platform as string) ?? "",
  }));
}

export async function getCopyProviderBySlug(slug: string): Promise<CopyProvider | null> {
  const providers = await getCopyProviders();
  return providers.find((p) => p.slug === slug) ?? null;
}

export function getPlatformStats(): PlatformStat[] {
  return PLATFORM_STATS;
}
