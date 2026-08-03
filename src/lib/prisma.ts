import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * A Prisma client is only created when DATABASE_URL is set. When it is not
 * (e.g. a fresh clone before you provision Postgres) the app transparently
 * falls back to the bundled seed data — see src/lib/data/index.ts.
 */
export const prisma: PrismaClient | null = process.env.DATABASE_URL
  ? (globalForPrisma.prisma ??
     new PrismaClient({
       log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
     }))
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
