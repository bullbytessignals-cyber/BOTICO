import type { Metadata } from "next";
import { DollarSign, Upload, LineChart, ShieldCheck, Globe, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { getDevelopers } from "@/lib/data";
import { formatCompact } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sell a Bot",
  description: "List your Expert Advisor on Botico and reach thousands of traders. Keep 85% of every sale.",
};

const BENEFITS = [
  { icon: DollarSign, title: "Keep 85%", body: "Industry-leading revenue share. Monthly payouts in fiat or crypto." },
  { icon: Globe, title: "Global reach", body: "Get in front of thousands of traders and prop firms from day one." },
  { icon: LineChart, title: "Live analytics", body: "Track sales, downloads, ratings and revenue from your seller dashboard." },
  { icon: ShieldCheck, title: "Verification", body: "Earn a verified badge with an audited live track record to boost trust." },
  { icon: Upload, title: "Easy publishing", body: "Upload MT4/MT5, cTrader or exchange bots with docs, versions and pricing." },
  { icon: Wallet, title: "Buy & rent", body: "Offer lifetime licenses, monthly rentals or both — you set the price." },
];

export default async function DevelopersPage() {
  const developers = await getDevelopers();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <Badge variant="violet">Developer Portal</Badge>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
              Sell your trading bots to the world
            </h1>
            <p className="mt-4 text-muted text-lg">
              List your Expert Advisors on the world&apos;s first AI trading bot
              marketplace. Reach thousands of buyers, keep 85% of every sale and
              get paid monthly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <a
                  href="https://wa.me/923355540093?text=Hi%2C%20I%20want%20to%20sell%20my%20bot%20on%20Botico"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact us to sell <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="https://instagram.com/thesharks0" target="_blank" rel="noopener noreferrer">
                  DM on Instagram
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">
              Send us your bot and details — <span className="text-foreground">we verify your bot first, then list it</span> on the marketplace.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-strong rounded-[var(--radius)] p-6">
            <div className="text-sm text-muted">Top developers on Botico</div>
            <div className="mt-4 space-y-3">
              {developers.slice(0, 5).map((d) => (
                <div key={d.slug} className="flex items-center gap-3">
                  <span className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-cyan to-blue text-[#03121a] font-bold">
                    {d.avatar}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium flex items-center gap-1">
                      {d.name}
                      {d.verified && <ShieldCheck className="size-3.5 text-cyan-bright" />}
                    </div>
                    <div className="text-xs text-muted">{d.bots} bots · {formatCompact(d.followers)} followers</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={(i % 3) * 0.06}>
            <div className="h-full rounded-[var(--radius)] glass p-6">
              <span className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/20 text-cyan-bright">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{b.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Contact to sell */}
      <Reveal>
        <div className="mt-20 relative overflow-hidden rounded-[2rem] glass-strong px-8 py-14 sm:px-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-[460px] rounded-full bg-cyan/20 blur-[120px]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Contact us to sell your bot
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Message us with your bot and details. We&apos;ll review and verify
              it — once approved, we list it on the marketplace for you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg">
                <a href="https://wa.me/923355540093?text=Hi%2C%20I%20want%20to%20sell%20my%20bot%20on%20Botico" target="_blank" rel="noopener noreferrer">
                  WhatsApp: +92 335 5540093
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="https://instagram.com/thesharks0" target="_blank" rel="noopener noreferrer">
                  @thesharks0 on Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
