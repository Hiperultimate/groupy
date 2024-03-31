import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

type CreateGroup = {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  groupMakerId: string;
  groupName: string | undefined;
  groupImage?: string | null;
  minAgeLimit: number;
  maxAgeLimit: number;
  size: number;
  instantJoin: boolean;
};

const createGroup = async ({
  prisma,
  groupMakerId,
  groupName,
  groupImage = null,
  minAgeLimit,
  maxAgeLimit,
  size,
  instantJoin,
}: CreateGroup) => {
  if (!groupName) {
    throw new TRPCError({
      message: "Group name must be provided",
      code: "BAD_REQUEST",
    });
  }

  const group = await prisma.group.create({
    data: {
      name: groupName,
      image: groupImage,
      minAgeLimit,
      maxAgeLimit,
      size,
      instantJoin,
      users: {
        create: {
          userId: groupMakerId,
        },
      },
      moderators: {
        connect: {
          id: groupMakerId,
        },
      },
    },
  });

  return group;
};

export default createGroup;
