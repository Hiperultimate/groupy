import redisClient from "../../utils/redis";

const isGroupInRedis = async (groupId: string) => {
  const groupMemberCount = await redisClient.hlen(`unreadMessages:${groupId}`);
  if (groupMemberCount <= 0) {
    console.log("Group not found in redis");
    return false;
  }
  return true;
};

export default isGroupInRedis;
