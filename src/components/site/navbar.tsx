"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/copy-ea", label: "Copy EA" },
  { href: "/custom-bot", label: "Custom Bot" },
  { href: "/developers", label: "Sell a Bot" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar({ isAuthed = false }: { isAuthed?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname.startsWith("/admin67")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 sm:px-5 h-14 transition-all duration-300",
            scrolled ? "glass-strong shadow-2xl" : "border border-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid place-items-center size-9 rounded-xl bg-gradient-to-br from-cyan to-blue text-[#03121a] shadow-[0_6px_20px_-6px_rgba(34,211,238,0.7)] transition-transform group-hover:scale-105">
              <Bot className="size-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Botico
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3.5 py-2 text-sm rounded-full transition-colors",
                  pathname.startsWith(l.href)
                    ? "text-foreground bg-white/5"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthed ? (
              <Button asChild size="sm">
                <Link href="/dashboard">My Account</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden grid place-items-center size-10 rounded-full text-foreground hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-3xl p-3 animate-rise">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-3 rounded-2xl text-sm text-muted hover:text-foreground hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {isAuthed ? (
                <Button asChild size="sm" className="col-span-2">
                  <Link href="/dashboard">My Account</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/signin">Sign in</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
