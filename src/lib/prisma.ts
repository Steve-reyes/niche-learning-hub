import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getUrl(): string {
  const url = process.env.DATABASE_URL || "";
  if (url.includes("connection_limit")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return url + sep + "connection_limit=1";
}

process.env.DATABASE_URL = getUrl();

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;