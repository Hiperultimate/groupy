import { z } from "zod";

import { signUpSchema } from "../../../common/authSchema";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
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
      const { name, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({ where: { email } });

      if (exists) {
        throw new TRPCError({message:"User with this Email ID already exists", code: "FORBIDDEN"})
      }

      // TODO: Hash password here and pass to result like password : hashed_password

      const result = await ctx.prisma.user.create({
        data: { name, email, password },
      });

      return {
        message: "Account created successfully",
        status: 201,
        result: result.email,
      };
    }),
});
