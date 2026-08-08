"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Loader2, FileUp, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data/seed-data";
import type { AdminBot } from "@/lib/bots-admin";
import type { BotFormState } from "./actions";

const ACCENTS = [
  "linear-gradient(135deg,#22d3ee,#3b82f6)",
  "linear-gradient(135deg,#8b5cf6,#22d3ee)",
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#34d399,#22d3ee)",
  "linear-gradient(135deg,#fbbf24,#fb7185)",
  "linear-gradient(135deg,#22d3ee,#6366f1)",
];

const input = "w-full h-10 px-3 rounded-lg bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/60";
const labelCls = "block text-xs font-medium text-muted mb-1";

function T({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className={labelCls}>{label}</label>{children}</div>);
}

export function BotForm({
  action,
  bot,
  submitLabel,
}: {
  action: (prev: BotFormState, fd: FormData) => Promise<BotFormState>;
  bot?: AdminBot;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<BotFormState, FormData>(action, {});
  const [accent, setAccent] = useState(bot?.accent ?? ACCENTS[0]);
  const [kind, setKind] = useState<"forex" | "crypto">(bot?.kind ?? "forex");
  const existingFile = bot?.filePath ? bot.filePath.split("/").pop() : "";
  const [fileName, setFileName] = useState("");

  return (
    <form action={formAction} className="space-y-8">
      {bot && <input type="hidden" name="id" value={bot.id} />}

      {/* Basics */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Basics</h2>

        {/* Bot type — decides what the buyer submits at checkout */}
        <div>
          <label className={labelCls}>Bot type</label>
          <input type="hidden" name="kind" value={kind} />
          <div className="grid grid-cols-2 gap-2 mt-1 max-w-md">
            {([
              { id: "forex", title: "Forex / MT bot", sub: "Buyer submits MT5 login" },
              { id: "crypto", title: "Crypto bot", sub: "Buyer submits Binance API" },
            ] as const).map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setKind(opt.id)}
                className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                  kind === opt.id
                    ? "border-cyan/50 bg-cyan/10 text-cyan-bright"
                    : "border-border text-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                <div className="text-sm font-semibold">{opt.title}</div>
                <div className="text-xs text-muted mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <T label="Bot name *"><input name="name" required defaultValue={bot?.name} className={input} placeholder="Photon HFT" /></T>
          <T label="Slug (URL — auto from name if blank)"><input name="slug" defaultValue={bot?.slug} className={input} placeholder="photon-hft" /></T>
          <T label="Developer / seller name"><input name="developer" defaultValue={bot?.developer} className={input} placeholder="QuantForge Labs" /></T>
          <T label="Recommended risk"><input name="recommendedRisk" defaultValue={bot?.recommendedRisk} className={input} placeholder="0.5–1% / trade" /></T>
        </div>
        <T label="Tagline (short one-liner)"><input name="tagline" defaultValue={bot?.tagline} className={input} placeholder="Sub-millisecond gold scalper with adaptive spread filter" /></T>
        <T label="Full description">
          <textarea name="description" defaultValue={bot?.description} rows={4}
            className="w-full px-3 py-2 rounded-lg bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 resize-y"
            placeholder="Detailed description shown on the bot page…" />
        </T>
      </section>

      {/* Categorisation */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Categories &amp; compatibility</h2>
        <div>
          <label className={labelCls}>Categories (tick all that apply)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1">
            {CATEGORIES.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
                <input type="checkbox" name="categories" value={c.slug} defaultChecked={bot?.categories.includes(c.slug)} className="accent-cyan" />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <T label="Platforms (comma-separated)"><input name="platforms" defaultValue={bot?.platforms.join(", ")} className={input} placeholder="MT5, cTrader" /></T>
          <T label="Assets / pairs (comma-separated)"><input name="assets" defaultValue={bot?.assets.join(", ")} className={input} placeholder="XAUUSD, EURUSD" /></T>
        </div>
      </section>

      {/* Performance */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Performance &amp; stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <T label="Monthly return %"><input name="monthlyReturn" type="number" step="0.1" defaultValue={bot?.monthlyReturn} className={input} placeholder="18.4" /></T>
          <T label="Max drawdown %"><input name="maxDrawdown" type="number" step="0.1" defaultValue={bot?.maxDrawdown} className={input} placeholder="8.2" /></T>
          <T label="Win rate %"><input name="winRate" type="number" step="1" defaultValue={bot?.winRate} className={input} placeholder="71" /></T>
          <T label="Avg RR (1:x)"><input name="avgRR" type="number" step="0.1" defaultValue={bot?.avgRR} className={input} placeholder="1.8" /></T>
          <T label="Rating (0–5)"><input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={bot?.rating ?? 5} className={input} placeholder="4.9" /></T>
          <T label="Reviews"><input name="reviews" type="number" defaultValue={bot?.reviews} className={input} placeholder="1284" /></T>
          <T label="Downloads"><input name="downloads" type="number" defaultValue={bot?.downloads} className={input} placeholder="41200" /></T>
          <T label="Min balance ($)"><input name="minBalance" type="number" defaultValue={bot?.minBalance} className={input} placeholder="2000" /></T>
        </div>
      </section>

      {/* Pricing & display */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Pricing &amp; display</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <T label="Buy price ($, 0 = not for sale)"><input name="priceBuy" type="number" defaultValue={bot?.priceBuy} className={input} placeholder="899" /></T>
          <T label="Rent price ($/mo, 0 = off)"><input name="priceRent" type="number" defaultValue={bot?.priceRent} className={input} placeholder="79" /></T>
          <T label="Annual price ($/yr, 0 = off)"><input name="priceAnnual" type="number" defaultValue={bot?.priceAnnual} className={input} placeholder="699" /></T>
        </div>
        <p className="text-xs text-muted">Set any price to <span className="text-foreground">0</span> to hide that option. e.g. leave Buy at 0 if the bot is rent/subscription only.</p>
        <div>
          <label className={labelCls}>Accent colour</label>
          <input type="hidden" name="accent" value={accent} />
          <div className="flex flex-wrap gap-2 mt-1">
            {ACCENTS.map((a) => (
              <button type="button" key={a} onClick={() => setAccent(a)}
                className={`size-9 rounded-lg transition-all ${accent === a ? "ring-2 ring-cyan ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"}`}
                style={{ background: a }} aria-label="accent" />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={bot?.featured} className="accent-cyan size-4" /> Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="verified" defaultChecked={bot?.verified} className="accent-cyan size-4" /> Verified badge
          </label>
        </div>
      </section>

      {/* Downloadable EA file — delivered to buyers after you approve their payment */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">EA file (delivered on Buy)</h2>
        <p className="text-xs text-muted">Upload the <span className="text-foreground">.mq5 / .ex5 / .zip</span> file. Buyers who choose <span className="text-foreground">Buy</span> get a secure download link after you approve their payment in Deposits. Renters don&apos;t get the file.</p>
        <input type="hidden" name="filePathExisting" value={bot?.filePath ?? ""} />
        <label className="flex items-center gap-2 h-11 px-4 rounded-lg bg-black/20 border border-border text-sm text-muted cursor-pointer hover:bg-white/5 max-w-md">
          {fileName || existingFile ? <FileCheck2 className="size-4 text-success" /> : <FileUp className="size-4" />}
          <span className="truncate">{fileName || existingFile || "Upload EA file (.mq5, .ex5, .zip)"}</span>
          <input
            type="file" name="mqlFile" accept=".mq5,.ex5,.mq4,.ex4,.zip,.set" className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
        </label>
        {existingFile && !fileName && <p className="text-xs text-success">Current file: {existingFile}. Upload a new one to replace it.</p>}
      </section>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
          <AlertCircle className="size-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : submitLabel}
        </Button>
      </div>
    </form>
  );
}
