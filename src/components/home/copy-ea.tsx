import Link from "next/link";
import { Copy, ArrowRight, ShieldCheck } from "lucide-react";
import type { CopyProvider } from "@/lib/data/types";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompact } from "@/lib/utils";

export function CopyEASection({ providers }: { providers: CopyProvider[] }) {
  if (providers.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <Badge variant="violet"><Copy className="size-3" /> Copy EA</Badge>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Copy star traders — automatically
            </h2>
            <p className="mt-3 text-muted">
              Buy a Copy EA once and it mirrors every trade from your chosen
              trader straight into your MT4/MT5 account — entries, exits, stops,
              all hands-free.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/copy-ea">How Copy EA works</Link>
          </Button>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.slice(0, 6).map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.06}>
            <Link
              href="/copy-ea"
              className="group relative block rounded-[var(--radius)] glass p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:gradient-border-glow"
            >
              <div className="absolute -right-8 -top-8 size-32 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: p.accent }} />
              <div className="relative">
                <div className="flex items-center gap-3">
                  {p.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatarUrl} alt="" className="size-11 rounded-xl object-cover" />
                  ) : (
                    <span className="grid place-items-center size-11 rounded-xl text-[#03121a] font-bold" style={{ background: p.accent }}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight flex items-center gap-1">
                      {p.name}
                      {p.verified && <ShieldCheck className="size-3.5 text-cyan-bright" />}
                    </h3>
                    <p className="text-xs text-cyan-bright">{p.specialty}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="text-success font-semibold">{p.winRate}% accuracy</span>
                  <span className="text-muted">{formatCompact(p.copiers)} copiers</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.markets.map((m) => <Badge key={m}>{m}</Badge>)}
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm text-cyan-bright opacity-0 group-hover:opacity-100 transition-opacity">
                  Copy this trader <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
