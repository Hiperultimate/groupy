import type { PrismaClient } from "@groupy/db_prisma";
import { beforeEach } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(prismaMock);
});

const prismaMock = mockDeep<PrismaClient>();
export default prismaMock as unknown as DeepMockProxy<PrismaClient>;
