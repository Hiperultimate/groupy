import {
    NotificationType,
    type Prisma,
    type PrismaClient,
} from "db_prisma";

type NotificationTypeObj = typeof NotificationType;

type CreateNotification = {
  prisma:
    | PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >
    | Omit<
        PrismaClient<
          Prisma.PrismaClientOptions,
          never,
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
      >;
} & (
  | {
      type: NotificationTypeObj["MESSAGE"];
      message: string;
      receivingUserId: string;
    }
  | {
      type: NotificationTypeObj["JOIN_GROUP_REQUEST"];
      receivingUserId: string;
      currentUserTag: string;
      senderUserId: string;
      groupId: string;
      groupName: string;
    }
  | {
      type: NotificationTypeObj["FRIENDREQUEST"];
      senderAtTag: string;
      receivingUserId: string;
      senderUserId: string;
    }
);

const createNotification = async (notificationObj: CreateNotification) => {
  const prisma = notificationObj.prisma;

  switch (notificationObj.type) {

    case NotificationType.JOIN_GROUP_REQUEST:
      await prisma.notification.create({
        data: {
          type: NotificationType.JOIN_GROUP_REQUEST,
          message: `@${notificationObj.currentUserTag} wants to join your group ${notificationObj.groupName}`,
          receivingUser: {
            connect: {
              id: notificationObj.receivingUserId,
            },
          },
          sendingUser: {
            connect: {
              id: notificationObj.senderUserId,
            },
          },
          forGroup: {
            connect: {
              id: notificationObj.groupId,
            },
          },
        },
      });
      break;

    case NotificationType.FRIENDREQUEST:
      await prisma.notification.create({
        data: {
          type: NotificationType.FRIENDREQUEST,
          message: `${notificationObj.senderAtTag} has sent you a friend request`,
          receivingUser: { connect: { id: notificationObj.receivingUserId } },
          sendingUser: { connect: { id: notificationObj.senderUserId } },
        },
      });
      break;
  }
};

export default createNotification;
