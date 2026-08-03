"use client";

import Link from "next/link";
import { LayoutDashboard, Bot, Plug, BookOpen, LogOut } from "lucide-react";

const ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "#top" },
  { icon: Bot, label: "My Orders", href: "#my-bots" },
  { icon: Plug, label: "Connected Accounts", href: "#connected" },
  { icon: BookOpen, label: "Trading Journal", href: "#journal" },
];

export function DashboardSidebar({ signOutAction }: { signOutAction: () => Promise<void> }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 gap-1 lg:sticky lg:top-24 h-max">
      {ITEMS.map((it) => (
        <Link
          key={it.label}
          href={it.href}
          className="flex items-center gap-3 px-3.5 h-10 rounded-xl text-sm transition-colors text-left text-muted hover:text-foreground hover:bg-white/5"
        >
          <it.icon className="size-4" /> {it.label}
        </Link>
      ))}
      <form action={signOutAction} className="mt-2 pt-2 border-t border-border">
        <button className="flex w-full items-center gap-3 px-3.5 h-10 rounded-xl text-sm text-muted hover:text-danger hover:bg-danger/10 transition-colors">
          <LogOut className="size-4" /> Sign out
        </button>
      </form>
    </aside>
  );
}
