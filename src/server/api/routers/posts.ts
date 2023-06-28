
import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tags } from "./tags";

export async function getPosts(prisma : PrismaClient, session : Session){
  if(!session){
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid user session",
    })
  }
  return prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
    }
  });
}

export const postRouter = createTRPCRouter({
  getPosts: protectedProcedure.query(({ ctx }) => {
    return getPosts(ctx.prisma, ctx.session)
  }),
});
