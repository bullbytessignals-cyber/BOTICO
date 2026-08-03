import Link from "next/link";
import { Plus, Star, ShieldCheck, Pencil, Trash2, ExternalLink } from "lucide-react";
import { listBotsAdmin } from "@/lib/bots-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCompact, formatUsd } from "@/lib/utils";
import { deleteBotAction, toggleFeaturedAction } from "./actions";

export default async function AdminBotsPage() {
  const res = await listBotsAdmin();
  const bots = res.ok ? (res.data ?? []) : [];
  const backendError = res.ok ? null : res.error;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Bots</h1>
          <p className="text-sm text-muted mt-1">{bots.length} bot{bots.length === 1 ? "" : "s"} on the marketplace</p>
        </div>
        <Button asChild><Link href="/admin67/bots/new"><Plus className="size-4" /> Add bot</Link></Button>
      </div>

      {backendError && (
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          ⚠ Backend: {backendError}. Run <code>supabase/setup.sql</code> in Supabase to create the <code>bots</code> table.
        </div>
      )}

      {bots.length === 0 ? (
        <div className="mt-6 glass rounded-2xl p-16 text-center">
          <p className="text-muted">No bots yet. Add your first one to populate the marketplace.</p>
          <Button asChild className="mt-4"><Link href="/admin67/bots/new"><Plus className="size-4" /> Add your first bot</Link></Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bots.map((b) => (
            <div key={b.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <span className="size-10 rounded-xl shrink-0" style={{ background: b.accent }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate">{b.name}</span>
                  {b.featured && <Badge variant="cyan"><Star className="size-3" /> Featured</Badge>}
                  {b.verified && <Badge variant="success"><ShieldCheck className="size-3" /> Verified</Badge>}
                </div>
                <div className="text-xs text-muted truncate">
                  {b.developer || "—"} · {b.categories.length} categories · {formatCompact(b.downloads)} downloads
                </div>
              </div>
              <div className="hidden sm:block text-right shrink-0 w-24">
                <div className="text-sm font-semibold">{b.priceBuy === 0 ? "Free" : formatUsd(b.priceBuy)}</div>
                <div className="text-[10px] uppercase text-muted">{formatUsd(b.priceRent)}/mo</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <form action={toggleFeaturedAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="value" value={(!b.featured).toString()} />
                  <button title="Toggle featured" className={`grid place-items-center size-9 rounded-lg hover:bg-white/10 ${b.featured ? "text-warning" : "text-muted"}`}>
                    <Star className={`size-4 ${b.featured ? "fill-warning" : ""}`} />
                  </button>
                </form>
                <Link href={`/bots/${b.slug}`} title="View" className="grid place-items-center size-9 rounded-lg text-muted hover:text-foreground hover:bg-white/10">
                  <ExternalLink className="size-4" />
                </Link>
                <Link href={`/admin67/bots/${b.id}`} title="Edit" className="grid place-items-center size-9 rounded-lg text-muted hover:text-cyan-bright hover:bg-white/10">
                  <Pencil className="size-4" />
                </Link>
                <form action={deleteBotAction}>
                  <input type="hidden" name="id" value={b.id} />
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
