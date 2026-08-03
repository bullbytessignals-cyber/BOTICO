import type { Metadata } from "next";
import { MessagesSquare, Code2, Rocket, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { CustomBotForm } from "./custom-bot-form";

export const metadata: Metadata = {
  title: "Build a Custom Bot",
  description:
    "Get a bespoke trading bot built to your exact strategy for a flat $49.99. Any platform, any market — MT4, MT5, cTrader and more.",
};

const STEPS = [
  { icon: MessagesSquare, title: "1 · Describe it", body: "Fill the form with your strategy, indicators, risk rules and target platform." },
  { icon: Code2, title: "2 · We build it", body: "Our verified developers code and backtest your custom EA to spec." },
  { icon: Rocket, title: "3 · You receive it", body: "Get your bot files, license key and a quick setup guide — ready to run." },
];

const INCLUDED = [
  "Fully custom EA coded to your strategy",
  "Your choice of platform (MT4, MT5, cTrader…)",
  "Backtested & optimised before delivery",
  "Source-safe compiled bot + setup guide",
  "One round of revisions included",
  "Delivered in 3–7 days",
];

export default function CustomBotPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-16">
      {/* Hero */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="violet"><Sparkles className="size-3" /> Custom Bot Studio</Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Get your <span className="text-gradient">own bot</span> built
          </h1>
          <p className="mt-5 text-lg text-muted">
            Can&apos;t find the perfect bot in the marketplace? Have our verified
            developers build one to your exact strategy — any platform, any
            market — for a flat{" "}
            <span className="text-foreground font-semibold">$49.99</span>.
          </p>
        </div>
      </Reveal>

      {/* Steps */}
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
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

      {/* Form + what's included */}
      <div className="mt-14 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <Reveal>
          <CustomBotForm />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-[var(--radius)] glass-strong p-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">$49.99</span>
                <span className="text-muted text-sm">one-time</span>
              </div>
              <p className="mt-1 text-sm text-muted">Flat fee. No subscriptions, no surprises.</p>
              <ul className="mt-5 space-y-2.5">
                {INCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="size-4 mt-0.5 text-success shrink-0" />
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted px-2">
              You&apos;ll only be asked to pay after a developer confirms your
              request is buildable. Trading involves risk; past performance does
              not guarantee future results.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
