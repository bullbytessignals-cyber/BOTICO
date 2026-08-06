"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAdminPassword } from "@/lib/orders";
import {
  createProvider,
  updateProvider,
  deleteProvider,
  uploadProviderImage,
  slugify,
  type ProviderFormValues,
} from "@/lib/copy-admin";

async function requireAdmin() {
  const pw = (await cookies()).get("botico_admin")?.value ?? "";
  if (!verifyAdminPassword(pw)) redirect("/admin67");
}

function num(fd: FormData, k: string) {
  const n = Number(fd.get(k));
  return Number.isFinite(n) ? n : 0;
}
function list(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/copy-ea");
}

export interface ProviderFormState {
  error?: string;
}

async function parse(fd: FormData): Promise<ProviderFormValues | { error: string }> {
  const name = String(fd.get("name") ?? "").trim();
  const slug = slugify(String(fd.get("slug") ?? "") || name);
  if (!name || !slug) return { error: "Trader name is required." };

  let avatarUrl = String(fd.get("avatarUrlExisting") ?? "");
  let featureUrl = String(fd.get("featureUrlExisting") ?? "");

  const avatarFile = fd.get("avatar") as File | null;
  const featureFile = fd.get("feature") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    const url = await uploadProviderImage(avatarFile, slug, "avatar");
    if (url) avatarUrl = url;
  }
  if (featureFile && featureFile.size > 0) {
    const url = await uploadProviderImage(featureFile, slug, "feature");
    if (url) featureUrl = url;
  }

  return {
    slug,
    name,
    kind: String(fd.get("kind") ?? "") === "crypto" ? "crypto" : "forex",
    specialty: String(fd.get("specialty") ?? "").trim(),
    description: String(fd.get("description") ?? "").trim(),
    markets: list(fd, "markets"),
    platforms: list(fd, "platforms"),
    winRate: num(fd, "winRate"),
    copiers: Math.round(num(fd, "copiers")),
    priceBuy: Math.round(num(fd, "priceBuy")),
    priceRent: Math.round(num(fd, "priceRent")),
    priceAnnual: Math.round(num(fd, "priceAnnual")),
    avatarUrl,
    featureUrl,
    accent: String(fd.get("accent") ?? "linear-gradient(135deg,#22d3ee,#3b82f6)"),
    featured: fd.get("featured") === "on",
    verified: fd.get("verified") === "on",
    demoServer: String(fd.get("demoServer") ?? "").trim(),
    demoLogin: String(fd.get("demoLogin") ?? "").trim(),
    demoPassword: String(fd.get("demoPassword") ?? "").trim(),
    demoPlatform: String(fd.get("demoPlatform") ?? "").trim(),
  };
}

export async function createProviderAction(_prev: ProviderFormState, fd: FormData): Promise<ProviderFormState> {
  await requireAdmin();
  const parsed = await parse(fd);
  if ("error" in parsed) return { error: parsed.error };
  const res = await createProvider(parsed);
  if (!res.ok) return { error: res.error };
  revalidatePublic();
  redirect("/admin67/copy-ea");
}

export async function updateProviderAction(_prev: ProviderFormState, fd: FormData): Promise<ProviderFormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (!id) return { error: "Missing provider id." };
  const parsed = await parse(fd);
  if ("error" in parsed) return { error: parsed.error };
  const res = await updateProvider(id, parsed);
  if (!res.ok) return { error: res.error };
  revalidatePublic();
  redirect("/admin67/copy-ea");
}

export async function deleteProviderAction(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) await deleteProvider(id);
  revalidatePublic();
  redirect("/admin67/copy-ea");
}
