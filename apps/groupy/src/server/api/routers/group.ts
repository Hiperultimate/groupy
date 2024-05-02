import { NotificationType } from "@groupy/db_prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import createNotification from "~/server/prismaOperations/createNotification";
import dbJoinGroup from "~/server/prismaOperations/joinGroup";
import {
  ChatMessageSchema,
  type TChatMessage,
  type TChatRoomMessages,
} from "~/store/atoms/chat";

export const groupRouter = createTRPCRouter({
  getCurrentUserGroupOptions: protectedProcedure.query(async ({ ctx }) => {
    // Currently in progress
    const currentUser = ctx.session.user;
    const userGroups = await ctx.prisma.userGroups.findMany({
      where: { userId: currentUser.id },
      select: {
        group: {
          include: {
            // userUnreadMessage will contain only 1 item in array which will contain unreadMessageCount for the specific group
            userUnreadMessage: {
              where: { userId: currentUser.id },
              select: {
                unreadMessageCount: true,
              },
            },

            messages: {
              orderBy: { sentAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });
    const userChatOptions = await Promise.all(
      userGroups.map(async (groupObj) => {
        const group = groupObj.group;
        const lastMessageInPrisma = group.messages[0];
        const lastRedisMessageArr = await ctx.redis.lrange(
          `roomMessages:${group.id}`,
          -1,
          -1
        );
        const lastRedisMessageId = lastRedisMessageArr[0];
        // If redis has any data, that is the latest one. Simply return it
        if (lastRedisMessageId) {
          const lastRedisMessage = await ctx.redis.hgetall(lastRedisMessageId);
          return {
            roomID: group.id,
            chatName: group.name,
            chatImg: group.image,
            chatLastMsg: lastRedisMessage.message ? lastRedisMessage.message : null,
            lastMsgSentAt: lastRedisMessage
              ? new Date(Number(lastRedisMessage.sentAt as string))
              : null,
            unreadMsgCount: 0,
          };
        }

        // Returning last prisma message
        return {
          roomID: group.id,
          chatName: group.name,
          chatImg: group.image,
          chatLastMsg: lastMessageInPrisma ? lastMessageInPrisma.message : null,
          lastMsgSentAt: lastMessageInPrisma
            ? lastMessageInPrisma.sentAt
            : null,
          unreadMsgCount: group.userUnreadMessage[0]
            ? group.userUnreadMessage[0].unreadMessageCount
            : 0,
        };
      })
    );

    return userChatOptions;
  }),
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

      return { status: 200, name: groupName.name };
    }),

  acceptJoinGroupRequest: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const selectedNotification = await ctx.prisma.notification.findFirst({
        where: {
          id: input.notificationId,
        },
      });

      if (
        !selectedNotification ||
        !selectedNotification.groupId ||
        !selectedNotification.sendingUserId
      ) {
        throw new TRPCError({
          message: "Invalid notification: Not a group join request",
          code: "NOT_FOUND",
        });
      }

      try {
        await dbJoinGroup({
          prisma: ctx.prisma,
          redis : ctx.redis,
          userId: selectedNotification.sendingUserId,
          groupId: selectedNotification.groupId,
        });
      } catch (err) {
        console.log("An error occurred while joining group :", err);
        throw new TRPCError({
          message: "Invalid groupID or userId",
          code: "BAD_REQUEST",
        });
      }

      try {
        // Deleting all related notifications from moderators notification
        await ctx.prisma.notification.deleteMany({
          where: {
            sendingUserId: selectedNotification.sendingUserId,
            groupId: selectedNotification.groupId,
          },
        });
      } catch (e) {
        throw new TRPCError({
          message: `An error occured while deleting join notification for ${selectedNotification.sendingUserId} : ${selectedNotification.groupId}`,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return { status: 200, message: "Group join request successfull" };
    }),

  rejectJoinGroupRequest: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const selectedNotification = await ctx.prisma.notification.findFirst({
        where: {
          id: input.notificationId,
        },
      });

      if (
        !selectedNotification ||
        !selectedNotification.groupId ||
        !selectedNotification.sendingUserId
      ) {
        throw new TRPCError({
          message: "Invalid notification: Not a group join request",
          code: "NOT_FOUND",
        });
      }

      const groupName = await ctx.prisma.group.findFirst({
        where: {
          id: selectedNotification.groupId,
        },
        select: {
          name: true,
        },
      });

      if (!groupName) {
        throw new TRPCError({ message: "Invalid group", code: "NOT_FOUND" });
      }

      await ctx.prisma.notification.create({
        data: {
          type: NotificationType.MESSAGE,
          receivingUserId: selectedNotification.sendingUserId,
          message: `Your request to join group ${groupName.name} has been rejected`,
        },
      });

      try {
        // Deleting all related notifications from moderators notification
        await ctx.prisma.notification.deleteMany({
          where: {
            sendingUserId: selectedNotification.sendingUserId,
            groupId: selectedNotification.groupId,
          },
        });
      } catch (e) {
        // Not throwing a TRPCError because we don't want user to see it
        console.log({
          message: `An error occured while deleting join notification for ${selectedNotification.sendingUserId} : ${selectedNotification.groupId}`,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return {
        status: 200,
        message: "Rejected group join request successfull",
      };
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
        await dbJoinGroup({
          prisma: ctx.prisma,
          redis: ctx.redis,
          userId: ctx.session.user.id,
          groupId: selectedGroup.id,
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
          if (message) {
            const roomId = message.roomId;
            const messageId = message.id;
            const senderId = message.senderId;
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
              senderId &&
              senderName &&
              senderTag &&
              sentAt !== undefined &&
              messageContent !== undefined
            ) {
              const parsedMessage: TChatMessage = {
                id: messageId,
                senderId: senderId,
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

  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.notification.delete({
          where: {
            id: input.notificationId,
          },
        });
      } catch (e) {
        return new TRPCError({
          message: "Invalid notification, unable to remove",
          code: "BAD_REQUEST",
        });
      }

      return { message: "Deleted notification", status: 200 };
    }),
});
