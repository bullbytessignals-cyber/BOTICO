"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser-side Supabase client (publishable key) for auth flows. */
export function supabaseBrowser() {
  return createBrowserClient(url, key);
}
