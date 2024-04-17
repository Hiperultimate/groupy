import type { PrismaClient } from "@groupy/db_prisma";

const dbJoinGroup = async ({
  prisma,
  userId,
  groupId,
}: {
  prisma: PrismaClient;
  groupId: string;
  userId: string;
}) => {
  const joinGroupRequest = prisma.userGroups.create({
    data: {
      userId: userId,
      groupId: groupId,
    },
  });

  const initUnreadMessage = prisma.unreadMessage.create({
    data: {
      userId: userId,
      groupId: groupId,
    },
  });

  await prisma.$transaction([joinGroupRequest, initUnreadMessage]);
};

export default dbJoinGroup;
