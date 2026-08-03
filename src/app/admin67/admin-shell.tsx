"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, Copy, Inbox, Wallet, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin67", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin67/bots", label: "Bots", icon: Bot, exact: false },
  { href: "/admin67/copy-ea", label: "Copy EA", icon: Copy, exact: false },
  { href: "/admin67/payments", label: "Deposits", icon: Wallet, exact: false },
  { href: "/admin67/orders", label: "Custom Orders", icon: Inbox, exact: false },
];

export function AdminShell({
  children,
  logout,
}: {
  children: React.ReactNode;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin67" className="flex items-center gap-2">
          <span className="grid place-items-center size-8 rounded-lg bg-gradient-to-br from-cyan to-blue text-[#03121a]">
            <Bot className="size-4" strokeWidth={2.4} />
          </span>
          <span className="font-display font-bold">Botico Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm text-muted hover:text-foreground hover:bg-white/5"
          >
            <ExternalLink className="size-3.5" /> View site
          </Link>
          <form action={logout}>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm text-muted hover:text-danger hover:bg-danger/10">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:flex flex-col w-52 shrink-0 gap-1 md:sticky md:top-24 h-max">
          {NAV.map((it) => {
            const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 h-10 rounded-xl text-sm transition-colors",
                  active
                    ? "bg-cyan/15 text-cyan-bright border border-cyan/20"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                )}
              >
                <it.icon className="size-4" /> {it.label}
              </Link>
            );
          })}
        </aside>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
