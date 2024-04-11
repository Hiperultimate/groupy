import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const tags = createTRPCRouter({
  relatedTags: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const searchString = input.replace(/ /g, "");
    return ctx.prisma.tag.findMany({
      where: { name: { contains: searchString, mode: "insensitive" } },
      take: 5,
    });
  }),
});
