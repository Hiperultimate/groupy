import { TRPCError } from "@trpc/server";
import { createGroupData } from "../__factories__/post";
import { beforeEach, describe, expect, it, vi } from "vitest";
import prismaMock from "~/server/__mocks__/db";
import createGroup from "~/server/prismaOperations/createGroup";

describe("createGroup", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Expect error code BAD_REQUEST if isGroup is true and group name is not provided ", async () => {
    const groupInput = createGroupData({
      name: "",
    });

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

  it("Returns serialized post data if createPost API worked", async () => {
    const groupInput = createGroupData();
    prismaMock.group.create.mockResolvedValue(groupInput);
    prismaMock.unreadMessage.create.mockResolvedValue({
      userId: "1231241",
      groupId: "21414512",
      id: "214124",
      unreadMessageCount: 23,
    });

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
    ).resolves.toBe(groupInput);
  });
});
