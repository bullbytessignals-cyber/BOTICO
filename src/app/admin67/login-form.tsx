"use client";

import { useActionState } from "react";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import { adminLogin, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";

export function AdminLogin({ notice }: { notice?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(adminLogin, {});

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-grid place-items-center size-12 rounded-2xl bg-gradient-to-br from-cyan to-blue text-[#03121a]">
            <Lock className="size-6" strokeWidth={2.2} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">Botico Admin</h1>
          <p className="mt-1 text-sm text-muted">Restricted area — authorized staff only.</p>
        </div>

        <form action={action} className="mt-6 glass-strong rounded-2xl p-6 space-y-4">
          <input
            name="password"
            type="password"
            autoFocus
            placeholder="Admin password"
            className="w-full h-11 px-4 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/70"
          />
          {(state.error || notice) && (
            <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
              <AlertCircle className="size-4 shrink-0" /> {state.error ?? notice}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (<><Loader2 className="size-4 animate-spin" /> Verifying…</>) : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
