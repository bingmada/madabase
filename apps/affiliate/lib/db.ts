import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

declare global {
  var __affiliatePrisma__: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getAffiliatePrisma() {
  if (!globalThis.__affiliatePrisma__) {
    globalThis.__affiliatePrisma__ = createPrismaClient();
  }

  return globalThis.__affiliatePrisma__;
}
