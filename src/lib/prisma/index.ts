import { PrismaClient } from "@prisma/client";

const client =
  (globalThis as typeof globalThis & { prisma?: PrismaClient }).prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  (globalThis as typeof globalThis & { prisma?: PrismaClient }).prisma = client;
}

export default client;
