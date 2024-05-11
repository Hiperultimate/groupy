import { PrismaClient } from "@groupy/db_prisma";
import { redis as redisDB } from "@groupy/db_redis/connection";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Requires the following environment variables
// env.REDIS_PORT
// env.REDIS_HOST
// env.REDIS_PASSWORD
export const redis = redisDB;