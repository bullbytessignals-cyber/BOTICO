"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Loader2, ImagePlus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminProvider } from "@/lib/copy-admin";
import type { ProviderFormState } from "./actions";

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

function ImageField({
  name, label, existing, aspect,
}: { name: string; label: string; existing?: string; aspect: string }) {
  const [preview, setPreview] = useState<string | null>(existing || null);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-4">
        <div className={`relative shrink-0 overflow-hidden rounded-xl border border-border bg-black/30 grid place-items-center ${aspect}`}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-5 text-muted" />
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 h-9 px-4 rounded-full text-sm bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <ImagePlus className="size-4" /> Choose image
            <input
              type="file" name={name} accept="image/*" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : existing || null);
              }}
            />
          </label>
          <p className="mt-1 text-xs text-muted">PNG/JPG, up to 5MB.</p>
        </div>
      </div>
    </div>
  );
}

export function ProviderForm({
  action, provider, submitLabel,
}: {
  action: (prev: ProviderFormState, fd: FormData) => Promise<ProviderFormState>;
  provider?: AdminProvider;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ProviderFormState, FormData>(action, {});
  const [accent, setAccent] = useState(provider?.accent ?? ACCENTS[0]);

  return (
    <form action={formAction} className="space-y-8">
      {provider && <input type="hidden" name="id" value={provider.id} />}
      <input type="hidden" name="avatarUrlExisting" value={provider?.avatarUrl ?? ""} />
      <input type="hidden" name="featureUrlExisting" value={provider?.featureUrl ?? ""} />

      {/* Trader */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Trader</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <T label="Trader name *"><input name="name" required defaultValue={provider?.name} className={input} placeholder="ICT Master" /></T>
          <T label="Slug (auto from name if blank)"><input name="slug" defaultValue={provider?.slug} className={input} placeholder="ict-master" /></T>
        </div>
        <T label="Specialty (one-liner)"><input name="specialty" defaultValue={provider?.specialty} className={input} placeholder="Inner-circle killzone entries" /></T>
        <T label="Description">
          <textarea name="description" defaultValue={provider?.description} rows={3}
            className="w-full px-3 py-2 rounded-lg bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 resize-y"
            placeholder="About this trader / strategy…" />
        </T>
      </section>

      {/* Images */}
      <section className="glass rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-semibold">Images</h2>
        <ImageField name="avatar" label="Trader / bot pic (square)" existing={provider?.avatarUrl} aspect="size-16" />
        <ImageField name="feature" label="Feature banner (wide)" existing={provider?.featureUrl} aspect="h-16 w-28" />
      </section>

      {/* Stats */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Stats &amp; compatibility</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <T label="Accuracy / win rate %"><input name="winRate" type="number" step="1" defaultValue={provider?.winRate} className={input} placeholder="68" /></T>
          <T label="Copiers"><input name="copiers" type="number" defaultValue={provider?.copiers} className={input} placeholder="3120" /></T>
          <T label="Buy price ($, 0 = not for sale)"><input name="priceBuy" type="number" defaultValue={provider?.priceBuy} className={input} placeholder="199" /></T>
          <T label="Rent price ($/mo, 0 = off)"><input name="priceRent" type="number" defaultValue={provider?.priceRent} className={input} placeholder="39" /></T>
          <T label="Annual price ($/yr, 0 = off)"><input name="priceAnnual" type="number" defaultValue={provider?.priceAnnual} className={input} placeholder="299" /></T>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <T label="Markets (comma-separated)"><input name="markets" defaultValue={provider?.markets.join(", ")} className={input} placeholder="XAUUSD, NAS100, EURUSD" /></T>
          <T label="Platforms (comma-separated)"><input name="platforms" defaultValue={provider?.platforms.join(", ")} className={input} placeholder="MT4, MT5" /></T>
        </div>
      </section>

      {/* Display */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Display</h2>
        <div>
          <label className={labelCls}>Accent colour (fallback when no pic)</label>
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
            <input type="checkbox" name="featured" defaultChecked={provider?.featured} className="accent-cyan size-4" /> Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="verified" defaultChecked={provider?.verified} className="accent-cyan size-4" /> Verified badge
          </label>
        </div>
      </section>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
          <AlertCircle className="size-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : submitLabel}
        </Button>
      </div>
    </form>
  );
}
