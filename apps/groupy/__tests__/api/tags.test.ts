// @vitest-environment node

import type { inferProcedureOutput, inferProcedureInput } from "@trpc/server";
import { beforeEach, describe, it, vi } from "vitest";
import { expect } from "vitest";
import prismaMock from "~/server/__mocks__/db";

import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

type Input = inferProcedureInput<AppRouter["tags"]["relatedTags"]>;
type Output = inferProcedureOutput<AppRouter["tags"]["relatedTags"]>;

describe("relatedTags", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const ctx = createInnerTRPCContext({ session: null });
  const caller = appRouter.createCaller({ ...ctx, prisma: prismaMock });

  it("Fetches related tags using relatedTag procedure", async () => {
    const mockTags = [
      { id: "b4125b3452w34fcqwe", name: "hellfire" },
      { id: "qwce245b1v4523b14", name: "fireflow" },
    ];
    prismaMock.tag.findMany.mockResolvedValue(mockTags);

    const input: Input = "fi";

    const getRelatedTags = await caller.tags.relatedTags(input);
    expect(getRelatedTags).toMatchObject(mockTags);
  });

  it("Returns empty array if relatedTag not found", async () => {
    const mockTags : Output = [];
    prismaMock.tag.findMany.mockResolvedValue(mockTags);

    const input: Input = "uniqueTag";

    const getRelatedTags = await caller.tags.relatedTags(input);
    expect(getRelatedTags).toMatchObject(mockTags);
  });
});
