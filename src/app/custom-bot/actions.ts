"use server";

import { redirect } from "next/navigation";
import { createCustomOrder, type CustomOrderInput } from "@/lib/orders";

export interface SubmitState {
  ok: boolean;
  error?: string;
  done?: boolean;
}

export async function submitCustomBot(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const input: CustomOrderInput = {
    name: get("name"),
    email: get("email"),
    contact: get("contact"),
    platform: get("platform"),
    strategyType: get("strategyType"),
    markets: get("markets"),
    timeframe: get("timeframe"),
    risk: get("risk"),
    indicators: get("indicators"),
    description: get("description"),
  };

  if (!input.name || !input.email || !input.platform || !input.description) {
    return { ok: false, error: "Please fill in your name, email, platform and a description." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const res = await createCustomOrder(input);
  if (!res.ok) return { ok: false, error: res.error };

  // Request saved — send the buyer to the crypto paywall to pay the build fee.
  redirect("/checkout?type=custom&plan=buy");
}
