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

/** Resize/compress an image in the browser so uploads stay well under the server limit. */
async function compressImage(file: File, maxDim = 1400, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const dataUrl: string = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result as string);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
    const img: HTMLImageElement = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = dataUrl;
    });
    let { width, height } = img;
    if (Math.max(width, height) > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], (file.name.replace(/\.[^.]+$/, "") || "image") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
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
              onChange={async (e) => {
                const input = e.target;
                const f = input.files?.[0];
                if (!f) { setPreview(existing || null); return; }
                const compressed = await compressImage(f);
                try {
                  const dt = new DataTransfer();
                  dt.items.add(compressed);
                  input.files = dt.files;
                } catch {}
                setPreview(URL.createObjectURL(compressed));
              }}
            />
          </label>
          <p className="mt-1 text-xs text-muted">PNG/JPG — auto-optimized on upload.</p>
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
  const [kind, setKind] = useState<"forex" | "crypto">(provider?.kind ?? "forex");

  return (
    <form action={formAction} className="space-y-8">
      {provider && <input type="hidden" name="id" value={provider.id} />}
      <input type="hidden" name="avatarUrlExisting" value={provider?.avatarUrl ?? ""} />
      <input type="hidden" name="featureUrlExisting" value={provider?.featureUrl ?? ""} />

      {/* Trader */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Trader</h2>

        {/* Market type — shows a badge and drives what buyers submit at checkout */}
        <div>
          <label className={labelCls}>Market type</label>
          <input type="hidden" name="kind" value={kind} />
          <div className="grid grid-cols-2 gap-2 mt-1 max-w-md">
            {([
              { id: "forex", title: "Forex / MT", sub: "Buyer submits MT5 login" },
              { id: "crypto", title: "Crypto", sub: "Buyer submits Binance API" },
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

      {/* Live demo access */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Live demo access <span className="text-xs font-normal text-muted">(optional — lets visitors watch the bot trade)</span></h2>
        <p className="text-xs text-muted">Provide a demo account&apos;s <span className="text-foreground">investor (read-only)</span> password. Visitors can log into MT4/MT5 with it to watch live trades — they cannot trade or withdraw. Leave blank to hide.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <T label="Platform"><input name="demoPlatform" defaultValue={provider?.demoPlatform} className={input} placeholder="MT5" /></T>
          <T label="Server"><input name="demoServer" defaultValue={provider?.demoServer} className={input} placeholder="Exness-MT5Trial8" /></T>
          <T label="Login (account #)"><input name="demoLogin" defaultValue={provider?.demoLogin} className={input} placeholder="12345678" /></T>
          <T label="Investor password"><input name="demoPassword" defaultValue={provider?.demoPassword} className={input} placeholder="read-only pass" /></T>
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
