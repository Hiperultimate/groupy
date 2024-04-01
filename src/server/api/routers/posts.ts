import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { base64ToImageData } from "~/common/imageConversion";
import { postSchema } from "~/common/postSchema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { supabase } from "~/utils/storageBucket";
import { getUserByID } from "./account";
import createGroup from "~/server/prismaOperations/createGroup";
import createPost from "~/server/prismaOperations/createPost";

/**
 *
 * @param prismaClient
 * @param session
 * @returns [{post} * 10] array of 10 latest posts
 */
export async function getPosts(
  prisma: PrismaClient,
  session: Session,
  takenPosts: number
) {
  const numberOfPosts = 5 as const;
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid user session",
    });
  }
  const postData = await prisma.post.findMany({
    take: numberOfPosts,
    skip: takenPosts,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
      comments: true,
      likedBy: true,
    },
  });

  const finalPostData = postData.map((post) => {
    const currentUserLikePost = post.likedBy.some(
      (checkUser) => checkUser.userId === session.user.id
    );
    const likeCount = post.likedBy.length;
    const commentCount = post.comments.length;
    if (post.image) {
      const { data: getImageData } = supabase.storage
        .from("images")
        .getPublicUrl(`${post.image}`);

      post.image = getImageData.publicUrl;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likedBy, comments, ...requiredFields } = post;
    const editedPost = {
      ...requiredFields,
      likeCount: likeCount,
      isUserLikePost: currentUserLikePost,
      commentCount: commentCount,
    };
    return editedPost;
  });

  return finalPostData;
}

export async function getPostsFromUserTag(
  prisma: PrismaClient,
  session: Session,
  atTag: string,
  takenPosts: number
) {
  const numberOfPosts = 5 as const;
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid user session",
    });
  }

  const getUser = await prisma.user.findUnique({ where: { atTag: atTag } });

  if (!getUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const postData = await prisma.post.findMany({
    where: { authorId: getUser.id },
    take: numberOfPosts,
    skip: takenPosts,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
      _count: {
        select: {
          comments: true,
          likedBy: true,
        },
      },
    },
  });

  const finalPostData = await Promise.all(
    postData.map(async (post) => {
      const userLikePost = await prisma.post.findFirst({
        where: { id: post.id, likedBy: { some: { userId: session.user.id } } },
      });
      let currentUserLikePost = false;
      if (userLikePost !== null) {
        currentUserLikePost = true;
      }
      const likeCount = post._count.likedBy;
      const commentCount = post._count.comments;
      if (post.image) {
        const { data: getImageData } = supabase.storage
          .from("images")
          .getPublicUrl(`${post.image}`);

        post.image = getImageData.publicUrl;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _count, ...requiredFields } = post;
      const editedPost = {
        ...requiredFields,
        likeCount: likeCount,
        isUserLikePost: currentUserLikePost,
        commentCount: commentCount,
      };
      return editedPost;
    })
  );

  return finalPostData;
}

