const redisEvent = {
    "activeGroupMembers": (groupId: string) => `activeGroupMembers:${groupId}` as const,
    "unreadMessages" : (groupId: string) => `unreadMessages:${groupId}` as const,
    "roomMessages" : (groupId: string) => `roomMessages:${groupId}` as const
}

export default redisEvent;
