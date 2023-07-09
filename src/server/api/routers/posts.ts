import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserByID } from "./account";

/**
 *
 * @param prismaClient
 * @param session
 * @returns [{post} * 10] array of 10 latest posts
 */
export async function getPosts(prisma: PrismaClient, session: Session) {
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid user session",
    });
  }
  const postData = await prisma.post.findMany({
    take: 10,
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
    const currentUserLikePost = post.likedBy.some(checkUser => checkUser.id === session.user.id);
    const likeCount = post.likedBy.length;
    const commentCount = post.comments.length;
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

export const postRouter = createTRPCRouter({
  getPosts: protectedProcedure.query(({ ctx }) => {
    return getPosts(ctx.prisma, ctx.session);
  }),
  getPostComments: protectedProcedure
    .input(z.object({ postID: z.string() }))
    .query(async ({ ctx, input }) => {
      const allComments = await ctx.prisma.comment.findMany({
        where: { postId: input.postID },
        orderBy: { createdAt: "desc" },
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

  addCommentToPost: protectedProcedure
    .input(z.object({ postId: z.string(), addComment: z.string() }))
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
