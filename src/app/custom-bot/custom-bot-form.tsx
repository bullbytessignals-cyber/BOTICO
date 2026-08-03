"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { submitCustomBot, type SubmitState } from "./actions";
import { Button } from "@/components/ui/button";

const PLATFORMS = ["MT5", "MT4", "cTrader", "DXTrade", "TradeLocker", "MatchTrader", "Binance", "Bybit", "OKX", "Other"];
const STRATEGIES = ["Scalping", "Trend Following", "Grid / Martingale", "News Trading", "Smart Money / ICT", "Breakout", "Mean Reversion", "AI / Machine Learning", "Copy Trading", "Other"];
const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "Multi-timeframe"];
const RISKS = ["Conservative", "Balanced", "Aggressive"];

const inputCls =
  "w-full h-11 px-4 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/70 transition";
const labelCls = "block text-sm font-medium mb-1.5";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-cyan-bright">*</span>}
      </label>
      {children}
    </div>
  );
}

export function CustomBotForm() {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitCustomBot, { ok: false });

  if (state.done) {
    return (
      <div className="glass-strong rounded-[var(--radius)] p-10 text-center">
        <span className="inline-grid place-items-center size-16 rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold">Request received!</h3>
        <p className="mt-2 text-muted max-w-md mx-auto">
          Thanks — our developers will review your custom bot request and reach
          out with a delivery timeline and payment link for the{" "}
          <span className="text-foreground font-semibold">$49.99</span> build.
        </p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="glass-strong rounded-[var(--radius)] p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2 text-cyan-bright">
        <Sparkles className="size-4" />
        <span className="text-sm font-medium">Tell us about your dream bot</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" required>
          <input name="name" className={inputCls} placeholder="John Trader" />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" className={inputCls} placeholder="you@email.com" />
        </Field>
        <Field label="Telegram / WhatsApp">
          <input name="contact" className={inputCls} placeholder="@username or +1…" />
        </Field>
        <Field label="Trading platform" required>
          <select name="platform" className={inputCls} defaultValue="">
            <option value="" disabled>Select platform</option>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Strategy type">
          <select name="strategyType" className={inputCls} defaultValue="">
            <option value="">Select (optional)</option>
            {STRATEGIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Markets / pairs">
          <input name="markets" className={inputCls} placeholder="XAUUSD, EURUSD, BTCUSDT…" />
        </Field>
        <Field label="Timeframe">
          <select name="timeframe" className={inputCls} defaultValue="">
            <option value="">Select (optional)</option>
            {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Risk preference">
          <select name="risk" className={inputCls} defaultValue="">
            <option value="">Select (optional)</option>
            {RISKS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Indicators / entry logic">
        <input name="indicators" className={inputCls} placeholder="RSI, EMA cross, order blocks, session filter…" />
      </Field>

      <Field label="Describe your strategy in detail" required>
        <textarea
          name="description"
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/70 transition resize-y"
          placeholder="Entry & exit rules, stop loss / take profit, trailing, lot sizing, news filter, prop-firm rules to respect, anything else we should know…"
        />
      </Field>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
          <AlertCircle className="size-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-sm text-muted">
          One-time build fee:{" "}
          <span className="text-foreground font-semibold text-base">$49.99</span>
        </p>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : "Continue to payment — $49.99"}
        </Button>
      </div>
    </form>
  );
}
