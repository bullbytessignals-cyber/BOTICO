import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { FooterGate } from "@/components/site/footer-gate";
import { FloatingContact } from "@/components/site/floating-contact";
import { getCurrentUser } from "@/lib/supabase/auth-server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thebotico.com"),
  title: {
    default: "Botico — The World's First AI Trading Bot Marketplace",
    template: "%s · Botico",
  },
  description:
    "Discover, buy, rent, customize, deploy and manage professional Expert Advisors, trading bots and AI strategies for MT4, MT5, cTrader, DXTrade and crypto exchanges — from one dashboard.",
  keywords: [
    "trading bots",
    "expert advisors",
    "MT4",
    "MT5",
    "AI trading",
    "algorithmic trading",
    "prop firm bots",
    "copy trading",
  ],
  openGraph: {
    title: "Botico — The World's First AI Trading Bot Marketplace",
    description:
      "Deploy professional trading bots in minutes. HFT, News, Scalping, Smart Money, ICT, Copy Trading, AI Strategies and more.",
    url: "https://www.thebotico.com",
    siteName: "Botico",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar isAuthed={Boolean(user)} />
        <main className="flex-1">{children}</main>
        <FooterGate>
          <Footer />
        </FooterGate>
        <FloatingContact />
      </body>
    </html>
  );
}
