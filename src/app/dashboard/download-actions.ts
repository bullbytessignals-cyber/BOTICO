"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { listPaymentsByEmail } from "@/lib/payments";
import { getBotFilePathBySlug, getBotFileSignedUrl } from "@/lib/bots-admin";

/**
 * Deliver a bot's EA file — only to a buyer whose "Buy" payment for this bot
 * has been approved. Returns a short-lived signed download URL.
 */
export async function downloadBotFile(fd: FormData) {
  const user = await getCurrentUser();
  const email = user?.email;
  if (!email) redirect("/signin");

  const slug = String(fd.get("slug") ?? "").trim();
  if (!slug) redirect("/dashboard");

  const res = await listPaymentsByEmail(email);
  const entitled =
    res.ok &&
    (res.data ?? []).some(
      (p) =>
        p.itemType === "bot" &&
        p.itemSlug === slug &&
        p.itemPlan === "buy" &&
        p.status === "approved"
    );
  if (!entitled) redirect("/dashboard");

  const path = await getBotFilePathBySlug(slug);
  if (!path) redirect("/dashboard");

  const url = await getBotFileSignedUrl(path);
  if (!url) redirect("/dashboard");

  redirect(url);
}