export const postRouter = createTRPCRouter({
  getPosts: protectedProcedure
    .input(z.object({ takenPosts: z.number() }))
    .query(({ ctx, input }) => {
      return getPosts(ctx.prisma, ctx.session, input.takenPosts);
    }),

  getPostsFromUserTag: protectedProcedure
    .input(z.object({ userTag: z.string(), takenPosts: z.number() }))
    .query(({ ctx, input }) => {
      return getPostsFromUserTag(
        ctx.prisma,
        ctx.session,
        input.userTag,
        input.takenPosts
      );
    }),

  getPostComments: protectedProcedure
    .input(z.object({ postID: z.string(), takenComments: z.number() }))
    .query(async ({ ctx, input }) => {
      const commentsToTake = 5;
      const allComments = await ctx.prisma.comment.findMany({
        where: { postId: input.postID },
        orderBy: { createdAt: "desc" },
        skip: input.takenComments,
        take: commentsToTake,
      });
      const commentWithUserData = await Promise.all(
        allComments.map(async (comment) => {
          // Get user data for each comment and add it to the existing allComments object
          const getUser = await getUserByID(
            ctx.prisma,
            ctx.session,
            comment.authorId
          );

          return {
            id: comment.id,
            content: comment.content,
            authorId: comment.authorId,
            createdAt: comment.createdAt,
            authorName: getUser.name,
            authorImage: getUser.image,
          };
        })
      );
      return commentWithUserData;
    }),

  createPost: protectedProcedure
    .input(postSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        content,
        isGroup,
        groupName,
        ageSpectrum,
        groupSize,
        tags,
        instantJoin,
        image,
      } = input;

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

        // This successfully uploads the image to supabase storage bucket
        const { data: getImageURL, error } = await supabase.storage
          .from("images")
          .upload(`postPicture/${uuidv4()}.${imageFormat}`, imageBuffer, {
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

      // Creating group if isGroup === true
      let group = undefined;
      if (isGroup) {
        try {
          group = await createGroup({
            prisma: ctx.prisma,
            groupMakerId: ctx.session.user.id,
            groupName: groupName,
            groupImage: null,
            minAgeLimit: ageSpectrum.minAge,
            maxAgeLimit: ageSpectrum.maxAge,
            size: groupSize,
            instantJoin: instantJoin,
          });
        } catch (e) {
          console.log("Error creating group :", e);
          throw new TRPCError({
            message: "Error occured while creating group, please try again.",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      }

      try {
        const result = await createPost({
          prisma: ctx.prisma,
          content,
          tags,
          userId: ctx.session.user.id,
          image: imageHolder ? imageHolder : null,
          groupId: group?.id,
        });

        const properTag = tags.map((tag, index) => {
          return {
            id: index.toString(),
            name: tag.value,
          };
        });

        if (result.image) {
          const { data: getImageData } = supabase.storage
            .from("images")
            .getPublicUrl(`${result.image}`);

          result.image = getImageData.publicUrl;
        }

        const newPostSerialized = {
          id: result.id,
          content: result.content,
          image: result.image,
          authorId: result.authorId,
          tags: properTag,
          createdAt: result.createdAt.toString(),
          updatedAt: result.updatedAt.toString(),
          likeCount: 0,
          isUserLikePost: false,
          commentCount: 0,
        };

        return {
          message: "Post created successfully",
          status: 201,
          result: newPostSerialized,
        };
      } catch (e) {
        throw new TRPCError({
          message: "Error occured while creating post, please try again.",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  addCommentToPost: protectedProcedure
    .input(z.object({ postId: z.string(), addComment: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (input.addComment.length > 300) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Character limit exceeded",
        });
      }

      const getPost = await ctx.prisma.post.findFirst({
        where: { id: input.postId },
      });

      if (getPost === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const newComment = await ctx.prisma.comment.create({
        data: {
          content: input.addComment,
          postId: input.postId,
          authorId: ctx.session.user.id,
        },
      });

      return newComment;
    }),

  likeDislikePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .output(z.object({ isPostLiked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // existance of isPostLikedByUser means user already liked the post
      const isPostLikedByUser = await ctx.prisma.userLikedPost.findFirst({
        where: { userId: ctx.session.user.id, postId: input.postId },
      });

      // Delete the record from userLikedPost table
      if (isPostLikedByUser) {
        const uniqueId = await ctx.prisma.userLikedPost.findFirst({
          where: { postId: input.postId, userId: ctx.session.user.id },
        });
        if (uniqueId) {
          await ctx.prisma.userLikedPost.delete({ where: { id: uniqueId.id } });
          return { isPostLiked: false };
        }
      }

      const response = await ctx.prisma.userLikedPost.create({
        data: { userId: ctx.session.user.id, postId: input.postId },
      });
      if (response) {
        return { isPostLiked: true };
      }

      // Fallback
      return { isPostLiked: false };
    }),
});
