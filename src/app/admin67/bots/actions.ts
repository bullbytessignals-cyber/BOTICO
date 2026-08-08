"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAdminPassword } from "@/lib/orders";
import {
  createBot,
  updateBot,
  deleteBot,
  setBotFlag,
  slugify,
  uploadBotFile,
  type BotFormValues,
} from "@/lib/bots-admin";

async function requireAdmin() {
  const pw = (await cookies()).get("botico_admin")?.value ?? "";
  if (!verifyAdminPassword(pw)) redirect("/admin67");
}

function num(fd: FormData, k: string): number {
  const n = Number(fd.get(k));
  return Number.isFinite(n) ? n : 0;
}
function list(fd: FormData, k: string): string[] {
  // supports comma-separated text inputs and repeated checkbox fields
  const multi = fd.getAll(k).map(String).filter(Boolean);
  if (multi.length > 1) return multi;
  return String(fd.get(k) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseForm(fd: FormData): BotFormValues {
  const name = String(fd.get("name") ?? "").trim();
  const slug = slugify(String(fd.get("slug") ?? "") || name);
  return {
    slug,
    name,
    tagline: String(fd.get("tagline") ?? "").trim(),
    description: String(fd.get("description") ?? "").trim(),
    kind: String(fd.get("kind") ?? "") === "crypto" ? "crypto" : "forex",
    developer: String(fd.get("developer") ?? "").trim(),
    categories: fd.getAll("categories").map(String).filter(Boolean),
    platforms: list(fd, "platforms"),
    assets: list(fd, "assets"),
    rating: num(fd, "rating"),
    reviews: Math.round(num(fd, "reviews")),
    downloads: Math.round(num(fd, "downloads")),
    monthlyReturn: num(fd, "monthlyReturn"),
    maxDrawdown: num(fd, "maxDrawdown"),
    winRate: num(fd, "winRate"),
    avgRR: num(fd, "avgRR"),
    minBalance: Math.round(num(fd, "minBalance")),
    recommendedRisk: String(fd.get("recommendedRisk") ?? "").trim(),
    priceBuy: Math.round(num(fd, "priceBuy")),
    priceRent: Math.round(num(fd, "priceRent")),
    priceAnnual: Math.round(num(fd, "priceAnnual")),
    featured: fd.get("featured") === "on",
    verified: fd.get("verified") === "on",
    accent: String(fd.get("accent") ?? "linear-gradient(135deg,#22d3ee,#3b82f6)"),
    filePath: String(fd.get("filePathExisting") ?? "").trim(),
  };
}

/** Upload a new MQL file if one was attached, returning the updated values. */
async function withUploadedFile(fd: FormData, values: BotFormValues): Promise<BotFormValues> {
  const file = fd.get("mqlFile") as File | null;
  if (file && file.size > 0) {
    const path = await uploadBotFile(file, values.slug);
    if (path) return { ...values, filePath: path };
  }
  return values;
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/copy-ea");
  revalidatePath("/developers");
  if (slug) revalidatePath(`/bots/${slug}`);
}

export interface BotFormState {
  error?: string;
}

export async function createBotAction(_prev: BotFormState, fd: FormData): Promise<BotFormState> {
  await requireAdmin();
  let values = parseForm(fd);
  if (!values.name || !values.slug) return { error: "Name is required." };
  values = await withUploadedFile(fd, values);
  const res = await createBot(values);
  if (!res.ok) return { error: res.error };
  revalidatePublic(values.slug);
  redirect("/admin67/bots");
}

export async function updateBotAction(_prev: BotFormState, fd: FormData): Promise<BotFormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  let values = parseForm(fd);
  if (!id) return { error: "Missing bot id." };
  if (!values.name || !values.slug) return { error: "Name is required." };
  values = await withUploadedFile(fd, values);
  const res = await updateBot(id, values);
  if (!res.ok) return { error: res.error };
  revalidatePublic(values.slug);
  redirect("/admin67/bots");
}

export async function deleteBotAction(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) await deleteBot(id);
  revalidatePublic();
  redirect("/admin67/bots");
}

export async function toggleFeaturedAction(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const value = fd.get("value") === "true";
  if (id) await setBotFlag(id, "featured", value);
  revalidatePublic();
  redirect("/admin67/bots");
}
