"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { createJournalEntry, deleteJournalEntry } from "@/lib/journal";

export interface JournalState {
  error?: string;
  ok?: boolean;
}

function num(fd: FormData, k: string): number | undefined {
  const raw = String(fd.get(k) ?? "").trim();
  if (raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export async function addJournalEntry(_prev: JournalState, fd: FormData): Promise<JournalState> {
  const user = await getCurrentUser();
  const email = user?.email;
  if (!email) return { error: "Please sign in again." };

  const symbol = String(fd.get("symbol") ?? "").trim();
  if (!symbol) return { error: "Enter the symbol / pair you traded." };

  const pnl = num(fd, "pnl") ?? 0;

  const res = await createJournalEntry(email, {
    tradedOn: String(fd.get("tradedOn") ?? "").trim() || undefined,
    symbol,
    side: String(fd.get("side") ?? "buy") === "sell" ? "sell" : "buy",
    entry: num(fd, "entry"),
    exit: num(fd, "exit"),
    size: num(fd, "size"),
    pnl,
    notes: String(fd.get("notes") ?? "").trim() || undefined,
  });

  if (!res.ok) return { error: res.error };
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function removeJournalEntry(fd: FormData) {
  const user = await getCurrentUser();
  const email = user?.email;
  if (!email) return;
  const id = String(fd.get("id") ?? "");
  if (id) await deleteJournalEntry(email, id);
  revalidatePath("/dashboard");
}
