import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

export const isSupabaseConfigured = Boolean(url && secret);

/**
 * Privileged, server-only Supabase client using the SECRET key.
 * Bypasses RLS — must NEVER be imported into client components.
 * Returns null when env vars are missing so callers degrade gracefully.
 */
export function supabaseService(): SupabaseClient | null {
  if (!url || !secret) return null;
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
