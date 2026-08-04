import { supabaseService } from "@/lib/supabase/server";

export const CUSTOM_BOT_PRICE = 49.99;

export const ORDER_STATUSES = ["new", "in_progress", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface CustomOrderInput {
  name: string;
  email: string;
  contact?: string;
  platform: string;
  strategyType?: string;
  markets?: string;
  timeframe?: string;
  risk?: string;
  indicators?: string;
  description: string;
}

export interface CustomOrder extends CustomOrderInput {
  id: string;
  created_at: string;
  price: number;
  status: OrderStatus;
}

type Result<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

const TABLE = "custom_orders";

/** Public: insert a new custom-bot request (runs server-side with secret key). */
export async function createCustomOrder(input: CustomOrderInput): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected yet. Please try again shortly." };

  const { error } = await sb.from(TABLE).insert({
    name: input.name,
    email: input.email,
    contact: input.contact || null,
    platform: input.platform,
    strategy_type: input.strategyType || null,
    markets: input.markets || null,
    timeframe: input.timeframe || null,
    risk: input.risk || null,
    indicators: input.indicators || null,
    description: input.description,
    price: CUSTOM_BOT_PRICE,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Admin: list all orders (caller must already be authenticated). */
export async function listCustomOrders(): Promise<Result<CustomOrder[]>> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };

  const rows = (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    created_at: r.created_at as string,
    name: r.name as string,
    email: r.email as string,
    contact: (r.contact as string) ?? "",
    platform: r.platform as string,
    strategyType: (r.strategy_type as string) ?? "",
    markets: (r.markets as string) ?? "",
    timeframe: (r.timeframe as string) ?? "",
    risk: (r.risk as string) ?? "",
    indicators: (r.indicators as string) ?? "",
    description: r.description as string,
    price: Number(r.price),
    status: r.status as OrderStatus,
  }));
  return { ok: true, data: rows };
}

/** Admin: update a single order's status (caller must already be authenticated). */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };

  const { error } = await sb.from(TABLE).update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** The configured admin password, tolerant of accidental surrounding quotes/whitespace. */
function adminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim().replace(/^["']|["']$/g, "");
}

/** True when an ADMIN_PASSWORD is actually configured on the server. */
export function isAdminConfigured(): boolean {
  return adminPassword().length > 0;
}

/** Admin auth — compares against the ADMIN_PASSWORD env var. */
export function verifyAdminPassword(pw: string): boolean {
  const expected = adminPassword();
  return expected.length > 0 && pw.trim() === expected;
}
