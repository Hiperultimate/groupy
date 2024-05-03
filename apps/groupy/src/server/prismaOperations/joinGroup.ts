import type { PrismaClient } from "@groupy/db_prisma";
import type { Redis } from "ioredis";

const dbJoinGroup = async ({
  prisma,
  redis,
  userId,
  groupId,
}: {
  prisma: PrismaClient;
  redis: Redis;
  groupId: string;
  userId: string;
}) => {
  const joinGroupRequestQuery = prisma.userGroups.create({
    data: {
      userId: userId,
      groupId: groupId,
    },
  });

  const initUnreadMessageQuery = prisma.unreadMessage.create({
    data: {
      userId: userId,
      groupId: groupId,
    },
  });

  const groupMemberQuery = prisma.unreadMessage.findMany({
    where: {
      groupId: groupId,
    },
  });

  const [, , groupMembers] =
    await prisma.$transaction([
      joinGroupRequestQuery,
      initUnreadMessageQuery,
      groupMemberQuery,
    ]);

  // Logic to populate data in redis
  const groupMemberCount = await redis.hlen(`unreadMessages:${groupId}`);
  if (groupMemberCount > 0) {
    await redis.hset(`unreadMessages:${groupId}`, userId, 0);
    return;
  }

  // If unreadMessages for groupId does not exist in redis, initialize it
  const redisBatch = redis.multi();
  for (let i = 0; i < groupMembers.length; i++) {
    const groupMember = groupMembers[i];
    const userId = groupMember?.userId;
    const unreadMessageCount = groupMember?.unreadMessageCount;

    if (userId && unreadMessageCount) {
      // Create unreadMessageCount records in redis
      redisBatch.hset(`unreadMessages:${groupId}`, {
        [userId]: unreadMessageCount,
      });
    }
  }

  await redisBatch.exec();
};

export default dbJoinGroup;
