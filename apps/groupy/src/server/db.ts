import { PrismaClient } from "db_prisma";
import { Redis } from "ioredis";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const redis = new Redis({
  port: Number(env.REDIS_PORT), // Redis port
  host: String(env.REDIS_HOST), // Redis host
  username: "default", // needs Redis >= 6
  password: env.REDIS_PASSWORD,
});
