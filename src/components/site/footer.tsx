import Link from "next/link";
import { Bot } from "lucide-react";

const COLUMNS = [
  {
    title: "Marketplace",
    links: [
      ["Explore Bots", "/marketplace"],
      ["Copy EA", "/copy-ea"],
      ["Custom Bot ($49.99)", "/custom-bot"],
      ["Prop Firm Bots", "/marketplace?category=prop-firm"],
    ],
  },
  {
    title: "Sell",
    links: [
      ["Sell a Bot", "/developers"],
      ["Developer Portal", "/developers"],
      ["Payouts", "/developers"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Account",
    links: [
      ["My Account", "/dashboard"],
      ["My Bots", "/dashboard"],
      ["Subscriptions", "/dashboard"],
      ["Sign in", "/signin"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/"],
      ["Support", "/"],
      ["Pricing", "/pricing"],
      ["Status", "/"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid place-items-center size-9 rounded-xl bg-gradient-to-br from-cyan to-blue text-[#03121a]">
                <Bot className="size-5" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-bold">Botico</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted leading-relaxed">
              The world&apos;s first AI trading bot marketplace. Discover, deploy
              and manage professional Expert Advisors from one dashboard.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted hover:text-cyan-bright transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Botico. All rights reserved.
          </p>
          <p className="text-xs text-muted max-w-xl text-center sm:text-right">
            Trading involves substantial risk. Past performance is not indicative
            of future results. Public-figure strategies are community-created and
            imply no official affiliation.
          </p>
        </div>
      </div>
    </footer>
  );
}
