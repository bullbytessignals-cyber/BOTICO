"use client";

import { useActionState, useState } from "react";
import {
  Copy, Check, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Upload, Wallet,
  KeyRound, Server, BadgeCheck, ImageIcon, SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type CryptoMethod, CUSTOM_CONFIG_FEE } from "@/lib/payments-config";
import { COUNTRY_CODES } from "@/lib/country-codes";
import { submitPayment, type CheckoutState } from "./actions";

interface Item {
  type: string;
  slug: string;
  name: string;
  amount: number;
  planLabel: string;
  kind: "forex" | "crypto";
  collectSetup?: boolean; // false for custom builds (bot delivered later)
  allowCustomConfig?: boolean; // offer the +$10 custom configuration add-on
  plan?: string; // buy | rent | annual
}

const input = "w-full h-11 px-4 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/60";
const labelCls = "block text-xs font-medium text-muted mb-1";

export function CheckoutClient({
  item, methods, qr,
}: {
  item: Item;
  methods: CryptoMethod[];
  qr: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(submitPayment, {});
  const [methodId, setMethodId] = useState(methods[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const [dial, setDial] = useState(COUNTRY_CODES[0].dial);
  const [proofName, setProofName] = useState("");
  const [customConfig, setCustomConfig] = useState(false);
  const method = methods.find((m) => m.id === methodId) ?? methods[0];
  const isCrypto = item.kind === "crypto";
  const collectSetup = item.collectSetup !== false;
  const allowCustomConfig = item.allowCustomConfig === true;
  const total = item.amount + (customConfig ? CUSTOM_CONFIG_FEE : 0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(method.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  if (state.done) {
    return (
      <div className="glass-strong rounded-[var(--radius)] p-10 text-center max-w-lg mx-auto">
        <span className="inline-grid place-items-center size-16 rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold">Payment submitted!</h2>
        <p className="mt-2 text-muted">
          We&apos;ve received your details for <span className="text-foreground font-semibold">{item.name}</span>.
          Our team will verify the transaction and set up your bot — you&apos;ll be contacted on WhatsApp at the number you provided.
        </p>
        <Button className="mt-6" onClick={() => window.location.assign("/marketplace")}>Back to marketplace</Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
      {/* LEFT — pay */}
      <div className="space-y-4">
        <div className="glass-strong rounded-[var(--radius)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-muted">{item.planLabel}</span>
                {collectSetup ? (
                  <Badge variant={isCrypto ? "violet" : "cyan"}>{isCrypto ? "Crypto bot" : "Forex bot"}</Badge>
                ) : (
                  <Badge variant="cyan">Custom build</Badge>
                )}
              </div>
              <div className="mt-1 font-display text-lg font-semibold">{item.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-muted">Amount</div>
              <div className="font-display text-2xl font-bold">${total.toFixed(2)}</div>
              {customConfig && (
                <div className="text-[11px] text-cyan-bright">incl. +${CUSTOM_CONFIG_FEE} custom config</div>
              )}
            </div>
          </div>
        </div>

        <div className="glass rounded-[var(--radius)] p-6">
          <h3 className="font-semibold flex items-center gap-2"><Wallet className="size-4 text-cyan-bright" /> Choose payment method</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethodId(m.id)}
                className={`text-left px-3 py-2 rounded-xl border text-sm transition-colors ${
                  methodId === m.id ? "border-cyan/50 bg-cyan/10 text-cyan-bright" : "border-border text-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Selected method */}
          <div className="mt-5 rounded-2xl border border-border bg-black/20 p-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Badge variant="cyan">{method.network}</Badge>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              {qr[method.id] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr[method.id]} alt="QR" className="size-32 rounded-xl bg-white p-1 shrink-0" />
              )}
              <div className="min-w-0 w-full">
                <div className="text-xs uppercase tracking-wide text-muted">{method.isUid ? "Binance UID" : "Send to address"}</div>
                <div className="mt-1 font-mono text-sm break-all text-foreground">{method.address}</div>
                <button type="button" onClick={copy} className="mt-3 inline-flex items-center gap-2 h-9 px-4 rounded-full text-sm bg-white/5 hover:bg-white/10 transition-colors">
                  {copied ? (<><Check className="size-4 text-success" /> Copied</>) : (<><Copy className="size-4" /> Copy</>)}
                </button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted">
              Send exactly <span className="text-foreground font-semibold">${total.toFixed(2)}</span> worth of {method.label.split(" ")[0]} to the address above, then submit the form with your transaction hash and a screenshot.
            </p>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-muted">
            <li className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-success" /> Manual review — usually approved within a few hours.</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-success" /> Your details are only used to set up your bot.</li>
          </ul>
        </div>
      </div>

      {/* RIGHT — apply */}
      <form action={formAction} className="glass rounded-[var(--radius)] p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><BadgeCheck className="size-4 text-cyan-bright" /> Confirm your payment</h3>

        <input type="hidden" name="itemType" value={item.type} />
        <input type="hidden" name="itemSlug" value={item.slug} />
        <input type="hidden" name="itemName" value={item.name} />
        <input type="hidden" name="itemKind" value={item.kind} />
        <input type="hidden" name="itemPlan" value={item.plan ?? ""} />
        <input type="hidden" name="collectSetup" value={collectSetup ? "1" : "0"} />
        <input type="hidden" name="amount" value={item.amount} />
        <input type="hidden" name="coin" value={method.label} />

        <div><label className={labelCls}>Full name *</label><input name="name" className={input} placeholder="John Trader" /></div>

        {/* WhatsApp with country code selector */}
        <div>
          <label className={labelCls}>WhatsApp number *</label>
          <div className="flex gap-2">
            <select
              name="countryCode"
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              className="h-11 px-2 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 max-w-[8.5rem]"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.dial}>{c.flag} {c.dial}</option>
              ))}
            </select>
            <input name="contact" className={input} placeholder="3xx xxxxxxx" inputMode="tel" />
          </div>
        </div>

        <div><label className={labelCls}>Email (for receipt)</label><input name="email" type="email" className={input} placeholder="you@email.com" /></div>

        {/* Setup credentials — conditional on bot type; skipped for custom builds */}
        {collectSetup && isCrypto && (
          <div className="pt-1 rounded-2xl border border-violet/30 bg-violet/5 p-4">
            <div className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <KeyRound className="size-3.5 text-violet" /> Binance API (so we can run your crypto bot)
            </div>
            <div className="space-y-3">
              <input name="binanceApiKey" className={input} placeholder="Binance API key" />
              <input name="binanceApiSecret" className={input} placeholder="Binance API secret" />
            </div>
            <p className="mt-2 text-[11px] text-muted">Create a key with trading enabled and withdrawals disabled. You can revoke it anytime.</p>
          </div>
        )}
        {collectSetup && !isCrypto && (
          <div className="pt-1 rounded-2xl border border-cyan/30 bg-cyan/5 p-4">
            <div className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <Server className="size-3.5 text-cyan-bright" /> MT5 account (so we can install your bot)
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <input name="mt5Login" className={input} placeholder="MT5 login" />
              <input name="mt5Password" className={input} placeholder="MT5 password" />
              <input name="mt5Server" className={input} placeholder="MT5 server" />
            </div>
          </div>
        )}

        {/* Custom configuration add-on (+$10) */}
        {allowCustomConfig && (
          <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="customConfig"
                value="1"
                checked={customConfig}
                onChange={(e) => setCustomConfig(e.target.checked)}
                className="mt-1 accent-cyan size-4"
              />
              <span>
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-cyan-bright" /> Add custom configuration
                  <span className="text-cyan-bright font-semibold">+${CUSTOM_CONFIG_FEE}</span>
                </span>
                <span className="block text-xs text-muted mt-0.5">
                  One-time setup — tune the bot to your style: partial closes, TP/SL, break-even & execution.
                </span>
              </span>
            </label>
            {customConfig && (
              <textarea
                name="customConfigDetails"
                rows={5}
                className="mt-3 w-full px-4 py-3 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 resize-y placeholder:text-muted/60"
                placeholder={"Tell us your preferences, e.g.\n• Partial close %: TP1 50%, TP2 30%\n• TP & SL management: move SL to TP1 after TP2\n• Break-even rules: BE after +15 pips\n• Execution: only London/NY session"}
              />
            )}
          </div>
        )}

        <div><label className={labelCls}>Transaction hash / ID *</label><input name="txHash" className={input} placeholder="Paste your TX hash / TXID" /></div>

        <div>
          <label className={labelCls}>Payment screenshot</label>
          <label className="flex items-center gap-2 h-11 px-4 rounded-xl bg-black/20 border border-border text-sm text-muted cursor-pointer hover:bg-white/5">
            {proofName ? <ImageIcon className="size-4 text-success" /> : <Upload className="size-4" />}
            <span className="truncate">{proofName || "Upload screenshot"}</span>
            <input type="file" name="proof" accept="image/*" className="hidden"
              onChange={(e) => setProofName(e.target.files?.[0]?.name || "")} />
          </label>
        </div>

        {state.error && (
          <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (<><Loader2 className="size-4 animate-spin" /> Submitting…</>) : `I've paid — submit for approval`}
        </Button>
        <p className="text-center text-xs text-muted">Your bot is set up after we verify the payment.</p>
      </form>
    </div>
  );
}
