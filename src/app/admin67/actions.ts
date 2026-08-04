"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyAdminPassword,
  isAdminConfigured,
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/orders";
import { setPaymentStatus } from "@/lib/payments";
import type { PaymentStatus } from "@/lib/payments-config";

const COOKIE = "botico_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export interface LoginState {
  error?: string;
}

export async function adminLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const pw = String(formData.get("password") ?? "");
  if (!pw) return { error: "Enter the admin password." };
  if (!isAdminConfigured()) {
    return { error: "Server has no ADMIN_PASSWORD set — add it in Vercel → Settings → Environment Variables (Production), then redeploy." };
  }
  if (!verifyAdminPassword(pw)) {
    return { error: "Wrong password." };
  }

  const store = await cookies();
  store.set(COOKIE, pw, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin67",
    maxAge: MAX_AGE,
  });
  redirect("/admin67");
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/admin67");
}

export async function adminSetStatus(formData: FormData) {
  const store = await cookies();
  const pw = store.get(COOKIE)?.value ?? "";
  if (!verifyAdminPassword(pw)) redirect("/admin67");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (id && status) {
    await updateOrderStatus(id, status);
  }
  redirect("/admin67/orders");
}

export async function adminSetPaymentStatus(formData: FormData) {
  const store = await cookies();
  const pw = store.get(COOKIE)?.value ?? "";
  if (!verifyAdminPassword(pw)) redirect("/admin67");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as PaymentStatus;
  if (id && status) {
    await setPaymentStatus(id, status);
  }
  revalidatePath("/admin67/payments");
  redirect("/admin67/payments");
}
