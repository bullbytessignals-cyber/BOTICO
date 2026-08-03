"use client";

import { usePathname } from "next/navigation";

export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin67")) return null;
  return <>{children}</>;
}
