import { supabaseService } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/lib/payments-config";

const TABLE = "payments";
const BUCKET = "payments";

export interface PaymentInput {
  itemType: string; // bot | copy-ea | custom
  itemSlug?: string;
  itemName: string;
  itemKind?: string; // forex | crypto
  itemPlan?: string; // buy | rent | annual
  amount: number;
  coin: string;
  name: string;
  countryCode?: string; // WhatsApp dial code e.g. +92
  contact: string;
  email?: string;
  // Forex bots → MT5 credentials
  mt5Login?: string;
  mt5Password?: string;
  mt5Server?: string;
  // Crypto bots → Binance API credentials
  binanceApiKey?: string;
  binanceApiSecret?: string;
  customConfig?: string; // custom configuration details (+$10 add-on)
  txHash?: string;
  proofUrl?: string;
}

export interface Payment extends PaymentInput {
  id: string;
  created_at: string;
  status: PaymentStatus;
}

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

export async function uploadProof(file: File): Promise<string | null> {
  const sb = supabaseService();
  if (!sb || !file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `proofs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function createPayment(input: PaymentInput): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).insert({
    item_type: input.itemType,
    item_slug: input.itemSlug ?? null,
    item_name: input.itemName,
    item_kind: input.itemKind ?? "forex",
    item_plan: input.itemPlan ?? "buy",
    amount: input.amount,
    coin: input.coin,
    name: input.name,
    country_code: input.countryCode ?? null,
    contact: input.contact,
    email: input.email ?? null,
    mt5_login: input.mt5Login ?? null,
    mt5_password: input.mt5Password ?? null,
    mt5_server: input.mt5Server ?? null,
    binance_api_key: input.binanceApiKey ?? null,
    binance_api_secret: input.binanceApiSecret ?? null,
    custom_config: input.customConfig ?? null,
    tx_hash: input.txHash ?? null,
    proof_url: input.proofUrl ?? null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function fromRow(r: Record<string, unknown>): Payment {
  return {
    id: r.id as string,
    created_at: r.created_at as string,
    itemType: (r.item_type as string) ?? "bot",
    itemSlug: (r.item_slug as string) ?? "",
    itemName: (r.item_name as string) ?? "",
    itemKind: (r.item_kind as string) ?? "forex",
    itemPlan: (r.item_plan as string) ?? "buy",
    amount: Number(r.amount ?? 0),
    coin: (r.coin as string) ?? "",
    name: (r.name as string) ?? "",
    countryCode: (r.country_code as string) ?? "",
    contact: (r.contact as string) ?? "",
    email: (r.email as string) ?? "",
    mt5Login: (r.mt5_login as string) ?? "",
    mt5Password: (r.mt5_password as string) ?? "",
    mt5Server: (r.mt5_server as string) ?? "",
    binanceApiKey: (r.binance_api_key as string) ?? "",
    binanceApiSecret: (r.binance_api_secret as string) ?? "",
    customConfig: (r.custom_config as string) ?? "",
    txHash: (r.tx_hash as string) ?? "",
    proofUrl: (r.proof_url as string) ?? "",
    status: (r.status as PaymentStatus) ?? "pending",
  };
}

export async function listPayments(): Promise<Result<Payment[]>> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { data, error } = await sb.from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).map(fromRow) };
}

/** A single buyer's payments — matched by the email they used at checkout. */
export async function listPaymentsByEmail(email: string): Promise<Result<Payment[]>> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  if (!email) return { ok: true, data: [] };
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .ilike("email", email)
    .order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).map(fromRow) };
}

export async function setPaymentStatus(id: string, status: PaymentStatus): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
