import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * When DATABASE_URL is set we persist users/sessions in Postgres through the
 * Prisma adapter. Without a database we fall back to stateless JWT sessions so
 * the app still boots and OAuth can be wired incrementally.
 *
 * Provider credentials are read from the environment:
 *   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
 *   AUTH_GITHUB_ID / AUTH_GITHUB_SECRET
 *   AUTH_SECRET
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  session: { strategy: prisma ? "database" : "jwt" },
  providers: [Google, GitHub],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id ?? (token?.sub as string) ?? session.user.id;
      }
      return session;
    },
  },
});
