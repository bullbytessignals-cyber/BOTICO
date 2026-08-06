import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QRCode from "qrcode";
import { getBotBySlug, getCopyProviderBySlug } from "@/lib/data";
import { CUSTOM_BOT_PRICE } from "@/lib/orders";
import { CRYPTO_METHODS } from "@/lib/payments-config";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

async function buildQrMap() {
  const entries = await Promise.all(
    CRYPTO_METHODS.map(async (m) => {
      try {
        const url = await QRCode.toDataURL(m.address, { margin: 1, width: 240 });
        return [m.id, url] as const;
      } catch {
        return [m.id, ""] as const;
      }
    })
  );
  return Object.fromEntries(entries) as Record<string, string>;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; slug?: string; plan?: string }>;
}) {
  const sp = await searchParams;
  const type = sp.type ?? "bot";
  const slug = sp.slug ?? "";
  const plan = sp.plan === "rent" ? "rent" : sp.plan === "annual" ? "annual" : "buy";

  const qr = await buildQrMap();

  let item = null;

  if (type === "custom") {
    item = {
      type: "custom",
      slug: "",
      name: "Custom Bot Build",
      amount: CUSTOM_BOT_PRICE,
      planLabel: "Custom bot · one-time build",
      kind: "forex" as const,
      collectSetup: false,
    };
  } else if (type === "copy") {
    const provider = slug ? await getCopyProviderBySlug(slug) : null;
    if (provider) {
      const amount =
        plan === "rent" ? provider.priceRent : plan === "annual" ? provider.priceAnnual : provider.priceBuy;
      const planLabel =
        plan === "rent" ? "Copy · monthly" : plan === "annual" ? "Copy · annual" : "Copy EA license";
      item = {
        type: "copy",
        slug: provider.slug,
        name: `${provider.name} — Copy EA`,
        amount,
        planLabel,
        kind: provider.kind,
        collectSetup: true,
        allowCustomConfig: true,
      };
    }
  } else {
    const bot = slug ? await getBotBySlug(slug) : null;
    if (bot) {
      const amount =
        plan === "rent" ? bot.priceRent : plan === "annual" ? bot.priceAnnual : bot.priceBuy;
      const planLabel =
        plan === "rent" ? "Rent · monthly" : plan === "annual" ? "Annual · per year" : "Buy license";
      item = {
        type: "bot",
        slug: bot.slug,
        name: bot.name,
        amount,
        planLabel,
        kind: bot.kind,
        collectSetup: true,
        allowCustomConfig: true,
      };
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-16">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Back to marketplace
      </Link>

      <div className="mt-5 mb-7">
        <h1 className="font-display text-3xl font-bold tracking-tight">Secure checkout</h1>
        <p className="mt-1 text-muted">Pay with crypto, then submit your transaction — we verify and set up your order.</p>
      </div>

      {item ? (
        <CheckoutClient item={item} methods={CRYPTO_METHODS} qr={qr} />
      ) : (
        <div className="glass rounded-[var(--radius)] p-12 text-center">
          <p className="text-muted">We couldn&apos;t find that item.</p>
          <Link href="/marketplace" className="mt-4 inline-block text-cyan-bright hover:underline">Browse the marketplace →</Link>
        </div>
      )}
    </div>
  );
}
