import Link from "next/link";
import { Plus, Star, ShieldCheck, Pencil, Trash2, Copy } from "lucide-react";
import { listProvidersAdmin } from "@/lib/copy-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCompact, formatUsd } from "@/lib/utils";
import { deleteProviderAction } from "./actions";

export default async function AdminCopyEAPage() {
  const res = await listProvidersAdmin();
  const providers = res.ok ? (res.data ?? []) : [];
  const backendError = res.ok ? null : res.error;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Copy EA traders</h1>
          <p className="text-sm text-muted mt-1">{providers.length} trader{providers.length === 1 ? "" : "s"} available to copy</p>
        </div>
        <Button asChild><Link href="/admin67/copy-ea/new"><Plus className="size-4" /> Add trader</Link></Button>
      </div>

      {backendError && (
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          ⚠ Backend: {backendError}. Run the Copy EA SQL (creates <code>copy_providers</code>) in Supabase.
        </div>
      )}

      {providers.length === 0 ? (
        <div className="mt-6 glass rounded-2xl p-16 text-center">
          <p className="text-muted">No Copy EA traders yet. Add one with a pic, accuracy and pricing.</p>
          <Button asChild className="mt-4"><Link href="/admin67/copy-ea/new"><Plus className="size-4" /> Add your first trader</Link></Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {providers.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              {p.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatarUrl} alt="" className="size-11 rounded-xl object-cover shrink-0" />
              ) : (
                <span className="grid place-items-center size-11 rounded-xl text-[#03121a] font-bold shrink-0" style={{ background: p.accent }}>
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate flex items-center gap-1">
                    <Copy className="size-3.5 text-cyan-bright" /> {p.name}
                  </span>
                  {p.featured && <Badge variant="cyan"><Star className="size-3" /> Featured</Badge>}
                  {p.verified && <Badge variant="success"><ShieldCheck className="size-3" /> Verified</Badge>}
                  {p.kind === "crypto" && <Badge variant="violet">Crypto</Badge>}
                </div>
                <div className="text-xs text-muted truncate">
                  {p.specialty || "—"} · {p.winRate}% accuracy · {formatCompact(p.copiers)} copiers
                </div>
              </div>
              <div className="hidden sm:block text-right shrink-0 w-24">
                <div className="text-sm font-semibold">{p.priceBuy === 0 ? "Free" : formatUsd(p.priceBuy)}</div>
                <div className="text-[10px] uppercase text-muted">{formatUsd(p.priceRent)}/mo</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin67/copy-ea/${p.id}`} title="Edit" className="grid place-items-center size-9 rounded-lg text-muted hover:text-cyan-bright hover:bg-white/10">
                  <Pencil className="size-4" />
                </Link>
                <form action={deleteProviderAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button title="Delete" className="grid place-items-center size-9 rounded-lg text-muted hover:text-danger hover:bg-danger/10">
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
