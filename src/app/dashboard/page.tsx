import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bot as BotIcon, Clock, DollarSign, Plug, Server, KeyRound, CheckCircle2, ExternalLink,
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { signOutAction } from "@/lib/auth-actions";
import { getBots } from "@/lib/data";
import { listPaymentsByEmail, type Payment } from "@/lib/payments";
import { listJournal, type JournalEntry } from "@/lib/journal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./sidebar";
import { JournalPanel } from "./journal-panel";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your orders and connected accounts.",
};

function mask(v?: string, keep = 4): string {
  if (!v) return "";
  if (v.length <= keep) return "•".repeat(v.length);
  return v.slice(0, keep) + "•".repeat(Math.min(8, v.length - keep));
}

const STATUS_BADGE: Record<string, { label: string; variant: "cyan" | "success" | "danger" }> = {
  pending: { label: "Awaiting approval", variant: "cyan" },
  approved: { label: "Active", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
};

export default async function DashboardPage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/signin");

  const meta = authUser.user_metadata ?? {};
  const user = {
    name: (meta.name as string) || (meta.full_name as string) || "",
    email: authUser.email ?? "",
  };

  const [payRes, bots, journalRes] = await Promise.all([
    listPaymentsByEmail(user.email),
    getBots(),
    listJournal(user.email),
  ]);
  const payments: Payment[] = payRes.ok ? (payRes.data ?? []) : [];
  const journal: JournalEntry[] = journalRes.ok ? (journalRes.data ?? []) : [];
  const botBySlug = new Map(bots.map((b) => [b.slug, b]));

  const approved = payments.filter((p) => p.status === "approved");
  const pending = payments.filter((p) => p.status === "pending");
  const totalSpent = approved.reduce((a, p) => a + p.amount, 0);

  // Connected accounts = the setup credentials the buyer submitted with each order.
  const accounts = payments.filter((p) => p.mt5Login || p.binanceApiKey);

  const kpis = [
    { icon: BotIcon, label: "Active orders", value: String(approved.length), sub: "Approved & set up", tone: "text-success" },
    { icon: Clock, label: "Pending", value: String(pending.length), sub: "Awaiting approval", tone: "text-cyan-bright" },
    { icon: DollarSign, label: "Total spent", value: formatUsd(totalSpent), sub: "On approved orders", tone: "text-foreground" },
    { icon: Plug, label: "Connected accounts", value: String(accounts.length), sub: "MT5 / Binance linked", tone: "text-foreground" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16">
      {/* Header */}
      <div id="top" className="scroll-mt-28 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="grid place-items-center h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-cyan to-blue text-[#03121a] font-bold text-lg uppercase">
            {(user.name || user.email || "T").slice(0, 1)}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">
              Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/marketplace">Browse marketplace</Link>
        </Button>
      </div>

      <div className="mt-8 flex gap-8">
        <DashboardSidebar signOutAction={signOutAction} />

        <div className="flex-1 min-w-0 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                  <k.icon className="size-3.5" /> {k.label}
                </div>
                <div className="mt-2 font-display text-2xl font-bold tabular-nums">{k.value}</div>
                <div className={`text-xs mt-0.5 ${k.tone}`}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* My orders */}
          <section id="my-bots" className="scroll-mt-28">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">My orders</h2>
              <Link href="/marketplace" className="text-sm text-cyan-bright hover:text-cyan">Buy a bot →</Link>
            </div>
            <div className="glass rounded-2xl divide-y divide-border overflow-hidden">
              {payments.length === 0 && (
                <div className="p-10 text-center text-sm text-muted">
                  No orders yet. <Link href="/marketplace" className="text-cyan-bright hover:underline">Browse the marketplace</Link> to buy your first bot.
                </div>
              )}
              {payments.map((p) => {
                const bot = p.itemSlug ? botBySlug.get(p.itemSlug) : undefined;
                const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.pending;
                const accent = bot?.accent ?? "linear-gradient(135deg,#22d3ee,#3b82f6)";
                return (
                  <div key={p.id} className="flex items-center gap-4 p-4">
                    <span className="size-10 rounded-xl shrink-0" style={{ background: accent }} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{p.itemName}</div>
                      <div className="text-xs text-muted truncate">
                        {new Date(p.created_at).toLocaleDateString()} · {p.coin}
                        {p.itemKind === "crypto" ? " · Crypto" : p.itemType === "custom" ? " · Custom build" : " · Forex"}
                      </div>
                    </div>
                    <div className="text-right shrink-0 w-24">
                      <div className="text-sm font-semibold tabular-nums">{formatUsd(p.amount)}</div>
                      <div className="text-[10px] uppercase text-muted">paid</div>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    {bot && (
                      <Link href={`/bots/${bot.slug}`} className="text-muted hover:text-cyan-bright shrink-0">
                        <ExternalLink className="size-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Connected accounts */}
          <section id="connected" className="scroll-mt-28">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Connected accounts</h2>
              <span className="text-sm text-muted flex items-center gap-1"><Plug className="size-4" /> {accounts.length} linked</span>
            </div>
            {accounts.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center text-sm text-muted">
                No accounts linked yet. When you buy a bot, the MT5 or Binance details you submit at checkout appear here.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {accounts.map((p) => {
                  const isCrypto = Boolean(p.binanceApiKey);
                  return (
                    <div key={`acc-${p.id}`} className="glass rounded-2xl p-5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2">
                          {isCrypto ? <KeyRound className="size-4 text-violet" /> : <Server className="size-4 text-cyan-bright" />}
                          {isCrypto ? "Binance API" : "MT5 account"}
                        </span>
                        {p.status === "approved" && (
                          <Badge variant="success"><CheckCircle2 className="size-3" /> Live</Badge>
                        )}
                      </div>
                      <div className="mt-3 space-y-1 text-sm font-mono">
                        {isCrypto ? (
                          <div className="text-muted">Key <span className="text-foreground">{mask(p.binanceApiKey, 6)}</span></div>
                        ) : (
                          <>
                            <div className="text-muted">Login <span className="text-foreground">{p.mt5Login}</span></div>
                            <div className="text-muted">Server <span className="text-foreground">{p.mt5Server}</span></div>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-muted truncate">for {p.itemName}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Trading journal */}
          <JournalPanel entries={journal} />
        </div>
      </div>
    </div>
  );
}
