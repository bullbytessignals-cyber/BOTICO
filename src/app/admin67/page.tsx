import Link from "next/link";
import { Bot, Inbox, DollarSign, Plus, ArrowRight, Wallet } from "lucide-react";
import { listBotsAdmin } from "@/lib/bots-admin";
import { listCustomOrders } from "@/lib/orders";
import { listPayments } from "@/lib/payments";
import { Button } from "@/components/ui/button";

function Tile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="mt-2 font-display text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

export default async function AdminOverview() {
  const [botsRes, ordersRes, paymentsRes] = await Promise.all([listBotsAdmin(), listCustomOrders(), listPayments()]);
  const bots = botsRes.ok ? (botsRes.data ?? []) : [];
  const orders = ordersRes.ok ? (ordersRes.data ?? []) : [];
  const payments = paymentsRes.ok ? (paymentsRes.data ?? []) : [];
  const backendError = !botsRes.ok ? botsRes.error : !ordersRes.ok ? ordersRes.error : null;

  const newOrders = orders.filter((o) => o.status === "new").length;
  const pendingDeposits = payments.filter((p) => p.status === "pending").length;
  const revenue = payments.filter((p) => p.status === "approved").reduce((a, p) => a + p.amount, 0)
    + orders.filter((o) => o.status === "delivered").reduce((a, o) => a + o.price, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <p className="text-sm text-muted mt-1">Everything on your marketplace at a glance.</p>

      {backendError && (
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          ⚠ Backend: {backendError}. Make sure you ran <code>supabase/setup.sql</code> in your Supabase project.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile icon={Bot} label="Total bots" value={String(bots.length)} />
        <Tile icon={Wallet} label="Pending deposits" value={String(pendingDeposits)} />
        <Tile icon={Inbox} label="New orders" value={String(newOrders)} />
        <Tile icon={DollarSign} label="Revenue" value={`$${revenue.toFixed(2)}`} />
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Bot className="size-4 text-cyan-bright" /> Bots</h2>
          <p className="mt-1 text-sm text-muted">Add, edit and remove the bots shown across the marketplace.</p>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm"><Link href="/admin67/bots/new"><Plus className="size-4" /> Add bot</Link></Button>
            <Button asChild size="sm" variant="secondary"><Link href="/admin67/bots">Manage bots <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Inbox className="size-4 text-cyan-bright" /> Custom orders</h2>
          <p className="mt-1 text-sm text-muted">{newOrders} new · {orders.length} total custom-bot requests.</p>
          <div className="mt-4">
            <Button asChild size="sm" variant="secondary"><Link href="/admin67/orders">View orders <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Wallet className="size-4 text-cyan-bright" /> Deposits</h2>
          <p className="mt-1 text-sm text-muted">{pendingDeposits} pending · {payments.length} total. Approve, deny &amp; view TXIDs and setup details.</p>
          <div className="mt-4">
            <Button asChild size="sm" variant="secondary"><Link href="/admin67/payments">Review deposits <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
