import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] glass-strong px-8 py-16 sm:px-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-cyan/20 blur-[120px]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Find your edge in <span className="text-gradient">minutes</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Join thousands of traders, developers and prop firms buying and
              selling the world&apos;s best trading bots on Botico.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/marketplace">
                  Explore Marketplace <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/signin">Create free account</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
