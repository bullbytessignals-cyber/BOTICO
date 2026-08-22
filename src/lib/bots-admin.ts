import { supabaseService } from "@/lib/supabase/server";
import type { BotKind } from "@/lib/data/types";

export interface BotFormValues {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  kind: BotKind;
  developer: string;
  categories: string[];
  platforms: string[];
  assets: string[];
  rating: number;
  reviews: number;
  downloads: number;
  monthlyReturn: number;
  maxDrawdown: number;
  winRate: number;
  avgRR: number;
  minBalance: number;
  recommendedRisk: string;
  priceBuy: number;
  priceRent: number;
  priceAnnual: number;
  featured: boolean;
  verified: boolean;
  accent: string;
  featureUrl: string; // optional banner/feature image (public)
  filePath: string; // MQL file in the private bot-files bucket (delivered on Buy)
  delivery: "file" | "managed"; // file = buyer downloads · managed = we install on their MT5
  demoServer: string;
  demoLogin: string;
  demoPassword: string; // investor / read-only password
  demoPlatform: string;
}

export interface AdminBot extends BotFormValues {
  id: string;
  created_at: string;
}

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toRow(v: BotFormValues) {
  return {
    slug: v.slug,
    name: v.name,
    tagline: v.tagline,
    description: v.description,
    kind: v.kind,
    developer: v.developer,
    categories: v.categories,
    platforms: v.platforms,
    assets: v.assets,
    rating: v.rating,
    reviews: v.reviews,
    downloads: v.downloads,
    monthly_return: v.monthlyReturn,
    max_drawdown: v.maxDrawdown,
    win_rate: v.winRate,
    avg_rr: v.avgRR,
    min_balance: v.minBalance,
    recommended_risk: v.recommendedRisk,
    price_buy: v.priceBuy,
    price_rent: v.priceRent,
    price_annual: v.priceAnnual,
    featured: v.featured,
    verified: v.verified,
    accent: v.accent,
    feature_url: v.featureUrl || null,
    file_path: v.filePath || null,
    delivery: v.delivery,
    demo_server: v.demoServer || null,
    demo_login: v.demoLogin || null,
    demo_password: v.demoPassword || null,
    demo_platform: v.demoPlatform || null,
  };
}

function fromRow(r: Record<string, unknown>): AdminBot {
  return {
    id: r.id as string,
    created_at: r.created_at as string,
    slug: r.slug as string,
    name: r.name as string,
    tagline: (r.tagline as string) ?? "",
    description: (r.description as string) ?? "",
    kind: (r.kind as BotKind) === "crypto" ? "crypto" : "forex",
    developer: (r.developer as string) ?? "",
    categories: (r.categories as string[]) ?? [],
    platforms: (r.platforms as string[]) ?? [],
    assets: (r.assets as string[]) ?? [],
    rating: Number(r.rating ?? 0),
    reviews: Number(r.reviews ?? 0),
    downloads: Number(r.downloads ?? 0),
    monthlyReturn: Number(r.monthly_return ?? 0),
    maxDrawdown: Number(r.max_drawdown ?? 0),
    winRate: Number(r.win_rate ?? 0),
    avgRR: Number(r.avg_rr ?? 0),
    minBalance: Number(r.min_balance ?? 0),
    recommendedRisk: (r.recommended_risk as string) ?? "",
    priceBuy: Number(r.price_buy ?? 0),
    priceRent: Number(r.price_rent ?? 0),
    priceAnnual: Number(r.price_annual ?? 0),
    featured: Boolean(r.featured),
    verified: Boolean(r.verified),
    accent: (r.accent as string) ?? "",
    featureUrl: (r.feature_url as string) ?? "",
    filePath: (r.file_path as string) ?? "",
    delivery: (r.delivery as string) === "managed" ? "managed" : "file",
    demoServer: (r.demo_server as string) ?? "",
    demoLogin: (r.demo_login as string) ?? "",
    demoPassword: (r.demo_password as string) ?? "",
    demoPlatform: (r.demo_platform as string) ?? "",
  };
}

export async function listBotsAdmin(): Promise<Result<AdminBot[]>> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { data, error } = await sb.from("bots").select("*").order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).map(fromRow) };
}

export async function getBotForEdit(id: string): Promise<AdminBot | null> {
  const sb = supabaseService();
  if (!sb) return null;
  const { data, error } = await sb.from("bots").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return fromRow(data);
}

export async function createBot(v: BotFormValues): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from("bots").insert(toRow(v));
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateBot(id: string, v: BotFormValues): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from("bots").update(toRow(v)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteBot(id: string): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from("bots").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setBotFlag(id: string, field: "featured" | "verified", value: boolean): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from("bots").update({ [field]: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

const IMAGE_BUCKET = "bot-images";

/** Upload a bot's feature image to the public bucket; returns its public URL. */
export async function uploadBotImage(file: File, slug: string): Promise<string | null> {
  const sb = supabaseService();
  if (!sb || !file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${slug || "bot"}/feature-${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage.from(IMAGE_BUCKET).upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  return sb.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

const FILE_BUCKET = "bot-files";

/** Upload the MQL/EA file for a bot to the private bucket; returns its storage path. */
export async function uploadBotFile(file: File, slug: string): Promise<string | null> {
  const sb = supabaseService();
  if (!sb || !file || file.size === 0) return null;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${slug || "bot"}/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage.from(FILE_BUCKET).upload(path, buf, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (error) return null;
  return path;
}

/** A short-lived signed download URL for a bot's private file (used after ownership is verified). */
export async function getBotFileSignedUrl(filePath: string): Promise<string | null> {
  const sb = supabaseService();
  if (!sb || !filePath) return null;
  const name = filePath.split("/").pop() || "bot-file";
  const { data, error } = await sb.storage
    .from(FILE_BUCKET)
    .createSignedUrl(filePath, 120, { download: name });
  if (error || !data) return null;
  return data.signedUrl;
}

/** Look up a bot's file path by slug (server-only). */
export async function getBotFilePathBySlug(slug: string): Promise<string | null> {
  const sb = supabaseService();
  if (!sb) return null;
  const { data, error } = await sb.from("bots").select("file_path").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return (data.file_path as string) || null;
}
