import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, Download, ShieldCheck, Server, Wallet, Gauge, Target,
  TrendingUp, ArrowLeft, Check, ChevronDown,
} from "lucide-react";
import { getBotBySlug, getBots, getDeveloper } from "@/lib/data";
import { listApprovedReviews } from "@/lib/reviews";
import { Sparkline } from "@/components/bots/sparkline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompact, formatUsd } from "@/lib/utils";
import { ReviewForm } from "./review-form";

export async function generateStaticParams() {
  const bots = await getBots();
  return bots.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bot = await getBotBySlug(slug);
  if (!bot) return { title: "Bot not found" };
  return {
    title: bot.name,
    description: bot.tagline,
  };
}

function StatBlock({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-wide">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="mt-2 text-2xl font-semibold font-display tabular-nums">{value}</div>
      {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

export default async function BotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bot = await getBotBySlug(slug);
  if (!bot) notFound();

  const developer = await getDeveloper(bot.developer);
  const reviews = await listApprovedReviews(slug);
  const reviewAvg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : bot.rating;
  const reviewCount = reviews.length;
  const finalEquity = bot.equity[bot.equity.length - 1]?.v ?? 0;
  const startEquity = bot.equity[0]?.v ?? 1;
  const totalReturn = ((finalEquity - startEquity) / startEquity) * 100;

  // Available purchase plans — only those with a price > 0.
  type Plan = { plan: "buy" | "rent" | "annual"; label: string; price: number; suffix: string };
  const plans: Plan[] = [
    bot.priceBuy > 0 && { plan: "buy" as const, label: "Buy license", price: bot.priceBuy, suffix: "one-time" },
    bot.priceRent > 0 && { plan: "rent" as const, label: "Rent monthly", price: bot.priceRent, suffix: "/mo" },
    bot.priceAnnual > 0 && { plan: "annual" as const, label: "Annual", price: bot.priceAnnual, suffix: "/yr" },
  ].filter(Boolean) as Plan[];
  if (plans.length === 0) {
    plans.push({ plan: "buy", label: "Get it free", price: 0, suffix: "free" });
  }
  const primary = plans[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bot.name,
    description: bot.tagline,
    brand: { "@type": "Brand", name: developer?.name ?? "Botico" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: bot.rating,
      reviewCount: bot.reviews,
    },
    offers: {
      "@type": "Offer",
      price: bot.priceBuy,
      priceCurrency: "USD",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-28 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Back to marketplace
      </Link>

      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Main */}
        <div>
          {/* Header */}
          <div className="relative overflow-hidden rounded-[var(--radius)] glass p-6 sm:p-8">
            <div className="absolute -right-16 -top-16 size-64 rounded-full blur-3xl opacity-30" style={{ background: bot.accent }} />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                {bot.verified && (
                  <Badge variant="cyan"><ShieldCheck className="size-3" /> Verified</Badge>
                )}
                <Badge variant={bot.kind === "crypto" ? "violet" : "default"}>
                  {bot.kind === "crypto" ? "Crypto bot" : "Forex bot"}
                </Badge>
                {bot.categories.slice(0, 3).map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">{bot.name}</h1>
              <p className="mt-2 text-muted max-w-2xl">{bot.tagline}</p>
              <div className="mt-4 flex items-center gap-5 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="grid place-items-center size-7 rounded-lg bg-white/5 text-xs font-bold">
                    {developer?.avatar ?? "BO"}
                  </span>
                  {developer?.name ?? bot.developer}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-warning text-warning" /> {bot.rating.toFixed(1)}
                  <span className="text-muted/70">({formatCompact(bot.reviews)})</span>
                </span>
                <span className="flex items-center gap-1">
                  <Download className="size-4" /> {formatCompact(bot.downloads)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="mt-6 rounded-[var(--radius)] glass p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Equity curve</h2>
              <Badge variant="success"><TrendingUp className="size-3" /> +{totalReturn.toFixed(1)}% total</Badge>
            </div>
            <div className="mt-4">
              <Sparkline data={bot.equity} id={`detail-${bot.slug}`} height={220} stroke="#22d3ee" />
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBlock icon={TrendingUp} label="Monthly" value={`+${bot.monthlyReturn}%`} />
              <StatBlock icon={Gauge} label="Max DD" value={`${bot.maxDrawdown}%`} />
              <StatBlock icon={Target} label="Win rate" value={`${bot.winRate}%`} />
              <StatBlock icon={Target} label="Avg RR" value={`1:${bot.avgRR}`} />
            </div>
          </div>

          {/* Specs */}
          <div className="mt-6 grid sm:grid-cols-2 gap-6">
            <div className="rounded-[var(--radius)] glass p-6">
              <h3 className="font-semibold flex items-center gap-2"><Server className="size-4 text-cyan-bright" /> Supported brokers</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {bot.platforms.map((p) => <Badge key={p}>{p}</Badge>)}
              </div>
              <h3 className="mt-6 font-semibold flex items-center gap-2"><Target className="size-4 text-cyan-bright" /> Supported assets</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {bot.assets.map((a) => <Badge key={a} variant="cyan">{a}</Badge>)}
              </div>
            </div>
            <div className="rounded-[var(--radius)] glass p-6">
              <h3 className="font-semibold flex items-center gap-2"><Wallet className="size-4 text-cyan-bright" /> Requirements</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Minimum balance</dt><dd className="font-medium">{formatUsd(bot.minBalance)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Recommended risk</dt><dd className="font-medium">{bot.recommendedRisk}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Reviews</dt><dd className="font-medium">{formatCompact(bot.reviews)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Total downloads</dt><dd className="font-medium">{formatCompact(bot.downloads)}</dd></div>
              </dl>
            </div>
          </div>

          {/* Watch it live — demo (investor) login */}
          {bot.demoLogin && bot.demoPassword && (
            <details className="group mt-6 rounded-[var(--radius)] border border-success/30 bg-success/5 overflow-hidden">
              <summary className="flex items-center gap-2.5 px-6 py-4 cursor-pointer font-semibold text-success list-none">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full size-2.5 bg-success" />
                </span>
                Watch it live — demo login
                <ChevronDown className="demo-chevron size-5 ml-auto" />
              </summary>
              <div className="px-6 pb-5 space-y-2 text-sm">
                <p className="text-muted">Log into {bot.demoPlatform || "MT4/MT5"} with these <span className="text-foreground">read-only</span> details to watch this bot trade live:</p>
                <div className="font-mono text-foreground space-y-1 rounded-xl bg-black/30 p-4 border border-border max-w-md">
                  {bot.demoPlatform && <div><span className="text-muted">Platform: </span>{bot.demoPlatform}</div>}
                  {bot.demoServer && <div><span className="text-muted">Server: </span>{bot.demoServer}</div>}
                  <div><span className="text-muted">Login: </span>{bot.demoLogin}</div>
                  <div><span className="text-muted">Investor pass: </span>{bot.demoPassword}</div>
                </div>
                <p className="text-xs text-muted">Investor password is view-only — no trading or withdrawals possible.</p>
              </div>
            </details>
          )}

          {/* Installation */}
          <div className="mt-6 rounded-[var(--radius)] glass p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">
              {bot.delivery === "managed" ? "How setup works" : "Installation guide"}
            </h3>
            <ol className="mt-4 space-y-3">
              {(bot.delivery === "managed"
                ? [
                    "Choose Buy or Rent and complete secure checkout.",
                    "Submit your MT5 login, password and server at checkout.",
                    "Our team installs & configures the EA on your account.",
                    "You're live — nothing to download or set up yourself.",
                  ]
                : [
                    "Choose Buy or Rent and complete secure checkout.",
                    "After approval, download your EA file from your dashboard.",
                    "Drop the EA into your MT4/MT5, cTrader or exchange account.",
                    "Apply the recommended risk preset and you're live.",
                  ]
              ).map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="grid place-items-center size-6 shrink-0 rounded-full bg-cyan/15 text-cyan-bright text-xs font-semibold">{i + 1}</span>
                  <span className="text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Reviews */}
          <div className="mt-6 rounded-[var(--radius)] glass p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-display text-xl font-semibold">Reviews</h3>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`size-4 ${reviewAvg >= n - 0.25 ? "fill-warning text-warning" : "text-muted/40"}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold">{reviewAvg.toFixed(1)}</span>
                <span className="text-sm text-muted">({reviewCount || formatCompact(bot.reviews)})</span>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="mt-5 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{r.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`size-3.5 ${r.rating >= n ? "fill-warning text-warning" : "text-muted/40"}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="mt-1.5 text-sm text-muted">{r.comment}</p>}
                    <div className="mt-1 text-xs text-muted/70">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <ReviewForm botSlug={bot.slug} />
            </div>
          </div>
        </div>

        {/* Deploy sidebar */}
        <aside className="lg:sticky lg:top-24 h-max">
          <div className="rounded-[var(--radius)] glass-strong p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted">{primary.label}</div>
                {primary.plan === "buy" && bot.priceOriginal > primary.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted line-through">{formatUsd(bot.priceOriginal)}</span>
                    <Badge variant="success">{Math.round((1 - primary.price / bot.priceOriginal) * 100)}% OFF</Badge>
                  </div>
                )}
                <div className="font-display text-3xl font-bold">
                  {primary.price === 0 ? "Free" : formatUsd(primary.price)}
                  <span className="text-sm text-muted font-normal"> {primary.suffix}</span>
                </div>
              </div>
              {plans[1] && (
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide text-muted">{plans[1].label}</div>
                  <div className="font-display text-xl font-semibold">{formatUsd(plans[1].price)}<span className="text-sm text-muted font-normal"> {plans[1].suffix}</span></div>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2">
              {plans.map((p, i) => (
                <Button key={p.plan} asChild size="lg" variant={i === 0 ? "primary" : "secondary"} className="w-full">
                  <Link href={`/checkout?type=bot&slug=${bot.slug}&plan=${p.plan}`}>
                    {p.price === 0 ? "Get it free" : `${p.label} · ${formatUsd(p.price)}`}
                  </Link>
                </Button>
              ))}
            </div>

            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Instant delivery & license key",
                "Works on MT4, MT5 & cTrader",
                "Free updates & version history",
                "30-day money-back guarantee",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted">
                  <Check className="size-4 text-success" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {developer && (
            <div className="mt-4 rounded-[var(--radius)] glass p-6">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-cyan to-blue text-[#03121a] font-bold">
                  {developer.avatar}
                </span>
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    {developer.name}
                    {developer.verified && <ShieldCheck className="size-4 text-cyan-bright" />}
                  </div>
                  <div className="text-xs text-muted">
                    {developer.bots} bots · {formatCompact(developer.followers)} followers
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-muted">{primary.label}</div>
          <div className="font-display text-lg font-bold leading-none">
            {primary.price === 0 ? "Free" : formatUsd(primary.price)}
            <span className="text-xs text-muted font-normal"> {primary.suffix}</span>
          </div>
        </div>
        <Button asChild size="lg" className="flex-1">
          <Link href={`/checkout?type=bot&slug=${bot.slug}&plan=${primary.plan}`}>
            {primary.price === 0 ? "Get it free" : "Get this bot"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
