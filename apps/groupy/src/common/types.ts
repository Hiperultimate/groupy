import type { PrismaClient } from "@groupy/db_prisma";

export type PrismaTransactionalClient = Parameters<
    Parameters<PrismaClient['$transaction']>[0]
>[0];