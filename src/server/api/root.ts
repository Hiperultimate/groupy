import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { accountRouter } from "./routers/authenticate";
import { postRouter } from "./routers/posts";
import { tags } from "./routers/tags";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  account: accountRouter,
  tags: tags,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
