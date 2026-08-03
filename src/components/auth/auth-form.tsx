"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Lock, User } from "lucide-react";
import { signInAction, signUpAction, type AuthState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

const inputWrap = "relative";
const input =
  "w-full h-11 pl-10 pr-4 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/60";
const iconCls = "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signin" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-8 glass-strong rounded-[var(--radius)] p-6 space-y-4">
      {mode === "signup" && (
        <div className={inputWrap}>
          <User className={iconCls} />
          <input name="name" placeholder="Full name" className={input} autoComplete="name" />
        </div>
      )}
      <div className={inputWrap}>
        <Mail className={iconCls} />
        <input name="email" type="email" placeholder="you@email.com" className={input} autoComplete="email" />
      </div>
      <div className={inputWrap}>
        <Lock className={iconCls} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className={input}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
      </div>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
          <AlertCircle className="size-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.message && (
        <div className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/30 rounded-xl px-3 py-2">
          <CheckCircle2 className="size-4 shrink-0" /> {state.message}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <><Loader2 className="size-4 animate-spin" /> {mode === "signin" ? "Signing in…" : "Creating account…"}</>
        ) : mode === "signin" ? "Sign in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted pt-1">
        {mode === "signin" ? (
          <>Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-bright hover:underline">Sign up</Link>
          </>
        ) : (
          <>Already have an account?{" "}
            <Link href="/signin" className="text-cyan-bright hover:underline">Sign in</Link>
          </>
        )}
      </p>
    </form>
  );
}
