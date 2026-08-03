import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyAdminPassword } from "@/lib/orders";
import { AdminLogin } from "./login-form";
import { AdminShell } from "./admin-shell";
import { adminLogout } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pw = (await cookies()).get("botico_admin")?.value ?? "";
  if (!verifyAdminPassword(pw)) return <AdminLogin />;

  return <AdminShell logout={adminLogout}>{children}</AdminShell>;
}
