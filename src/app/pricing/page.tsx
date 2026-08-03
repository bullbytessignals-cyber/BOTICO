import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for buyers and sellers on the Botico marketplace.",
};

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    blurb: "Browse the marketplace and buy your first bot.",
    features: [
      "Full marketplace access",
      "Buy or rent any bot",
      "Verified performance data",
      "1 connected account",
      "Community support",
    ],
    cta: "Get started",
    href: "/signin",
    highlight: false,
  },
  {
    name: "Pro Trader",
    price: "$29",
    period: "/mo",
    blurb: "For active traders running multiple bots.",
    features: [
      "Everything in Starter",
      "Unlimited connected accounts",
      "Advanced analytics & journal",
      "Priority buyer support",
      "Early access to new bots",
      "10% off every purchase",
    ],
    cta: "Start Pro",
    href: "/signin",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "For prop firms, funds and white-label partners.",
    features: [
      "Everything in Pro",
      "White-label marketplace",
      "Dedicated account manager",
      "Bulk licensing & invoicing",
      "API & SDK access",
      "Custom integrations",
    ],
    cta: "Contact sales",
    href: "/signin",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-16">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="cyan"><Sparkles className="size-3" /> Simple, transparent pricing</Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Pricing that scales with you
          </h1>
          <p className="mt-4 text-muted">
            The marketplace is free to browse. You only pay for the bots you buy
            or rent — upgrade for perks and discounts.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3 items-start">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div
              className={`relative rounded-[var(--radius)] p-7 h-full ${
                t.highlight ? "glass-strong gradient-border-glow" : "glass"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="cyan">Most popular</Badge>
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.price}</span>
                <span className="text-muted">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{t.blurb}</p>
              <Button asChild variant={t.highlight ? "primary" : "secondary"} className="w-full mt-6">
                <Link href={t.href}>{t.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="size-4 mt-0.5 text-success shrink-0" />
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Selling bots? Developers keep <span className="text-foreground font-semibold">85%</span> of every sale.{" "}
        <Link href="/developers" className="text-cyan-bright hover:underline">Become a seller →</Link>
      </p>
    </div>
  );
}
