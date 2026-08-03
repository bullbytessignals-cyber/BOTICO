import { supabaseService } from "@/lib/supabase/server";

const BUCKET = "copy-ea";
const TABLE = "copy_providers";

export interface ProviderFormValues {
  slug: string;
  name: string;
  specialty: string;
  description: string;
  markets: string[];
  platforms: string[];
  winRate: number;
  copiers: number;
  priceBuy: number;
  priceRent: number;
  priceAnnual: number;
  avatarUrl: string;
  featureUrl: string;
  accent: string;
  featured: boolean;
  verified: boolean;
}

export interface AdminProvider extends ProviderFormValues {
  id: string;
  created_at: string;
}

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toRow(v: ProviderFormValues) {
  return {
    slug: v.slug,
    name: v.name,
    specialty: v.specialty,
    description: v.description,
    markets: v.markets,
    platforms: v.platforms,
    win_rate: v.winRate,
    copiers: v.copiers,
    price_buy: v.priceBuy,
    price_rent: v.priceRent,
    price_annual: v.priceAnnual,
    avatar_url: v.avatarUrl,
    feature_url: v.featureUrl,
    accent: v.accent,
    featured: v.featured,
    verified: v.verified,
  };
}

function fromRow(r: Record<string, unknown>): AdminProvider {
  return {
    id: r.id as string,
    created_at: r.created_at as string,
    slug: r.slug as string,
    name: r.name as string,
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
  };
}

/** Upload an image to the public copy-ea bucket; returns its public URL. */
export async function uploadProviderImage(
  file: File,
  slug: string,
  kind: "avatar" | "feature"
): Promise<string | null> {
  const sb = supabaseService();
  if (!sb || !file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${slug || "provider"}/${kind}-${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function listProvidersAdmin(): Promise<Result<AdminProvider[]>> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { data, error } = await sb.from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).map(fromRow) };
}

export async function getProviderForEdit(id: string): Promise<AdminProvider | null> {
  const sb = supabaseService();
  if (!sb) return null;
  const { data, error } = await sb.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return fromRow(data);
}

export async function createProvider(v: ProviderFormValues): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).insert(toRow(v));
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateProvider(id: string, v: ProviderFormValues): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).update(toRow(v)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteProvider(id: string): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
