"use server";

import { createPayment, uploadProof } from "@/lib/payments";
import { CUSTOM_CONFIG_FEE } from "@/lib/payments-config";
import { revalidatePath } from "next/cache";

export interface CheckoutState {
  error?: string;
  done?: boolean;
}

export async function submitPayment(_prev: CheckoutState, fd: FormData): Promise<CheckoutState> {
  const get = (k: string) => String(fd.get(k) ?? "").trim();

  const name = get("name");
  const countryCode = get("countryCode");
  const contact = get("contact");
  const coin = get("coin");
  const itemKind = get("itemKind") === "crypto" ? "crypto" : "forex";
  const collectSetup = get("collectSetup") === "1";
  const txHash = get("txHash");
  const proofFile = fd.get("proof") as File | null;

  if (!name || !contact) return { error: "Please enter your name and WhatsApp number." };
  if (!coin) return { error: "Please choose a payment method." };
  if (!txHash && !(proofFile && proofFile.size > 0)) {
    return { error: "Add your transaction hash/ID or upload a payment screenshot." };
  }

  // Setup credentials — depends on bot type.
  const mt5Login = get("mt5Login");
  const mt5Password = get("mt5Password");
  const mt5Server = get("mt5Server");
  const binanceApiKey = get("binanceApiKey");
  const binanceApiSecret = get("binanceApiSecret");

  if (collectSetup) {
    if (itemKind === "crypto") {
      if (!binanceApiKey || !binanceApiSecret) {
        return { error: "Add your Binance API key and secret so we can set up your crypto bot." };
      }
    } else {
      if (!mt5Login || !mt5Password || !mt5Server) {
        return { error: "Add your MT5 login, password and server so we can install your bot." };
      }
    }
  }

  let proofUrl: string | undefined;
  if (proofFile && proofFile.size > 0) {
    const url = await uploadProof(proofFile);
    if (url) proofUrl = url;
  }

  const fullContact = countryCode ? `${countryCode} ${contact}` : contact;

  // Optional custom configuration add-on (+$10 one-time).
  const customConfig = get("customConfig") === "1";
  const customConfigDetails = get("customConfigDetails");
  const baseAmount = Number(get("amount")) || 0;
  const amount = baseAmount + (customConfig ? CUSTOM_CONFIG_FEE : 0);

  const res = await createPayment({
    itemType: get("itemType") || "bot",
    itemSlug: get("itemSlug"),
    itemName: get("itemName") || "Order",
    itemKind,
    itemPlan: get("itemPlan") || "buy",
    amount,
    coin,
    name,
    countryCode,
    contact: fullContact,
    email: get("email"),
    mt5Login: itemKind === "forex" ? mt5Login : undefined,
    mt5Password: itemKind === "forex" ? mt5Password : undefined,
    mt5Server: itemKind === "forex" ? mt5Server : undefined,
    binanceApiKey: itemKind === "crypto" ? binanceApiKey : undefined,
    binanceApiSecret: itemKind === "crypto" ? binanceApiSecret : undefined,
    customConfig: customConfig ? (customConfigDetails || "Custom configuration requested") : undefined,
    txHash,
    proofUrl,
  });

  if (!res.ok) return { error: res.error };
  revalidatePath("/admin67/payments");
  return { done: true };
}
