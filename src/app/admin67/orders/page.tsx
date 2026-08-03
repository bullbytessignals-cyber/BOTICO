import { Mail } from "lucide-react";
import { listCustomOrders, ORDER_STATUSES, type CustomOrder, type OrderStatus } from "@/lib/orders";
import { Badge } from "@/components/ui/badge";
import { adminSetStatus } from "../actions";

const STATUS_META: Record<OrderStatus, { label: string; variant: "default" | "cyan" | "success" | "danger" | "violet" }> = {
  new: { label: "New", variant: "cyan" },
  in_progress: { label: "In progress", variant: "violet" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted/70 min-w-20">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

export default async function AdminOrdersPage() {
  const res = await listCustomOrders();
  const orders: CustomOrder[] = res.ok ? (res.data ?? []) : [];
  const backendError = res.ok ? null : res.error;

  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
  const revenue = orders.filter((o) => o.status === "delivered").reduce((a, o) => a + o.price, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Custom bot orders</h1>
      <p className="text-sm text-muted mt-1">{orders.length} total requests</p>

      {backendError && (
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          ⚠ Backend: {backendError}. Run <code>supabase/setup.sql</code> in Supabase if the table isn&apos;t created.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(["new", "in_progress", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
          <div key={s} className="glass rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wide text-muted">{STATUS_META[s].label}</div>
            <div className="mt-1 font-display text-xl font-bold">{count(s)}</div>
          </div>
        ))}
        <div className="glass rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wide text-muted">Revenue</div>
          <div className="mt-1 font-display text-xl font-bold">${revenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-6">
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-muted">
            No custom bot requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const meta = STATUS_META[o.status] ?? STATUS_META.new;
              return (
                <div key={o.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{o.name}</h3>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        <Badge>{o.platform}</Badge>
                        {o.strategyType && <Badge variant="cyan">{o.strategyType}</Badge>}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted flex-wrap">
                        <a href={`mailto:${o.email}`} className="flex items-center gap-1 hover:text-cyan-bright">
                          <Mail className="size-3.5" /> {o.email}
                        </a>
                        {o.contact && <span>· {o.contact}</span>}
                        <span>· {new Date(o.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <form action={adminSetStatus} className="flex items-center gap-2 shrink-0">
                      <input type="hidden" name="id" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="h-9 px-3 rounded-lg bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                      <button className="h-9 px-4 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors">
                        Update
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    {o.markets && <Detail label="Markets" value={o.markets} />}
                    {o.timeframe && <Detail label="Timeframe" value={o.timeframe} />}
                    {o.risk && <Detail label="Risk" value={o.risk} />}
                    {o.indicators && <Detail label="Indicators" value={o.indicators} />}
                  </div>

                  <p className="mt-3 text-sm text-muted whitespace-pre-wrap border-t border-border pt-3">
                    {o.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
