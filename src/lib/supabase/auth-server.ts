import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Server-side Supabase client bound to the request cookies (for reading the
 * signed-in user in server components / actions). Returns null if unconfigured.
 */
export async function supabaseAuthServer() {
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // called from a Server Component — safe to ignore, middleware refreshes
        }
      },
    },
  });
}

/** Convenience: the current signed-in user, or null. */
export async function getCurrentUser() {
  const sb = await supabaseAuthServer();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}
