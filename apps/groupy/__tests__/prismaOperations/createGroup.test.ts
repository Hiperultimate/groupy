import { TRPCError } from "@trpc/server";
import { createGroupData } from "../__factories__/post";
import { describe, expect, it } from "vitest";
import prismaMock from "~/server/__mocks__/db";
import createGroup from "~/server/prismaOperations/createGroup";

describe("createGroup", () => {
  it("Expect error code BAD_REQUEST if isGroup is true and group name is not provided ", async () => {
    const groupInput = createGroupData({
      name: "",
    });
    // prismaMock.group.create.mockResolvedValue()

    await expect(
      createGroup({
        prisma: prismaMock,
        groupMakerId: groupInput.id,
        groupName: groupInput.name,
        groupImage: groupInput.image,
        minAgeLimit: groupInput.minAgeLimit,
        maxAgeLimit: groupInput.maxAgeLimit,
        size: groupInput.size,
        instantJoin: groupInput.instantJoin,
      })
    ).rejects.toThrow(
      new TRPCError({
        message: "Group name must be provided",
        code: "BAD_REQUEST",
      })
    );
  });
});
