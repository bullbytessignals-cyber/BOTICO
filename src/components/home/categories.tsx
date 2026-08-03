import Link from "next/link";
import type { Category } from "@/lib/data/types";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";

export function Categories({ categories }: { categories: Category[] }) {
  const top = categories.filter((c) => c.group === "strategy").slice(0, 12);

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Every strategy, one marketplace
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Browse 30+ curated categories — from ultra-low-latency HFT to
              adaptive AI models and institutional smart-money concepts.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-sm text-cyan-bright hover:text-cyan transition-colors"
          >
            View all categories →
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {top.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 4) * 0.05}>
            <Link
              href={`/marketplace?category=${c.slug}`}
              className="group flex flex-col h-full rounded-2xl glass p-5 transition-all duration-300 hover:-translate-y-1 hover:gradient-border-glow"
            >
              <span className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/20 text-cyan-bright group-hover:scale-110 transition-transform">
                <CategoryIcon name={c.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{c.blurb}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
