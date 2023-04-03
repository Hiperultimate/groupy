import { z } from "zod";

import { loginSchema } from "../../../common/authSchema";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const authenticate = createTRPCRouter({
  checkUser: publicProcedure.input(loginSchema).query( async ({ input, ctx }) => {
    const getUser = await ctx.prisma.user.findFirst({
      where: { email: input.email },
    });
    const checkPassword = new Promise((resolve, reject) => {
      if (getUser && getUser.password === input.password) {
        resolve("Login successfull");
      }else{
        reject("Login failed");
      }
    });
    checkPassword.then((successMessage) => {
      // return ({message: successMessage, user: getUser, status: 200})
      console.log(successMessage);
      return ({user: getUser, status: 200})
    })
    .catch((error) => {
      // return ({message: error,  status:401})
      console.error(error);
      return ({status:401})
    });
  }),
});

// {message: errorMessage, status: 401}
