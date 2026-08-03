import type { Metadata } from "next";
import Link from "next/link";
import {
  Copy, Link2, Zap, ShieldCheck, SlidersHorizontal, Gauge, ArrowRight, Check,
} from "lucide-react";
import { getCopyProviders, getBots } from "@/lib/data";
import { BotCard } from "@/components/bots/bot-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { formatCompact, formatUsd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Copy EA — Auto-copy star traders",
  description:
    "Buy a Copy EA and automatically mirror every trade from top traders into your MT4/MT5 account — entries, exits and stops, fully hands-free.",
};

const STEPS = [
  { icon: Copy, title: "1 · Pick a trader", body: "Choose a verified star trader or Copy EA whose style and win rate you like." },
  { icon: Link2, title: "2 · Connect your account", body: "Link your MT4, MT5 or cTrader account in a couple of clicks — no VPS hassle." },
  { icon: Zap, title: "3 · Trades auto-copy", body: "Every entry, exit, SL and TP is mirrored into your account in real time, hands-free." },
];

const PERKS = [
  { icon: SlidersHorizontal, title: "Your risk, your rules", body: "Scale lot sizes up or down and cap drawdown per your own risk tolerance." },
  { icon: ShieldCheck, title: "Prop-firm friendly", body: "Copy onto funded and challenge accounts with built-in risk guards." },
  { icon: Gauge, title: "Real-time mirroring", body: "Low-latency copying so your fills track the provider as closely as possible." },
];

export default async function CopyEAPage() {
  const [providers, bots] = await Promise.all([
    getCopyProviders(),
    getBots(),
  ]);
  const copyBots = bots.filter((b) => b.categories.includes("copy-ea"));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-16">
      {/* Hero */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="violet"><Copy className="size-3" /> Copy EA</Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Trade like the pros,{" "}
            <span className="text-gradient">automatically</span>
          </h1>
          <p className="mt-5 text-lg text-muted">
            A Copy EA mirrors every trade from your chosen star trader straight
            into your own MT4/MT5 account — entries, exits, stop loss and take
            profit, completely hands-free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/marketplace?category=copy-ea">Browse Copy EAs <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/custom-bot">Request a custom Copy EA</Link>
            </Button>
          </div>
        </div>
      </Reveal>

      {/* How it works */}
      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="h-full rounded-[var(--radius)] glass p-6">
              <span className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/20 text-cyan-bright">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Star traders */}
      <section className="mt-20">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Star traders you can copy
          </h2>
          <p className="mt-2 text-muted">Verified track records. Community-created strategies — no official affiliation implied.</p>
        </Reveal>
        {providers.length === 0 ? (
          <div className="mt-8 glass rounded-2xl p-16 text-center text-muted">
            Copy EA traders are being onboarded — check back soon.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p, i) => {
              const cprimary =
                p.priceBuy > 0 ? { plan: "buy", price: p.priceBuy, suffix: "" }
                : p.priceRent > 0 ? { plan: "rent", price: p.priceRent, suffix: "/mo" }
                : p.priceAnnual > 0 ? { plan: "annual", price: p.priceAnnual, suffix: "/yr" }
                : { plan: "buy", price: 0, suffix: "" };
              return (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <div className="group relative rounded-[var(--radius)] glass overflow-hidden h-full flex flex-col">
                  {/* Feature banner */}
                  <div className="relative h-28 overflow-hidden" style={{ background: p.accent }}>
                    {p.featureUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.featureUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
                    {p.verified && (
                      <span className="absolute top-3 right-3">
                        <Badge variant="cyan"><ShieldCheck className="size-3" /> Verified</Badge>
                      </span>
                    )}
                  </div>

                  <div className="p-6 -mt-8 relative flex flex-col flex-1">
                    <div className="flex items-center gap-3">
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatarUrl} alt="" className="size-12 rounded-xl object-cover ring-2 ring-background" />
                      ) : (
                        <span className="grid place-items-center size-12 rounded-xl text-[#03121a] font-bold ring-2 ring-background" style={{ background: p.accent }}>
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
                        <p className="text-xs text-cyan-bright">{p.specialty}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-3 border border-border">
                      <div>
                        <div className="text-sm font-semibold text-success">{p.winRate}%</div>
                        <div className="text-[10px] uppercase tracking-wide text-muted">accuracy</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{formatCompact(p.copiers)}</div>
                        <div className="text-[10px] uppercase tracking-wide text-muted">copiers</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.markets.map((m) => <Badge key={m}>{m}</Badge>)}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between mt-auto gap-2">
                      <div className="text-sm min-w-0">
                        <span className="font-semibold">{cprimary.price === 0 ? "Free" : formatUsd(cprimary.price)}</span>
                        <span className="text-muted">{cprimary.suffix}</span>
                      </div>
                      <Button asChild size="sm" className="shrink-0">
                        <Link href={`/checkout?type=copy&slug=${p.slug}&plan=${cprimary.plan}`}>Copy trader</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Perks */}
      <section className="mt-20 grid gap-4 sm:grid-cols-3">
        {PERKS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.06}>
            <div className="h-full rounded-[var(--radius)] glass p-6">
              <span className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/20 text-cyan-bright">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Copy EAs for sale */}
      {copyBots.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Copy EAs for sale</h2>
            <p className="mt-2 text-muted">Buy once and start mirroring trades today.</p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copyBots.map((bot, i) => (
              <Reveal key={bot.slug} delay={(i % 3) * 0.08}>
                <BotCard bot={bot} developerName={bot.developer} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <Reveal>
        <div className="mt-20 relative overflow-hidden rounded-[2rem] glass-strong px-8 py-14 sm:px-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-[460px] rounded-full bg-cyan/20 blur-[120px]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Start copying in <span className="text-gradient">minutes</span>
            </h2>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {["No coding", "Works on MT4/MT5", "Cancel anytime", "Prop-firm safe"].map((f) => (
                <li key={f} className="flex items-center gap-1.5"><Check className="size-4 text-success" /> {f}</li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-7">
              <Link href="/marketplace?category=copy-ea">Browse Copy EAs <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
