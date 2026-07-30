import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Prisma 7 uses node-pg instead of the Rust query engine, which changed
  // SSL certificate validation defaults and breaks Supabase's connection
  // in some serverless runtimes (P1010). See Prisma's v7 upgrade guide.
  ssl: { rejectUnauthorized: false },
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
