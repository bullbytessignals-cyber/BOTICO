import Link from "next/link";
import { Star, Download, ShieldCheck, ArrowUpRight } from "lucide-react";
import type { Bot } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "./sparkline";
import { cn, formatCompact, formatUsd } from "@/lib/utils";

function Stat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  return (
    <div>
      <div
        className={cn(
          "text-sm font-semibold tabular-nums",
          tone === "up" && "text-success",
          tone === "down" && "text-danger"
        )}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-muted mt-0.5">{label}</div>
    </div>
  );
}

export function BotCard({ bot, developerName }: { bot: Bot; developerName: string }) {
  const strokeColor = bot.monthlyReturn >= 0 ? "#22d3ee" : "#fb7185";

  return (
    <Link
      href={`/bots/${bot.slug}`}
      className="group relative flex flex-col rounded-[var(--radius)] glass overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:gradient-border-glow"
    >
      {/* accent header */}
      <div className="relative h-24 overflow-hidden" style={{ background: bot.accent }}>
        <div className="absolute inset-0 opacity-40 grid-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center size-8 rounded-lg bg-black/30 backdrop-blur text-xs font-bold text-white">
              {developerName.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-xs font-medium text-white/90 drop-shadow">{developerName}</span>
          </div>
          {bot.verified && (
            <span className="grid place-items-center size-7 rounded-full bg-black/30 backdrop-blur">
              <ShieldCheck className="size-4 text-white" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 -mt-8 relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-cyan-bright transition-colors">
              {bot.name}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-warning text-warning" /> {bot.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3.5" /> {formatCompact(bot.downloads)}
              </span>
            </div>
          </div>
          <ArrowUpRight className="size-5 text-muted opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
        </div>

        <p className="mt-2 text-sm text-muted line-clamp-2 min-h-[2.5rem]">{bot.tagline}</p>

        <div className="mt-3 -mx-1">
          <Sparkline data={bot.equity} stroke={strokeColor} id={bot.slug} height={48} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-black/20 p-3 border border-border">
          <Stat label="Monthly" value={`+${bot.monthlyReturn}%`} tone="up" />
          <Stat label="Max DD" value={`${bot.maxDrawdown}%`} tone="down" />
          <Stat label="Win Rate" value={`${bot.winRate}%`} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {bot.platforms.slice(0, 3).map((p) => (
            <Badge key={p}>{p}</Badge>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted">Pricing</div>
            <div className="text-base font-semibold">
              {bot.priceBuy > 0
                ? formatUsd(bot.priceBuy)
                : bot.priceRent > 0
                ? <>{formatUsd(bot.priceRent)}<span className="text-muted font-normal text-sm">/mo</span></>
                : bot.priceAnnual > 0
                ? <>{formatUsd(bot.priceAnnual)}<span className="text-muted font-normal text-sm">/yr</span></>
                : "Free"}
              {bot.priceBuy > 0 && bot.priceRent > 0 && (
                <span className="text-muted font-normal text-sm"> · {formatUsd(bot.priceRent)}/mo</span>
              )}
            </div>
          </div>
          <span className="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-semibold bg-white/5 group-hover:bg-gradient-to-r group-hover:from-cyan group-hover:to-blue group-hover:text-[#03121a] transition-all">
            Buy Now
          </span>
        </div>
      </div>
    </Link>
  );
}
