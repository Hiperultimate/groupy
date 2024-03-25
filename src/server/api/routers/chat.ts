import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  ChatMessageSchema,
  type TChatMessage,
  type TChatRoomMessages,
} from "~/store/atoms/chat";

export const chatRouter = createTRPCRouter({
  getOldMessagesFromRoomId: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .output(z.record(z.string(), z.array(ChatMessageSchema)))
    .query(async ({ ctx, input }) => {
      const previousMessageArr = await ctx.redis.lrange(
        `roomMessages:${input.roomId}`,
        -3, // Start
        -1 // Stop
      );

      const oldMessages = <TChatRoomMessages>{};

      await Promise.all(
        previousMessageArr.map(async (id) => {
          const message = await ctx.redis.hgetall(id);
          console.log(`Message ${id} : `, message);
          if (message) {
            const roomId = message.roomId;
            const messageId = message.id;
            const senderName = message.senderName;
            const senderTag = message.senderTag;
            const sentAt = message.sentAt
              ? new Date(parseInt(message.sentAt))
              : undefined;
            const messageContent = message.message;
            const senderImg = message.senderImg;

            if (
              roomId &&
              messageId &&
              senderName &&
              senderTag &&
              sentAt !== undefined &&
              messageContent !== undefined
            ) {
              const parsedMessage: TChatMessage = {
                id: messageId,
                senderName: senderName,
                senderTag: senderTag,
                sentAt: sentAt,
                message: messageContent,
                senderImg: senderImg ? senderImg : null,
              };

              if (!oldMessages[roomId]) {
                oldMessages[roomId] = [];
              }
              oldMessages[roomId]?.push(parsedMessage);
            }
          }
        })
      );

      return oldMessages;
    }),
});
