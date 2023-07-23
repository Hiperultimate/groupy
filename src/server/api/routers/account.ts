import { z } from "zod";

import { signUpSchema } from "../../../common/authSchema";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { NotificationType, type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { base64ToImageData } from "~/common/imageConversion";
import { hashPassword } from "~/utils/passwordUtils";
import { supabase } from "~/utils/storageBucket";

export async function getUserByID(
  prisma: PrismaClient,
  session: Session,
  input: string
) {
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid user session",
    });
  }

  const user = await prisma.user.findFirst({
    where: { id: input },
    include: { tags: true },
  });
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const { id, name, email, dateOfBirth, atTag, description, image, tags } =
    user;

  let imageURL = image;

  if (image) {
    const { data } = supabase.storage.from("images").getPublicUrl(`${image}`);
    imageURL = data.publicUrl;
  }

  return {
    id,
    name,
    email,
    dateOfBirth,
    atTag,
    description,
    image: imageURL,
    tags,
  };
}

export async function getUserByTag(
  prisma: PrismaClient,
  session: Session,
  userTag: string
) {
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid user session",
    });
  }

  const user = await prisma.user.findFirst({
    where: { atTag: userTag },
    include: { tags: true },
  });
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const { id, name, email, dateOfBirth, atTag, description, image, tags } =
    user;

  let imageURL = image;

  if (image) {
    const { data } = supabase.storage.from("images").getPublicUrl(`${image}`);
    imageURL = data.publicUrl;
  }

  return {
    id,
    name,
    email,
    dateOfBirth,
    atTag,
    description,
    image: imageURL,
    tags,
  };
}

export const accountRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .output(
      z.object({
        message: z.string(),
        status: z.number(),
        result: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        email,
        password,
        dob,
        nameTag,
        description,
        userTags,
        image,
      } = input;

      const emailExists = await ctx.prisma.user.findFirst({ where: { email } });
      if (emailExists) {
        throw new TRPCError({
          message: "User with this Email ID already exists",
          code: "FORBIDDEN",
        });
      }

      const nameTagExists = await ctx.prisma.user.findFirst({
        where: { atTag: nameTag },
      });

      if (nameTagExists) {
        throw new TRPCError({
          message: "User with this Tag-name already exists",
          code: "FORBIDDEN",
        });
      }

      let imageHolder = image;
      // Image is already validated through schema validation, upload image to supabase and get url then save the url to image
      if (image !== undefined) {
        const { imageBuffer, imageMime, imageFormat } =
          base64ToImageData(image);

        if (!imageMime || !imageFormat) {
          throw new TRPCError({
            message: "Error occured while handling image",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        // This successfully uploads the image
        // Add name with Checking.png using npm install uuid and add format
        const { data: getImageURL, error } = await supabase.storage
          .from("images")
          .upload(`displayPictures/${uuidv4()}.${imageFormat}`, imageBuffer, {
            contentType: `${imageMime}`,
          });

        if (error) {
          throw new TRPCError({
            message: "Error occured while generating image URL",
            code: "INTERNAL_SERVER_ERROR",
          });
        } else {
          imageHolder = getImageURL.path;
        }
      }

      // TODO: userTags should fetch data from the server
      // TODO: Hash password here and pass to result like password : hashed_password

      const hashedPassword = hashPassword(password);

      const result = await ctx.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          dateOfBirth: dob,
          atTag: nameTag,
          description: description,
          tags: {
            connectOrCreate: userTags.map((tag) => ({
              where: { name: tag.value },
              create: { name: tag.value },
            })),
          },
          image: imageHolder,
        },
      });

      return {
        message: "Account created successfully",
        status: 201,
        result: result.email,
      };
    }),

  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userData = await getUserByID(ctx.prisma, ctx.session, input.userId);
      return userData;
    }),

  getUserByTag: protectedProcedure
    .input(z.object({ atTag: z.string() }))
    .query(async ({ ctx, input }) => {
      const userData = await getUserByTag(ctx.prisma, ctx.session, input.atTag);
      return userData;
    }),

  sendFriendRequestNotification: protectedProcedure
    .input(z.object({ toUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userSendingFR = ctx.session.user.id;
      const userReceivingFR = input.toUserId;

      const toUser = await ctx.prisma.user.findFirst({
        where: { id: userReceivingFR },
        select: {
          id: true,
        },
      });

      if (!toUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (userSendingFR === input.toUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot send friend request to yourself",
        });
      }

      const isExistingFR = await ctx.prisma.notification.findFirst({
        where: {
          sendingUserId: userSendingFR,
          receivingUserId: userReceivingFR,
        },
      });

      if (isExistingFR) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Friend request already sent",
        });
      }

      // Creating notification in DB
      await ctx.prisma.notification.create({
        data: {
          type: NotificationType.FRIENDREQUEST,
          message: `${ctx.session.user.atTag} has sent you a friend request`,
          receivingUser: { connect: { id: userReceivingFR } },
          sendingUser: { connect: { id: userSendingFR } },
        },
      });

      return { success: true, message: "Friend request sent" };
    }),

  isFriend: protectedProcedure
    .input(z.object({ targetUser: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      const isTargetUserFriend = await ctx.prisma.user.findFirst({
        where: {
          id: currentUserId,
          friendList: {
            some: {
              id: input.targetUser,
            },
          },
        },
        select: {
          friendList: {
            select: {
              id: true,
            },
          },
        },
      });

      return {
        isFriend: isTargetUserFriend ? true : false,
      };
    }),

  getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    const userNotifications = await ctx.prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
      select: {
        myNotifications: true,
      },
    });

    console.log("User notifications : " , userNotifications);
    return {userNotifications}
  }),
});
