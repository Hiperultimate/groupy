import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
    const likeCount = post.likedBy.length;
    const commentCount = post.comments.length;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likedBy, comments, ...requiredFields } = post;
    const editedPost = {
      ...requiredFields,
      likeCount: likeCount,
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
});
