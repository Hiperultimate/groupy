import { NotificationType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import createNotification from "~/server/prismaOperations/createNotification";
import {
  ChatMessageSchema,
  type TChatMessage,
  type TChatRoomMessages,
} from "~/store/atoms/chat";

export const groupRouter = createTRPCRouter({
  getGroupNameFromId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const groupName = await ctx.prisma.group.findFirst({
        where: {
          id: input.id,
        },
        select: {
          name: true,
        },
      });
      if (!groupName) {
        throw new TRPCError({ message: "Group not found", code: "NOT_FOUND" });
      }

      return { status: 200, name : groupName.name };
    }),
  joinGroup: protectedProcedure
    .input(z.object({ groupId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const selectedGroup = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
        },
        include: {
          moderators: true,
        },
      });

      if (!selectedGroup) {
        throw new TRPCError({
          message: "Unable to find group.",
          code: "NOT_FOUND",
        });
      }

      const isAlreadyMember = await ctx.prisma.userGroups.findFirst({
        where: {
          groupId: input.groupId,
          userId: ctx.session.user.id,
        },
      });

      if (isAlreadyMember) {
        return {
          status: 200,
          message: `You are already a member of ${selectedGroup.name}`,
        };
      }

      const groupMemberCount = await ctx.prisma.userGroups.count({
        where: {
          groupId: input.groupId,
        },
      });

      if (!groupMemberCount || selectedGroup.size < groupMemberCount) {
        throw new TRPCError({
          message: `${selectedGroup.name} group has no room. Max limit : ${selectedGroup.size}, size occupied : ${groupMemberCount}`,
          code: "UNAUTHORIZED",
        });
      }

      if (selectedGroup.instantJoin === false) {
        // Send a notification to group admins logic here
        const hasNotificationSent = await ctx.prisma.notification.findFirst({
          where: {
            sendingUserId: ctx.session.user.id,
            groupId: selectedGroup.id,
          },
        });

        if (hasNotificationSent) {
          return {
            status: 200,
            message: "Group request already sent",
          };
        }

        try {
          const selectedGroupModerators = selectedGroup.moderators;
          selectedGroupModerators.map(async (moderator) => {
            await createNotification({
              prisma: ctx.prisma,
              type: NotificationType.JOIN_GROUP_REQUEST,
              currentUserTag: ctx.session.user.atTag,
              groupId: selectedGroup.id,
              receivingUserId: moderator.id,
              senderUserId: ctx.session.user.id,
              groupName: selectedGroup.name,
            });
          });
        } catch (e) {
          throw new TRPCError({
            message:
              "An error occurred while sending group join notification to the moderators.",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return {
          status: 200,
          message: `Request to join group ${selectedGroup.name} sent successfully`,
        };
      }

      try {
        await ctx.prisma.userGroups.create({
          data: {
            userId: ctx.session.user.id,
            groupId: selectedGroup.id,
          },
        });
      } catch (e) {
        console.log("An error occured while user was joining the group : ", e);
        throw new TRPCError({
          message: "An error occured while joining the group",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return {
        status: 200,
        message: `Successfully joined ${selectedGroup.name}`,
      };
    }),

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
