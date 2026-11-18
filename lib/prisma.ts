import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
// Import PrismaClient from the generated client output path
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Server-only database client.
 * WARNING: This file is server-only and must never be imported into a Client Component.
 */

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
