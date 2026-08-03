"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./animated-background";
import type { PlatformStat } from "@/lib/data/types";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ stats }: { stats: PlatformStat[] }) {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16">
      <AnimatedBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted"
          >
            <Sparkles className="size-3.5 text-cyan-bright" />
            The world&apos;s first AI trading bot marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02]"
          >
            <span className="text-gradient">Buy trading bots</span>
            <br />
            built to perform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed"
          >
            Browse and buy High-Frequency, News, Scalping, Smart Money, ICT,
            Copy Trading and AI strategies — for MT4, MT5, cTrader, DXTrade,
            TradeLocker and crypto exchanges. One marketplace, verified results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/marketplace">
                Explore Marketplace <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/developers">Sell Your Bot</Link>
            </Button>
          </motion.div>
        </div>

        {/* Live statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="glass rounded-3xl grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-border overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-6 text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-gradient">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
