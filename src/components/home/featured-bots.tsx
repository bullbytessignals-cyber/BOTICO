import Link from "next/link";
import type { Bot } from "@/lib/data/types";
import { BotCard } from "@/components/bots/bot-card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function FeaturedBots({ bots }: { bots: Bot[] }) {
  return (
    <section className="relative py-24 border-y border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Featured &amp; verified bots
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Audited live track records from top developers. Buy once or rent
                monthly — with verified performance on every card.
              </p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/marketplace">Browse all bots</Link>
            </Button>
          </div>
        </Reveal>

        {bots.length === 0 ? (
          <div className="mt-10 glass rounded-2xl p-16 text-center text-muted">
            New bots are landing soon — check back shortly.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bots.slice(0, 6).map((bot, i) => (
              <Reveal key={bot.slug} delay={(i % 3) * 0.08}>
                <BotCard bot={bot} developerName={bot.developer} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
