import { BadgeCheck, Wallet, Boxes, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Verified performance",
    body: "Every listed bot ships with audited live results, real drawdown and win-rate data — no cherry-picked backtests. Buy with confidence.",
    span: "lg:col-span-2",
  },
  {
    icon: Wallet,
    title: "Buy or rent",
    body: "Own a bot outright with a lifetime license, or rent monthly and cancel anytime.",
    span: "",
  },
  {
    icon: CreditCard,
    title: "Secure checkout",
    body: "Pay with card, Apple Pay or crypto (USDT, BTC, ETH). Instant delivery & license key.",
    span: "",
  },
  {
    icon: Boxes,
    title: "Works everywhere",
    body: "Bots compatible with MT4, MT5, cTrader, DXTrade, TradeLocker, MatchTrader plus Binance, Bybit, Bitget and OKX.",
    span: "lg:col-span-2",
  },
  {
    icon: RefreshCw,
    title: "Free updates",
    body: "Full version history and free updates included with every purchase.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Buyer protection",
    body: "30-day money-back guarantee and verified developers on every listing.",
    span: "",
  },
];

export function Features() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            The safest way to buy trading bots
          </h2>
          <p className="mt-3 text-muted">
            Verified results, buyer protection and instant delivery — everything
            a trader or prop firm needs to buy with confidence, in one premium
            marketplace.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.06} className={f.span}>
            <div className="group h-full rounded-[var(--radius)] glass p-6 transition-all duration-300 hover:gradient-border-glow">
              <span className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/20 text-cyan-bright">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
