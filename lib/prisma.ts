import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // <-- Isso mostra no terminal as queries feitas. (pode tirar se quiser)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
