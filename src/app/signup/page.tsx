import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Botico account to buy, rent and manage trading bots.",
};

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="relative min-h-screen grid place-items-center px-4 pt-24 pb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-violet/15 blur-[130px]" />
      <div className="relative w-full max-w-md">
        <div className="text-center">
          <span className="inline-grid place-items-center size-12 rounded-2xl bg-gradient-to-br from-cyan to-blue text-[#03121a] shadow-[0_10px_30px_-8px_rgba(34,211,238,0.7)]">
            <Bot className="size-6" strokeWidth={2.4} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-muted text-sm">Join Botico to buy, rent and manage trading bots.</p>
        </div>

        <AuthForm mode="signup" />

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="text-cyan-bright hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
