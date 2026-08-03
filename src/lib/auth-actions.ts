"use server";

import { redirect } from "next/navigation";
import { supabaseAuthServer } from "@/lib/supabase/auth-server";

export interface AuthState {
  error?: string;
  message?: string;
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const sb = await supabaseAuthServer();
  if (!sb) return { error: "Auth is not configured." };

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) return { error: "Fill in your name, email and password." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email address." };

  const sb = await supabaseAuthServer();
  if (!sb) return { error: "Auth is not configured." };

  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { name, full_name: name } },
  });
  if (error) return { error: error.message };

  // If email confirmation is disabled, a session is returned → straight in.
  if (data.session) redirect("/dashboard");
  return { message: "Account created! Check your email to confirm, then sign in." };
}

export async function signOutAction() {
  const sb = await supabaseAuthServer();
  if (sb) await sb.auth.signOut();
  redirect("/");
}
