import { prisma } from "../../utils/prisma";
import redisClient from "../../utils/redis";

const redisPopulateGroup = async (groupId: string) => {
  const checkGroupInRedis = await isGroupInRedis(groupId);
  if (checkGroupInRedis) {
    return;
  }

  // Start populating group data in redis
  await redisCreateGroupUnreadMessages(groupId);
};

const isGroupInRedis = async (groupId: string) => {
  const groupMemberCount = await redisClient.hlen(`unreadMessages:${groupId}`);
  if (groupMemberCount <= 0) {
    return false;
  }
  return true;
};

// This function creates a record in redis which stores all users in the group with their unreadMessagesCount
const redisCreateGroupUnreadMessages = async (groupId: string) => {
  console.log("Initializing unreadMessageCount in redis...");
  // UnreadMessage table contains each group member with unreadMessageCount
  const groupMembers = await prisma.unreadMessage.findMany({
    where: {
      groupId: groupId,
    },
  });

  if (groupMembers.length <= 0) {
    console.log(
      "Unable to populate UnreadMessages in redis, no members found :",
      groupMembers
    );
  }

  const redisBatch = redisClient.multi();
  for (let i = 0; i < groupMembers.length; i++) {
    const userId = groupMembers[i].userId;
    const unreadMessageCount = groupMembers[i].unreadMessageCount;

    // Create unreadMessageCount records in redis
    redisBatch.hset(`unreadMessages:${groupId}`, {
      [userId]: unreadMessageCount,
    });
  }

  await redisBatch.exec();
};

export default redisPopulateGroup;
