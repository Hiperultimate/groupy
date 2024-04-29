import redisClient from "../utils/redis";
import { isGroupInRedis } from "./common/redisCheckGroup";

const increaseUnreadMessageCount = async ({
  groupId,
  senderId,
}: {
  groupId: string;
  senderId: string;
}) => {
  const checkGroupInRedis = await isGroupInRedis(groupId);
  if (!checkGroupInRedis) {
    console.log("Group not found in redis");
    return;
  }

  const activeUser = await redisClient.smembers(
    `activeGroupMembers:${groupId}`
  );
  const activeUserSet = new Set(activeUser);
  const groupMembers = await redisClient.hgetall(`unreadMessages:${groupId}`);
  const batch = redisClient.pipeline();
  for (const memberId in groupMembers) {
    if (memberId !== senderId && !activeUserSet.has(memberId)) {
      batch.hincrby(`unreadMessages:${groupId}`, memberId, 1);
    }
  }
  await batch.exec();
};

export { increaseUnreadMessageCount };
