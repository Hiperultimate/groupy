import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "./routers/authenticate";
import { tags } from "./routers/tags";
import { postRouter } from "./routers/posts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  account: authRouter,
  tags: tags,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
