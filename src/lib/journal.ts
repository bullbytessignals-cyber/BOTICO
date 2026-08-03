import { supabaseService } from "@/lib/supabase/server";

const TABLE = "journal_entries";

export interface JournalInput {
  tradedOn?: string; // yyyy-mm-dd
  symbol: string;
  side: "buy" | "sell";
  entry?: number;
  exit?: number;
  size?: number;
  pnl: number;
  notes?: string;
}

export interface JournalEntry extends JournalInput {
  id: string;
  created_at: string;
}

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

function fromRow(r: Record<string, unknown>): JournalEntry {
  return {
    id: r.id as string,
    created_at: r.created_at as string,
    tradedOn: (r.traded_on as string) ?? "",
    symbol: (r.symbol as string) ?? "",
    side: (r.side as string) === "sell" ? "sell" : "buy",
    entry: r.entry != null ? Number(r.entry) : undefined,
    exit: r.exit != null ? Number(r.exit) : undefined,
    size: r.size != null ? Number(r.size) : undefined,
    pnl: Number(r.pnl ?? 0),
    notes: (r.notes as string) ?? "",
  };
}

/** A single user's journal entries, newest first. */
export async function listJournal(email: string): Promise<Result<JournalEntry[]>> {
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

export async function createJournalEntry(email: string, input: JournalInput): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  if (!email) return { ok: false, error: "Not signed in." };
  const { error } = await sb.from(TABLE).insert({
    email,
    traded_on: input.tradedOn || null,
    symbol: input.symbol,
    side: input.side,
    entry: input.entry ?? null,
    exit: input.exit ?? null,
    size: input.size ?? null,
    pnl: input.pnl,
    notes: input.notes || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Delete an entry — scoped to the owner's email so users can't delete others'. */
export async function deleteJournalEntry(email: string, id: string): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  if (!email || !id) return { ok: false, error: "Invalid request." };
  const { error } = await sb.from(TABLE).delete().eq("id", id).ilike("email", email);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
