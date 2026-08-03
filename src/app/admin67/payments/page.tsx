import { Mail, ExternalLink, Server, KeyRound, Hash, Wallet } from "lucide-react";
import { listPayments, type Payment } from "@/lib/payments";
import { PAYMENT_STATUSES, type PaymentStatus } from "@/lib/payments-config";
import { Badge } from "@/components/ui/badge";
import { adminSetPaymentStatus } from "../actions";

const STATUS_META: Record<PaymentStatus, { label: string; variant: "cyan" | "success" | "danger" }> = {
  pending: { label: "Pending", variant: "cyan" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
};

function Detail({ icon: Icon, label, value, mono }: { icon?: React.ElementType; label: string; value?: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 items-start">
      <span className="text-muted/70 min-w-24 flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5" />} {label}
      </span>
      <span className={`text-foreground break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

export default async function AdminPaymentsPage() {
  const res = await listPayments();
  const payments: Payment[] = res.ok ? (res.data ?? []) : [];
  const backendError = res.ok ? null : res.error;

  const count = (s: PaymentStatus) => payments.filter((p) => p.status === s).length;
  const revenue = payments.filter((p) => p.status === "approved").reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Deposits &amp; payments</h1>
      <p className="text-sm text-muted mt-1">{payments.length} total submissions</p>

      {backendError && (
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          ⚠ Backend: {backendError}. Run <code>supabase/paywall.sql</code> in Supabase if the table isn&apos;t created.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["pending", "approved", "rejected"] as PaymentStatus[]).map((s) => (
          <div key={s} className="glass rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wide text-muted">{STATUS_META[s].label}</div>
            <div className="mt-1 font-display text-xl font-bold">{count(s)}</div>
          </div>
        ))}
        <div className="glass rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wide text-muted">Approved revenue</div>
          <div className="mt-1 font-display text-xl font-bold">${revenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-6">
        {payments.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-muted">
            No deposits yet. They&apos;ll appear here the moment a buyer submits a payment.
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => {
              const meta = STATUS_META[p.status] ?? STATUS_META.pending;
              const isCrypto = p.itemKind === "crypto";
              return (
                <div key={p.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{p.itemName}</h3>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        <Badge variant={isCrypto ? "violet" : "cyan"}>{isCrypto ? "Crypto" : "Forex"}</Badge>
                        <span className="font-display font-bold text-lg">${p.amount.toFixed(2)}</span>
                        <Badge>{p.coin}</Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted flex-wrap">
                        <span className="text-foreground font-medium">{p.name}</span>
                        {p.contact && <a href={`https://wa.me/${p.contact.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-cyan-bright">{p.contact}</a>}
                        {p.email && (
                          <a href={`mailto:${p.email}`} className="flex items-center gap-1 hover:text-cyan-bright">
                            <Mail className="size-3.5" /> {p.email}
                          </a>
                        )}
                        <span>· {new Date(p.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Approve / Deny */}
                    <div className="flex items-center gap-2 shrink-0">
                      <form action={adminSetPaymentStatus}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button className="h-9 px-4 rounded-lg text-sm font-medium bg-success/15 text-success hover:bg-success/25 transition-colors disabled:opacity-40" disabled={p.status === "approved"}>
                          Approve
                        </button>
                      </form>
                      <form action={adminSetPaymentStatus}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button className="h-9 px-4 rounded-lg text-sm font-medium bg-danger/15 text-danger hover:bg-danger/25 transition-colors disabled:opacity-40" disabled={p.status === "rejected"}>
                          Deny
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Proof + credentials */}
                  <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-5 border-t border-border pt-4">
                    <div className="space-y-2 text-sm min-w-0">
                      <Detail icon={Hash} label="TX hash" value={p.txHash} mono />
                      {isCrypto ? (
                        <>
                          <Detail icon={KeyRound} label="Binance key" value={p.binanceApiKey} mono />
                          <Detail icon={KeyRound} label="Binance secret" value={p.binanceApiSecret} mono />
                        </>
                      ) : (
                        <>
                          <Detail icon={Server} label="MT5 login" value={p.mt5Login} mono />
                          <Detail icon={KeyRound} label="MT5 password" value={p.mt5Password} mono />
                          <Detail icon={Wallet} label="MT5 server" value={p.mt5Server} />
                        </>
                      )}
                    </div>

                    {p.proofUrl && (
                      <a href={p.proofUrl} target="_blank" rel="noreferrer" className="group shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.proofUrl} alt="Payment proof" className="size-28 rounded-xl object-cover border border-border group-hover:border-cyan/50 transition-colors" />
                        <span className="mt-1 flex items-center justify-center gap-1 text-xs text-muted group-hover:text-cyan-bright">
                          <ExternalLink className="size-3" /> Screenshot
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Manual status override */}
                  <form action={adminSetPaymentStatus} className="mt-3 flex items-center gap-2 text-xs">
                    <input type="hidden" name="id" value={p.id} />
                    <span className="text-muted">Set status:</span>
                    <select name="status" defaultValue={p.status} className="h-8 px-2 rounded-lg bg-black/20 border border-border outline-none focus:ring-2 focus:ring-cyan/50">
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                      ))}
                    </select>
                    <button className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Update</button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
