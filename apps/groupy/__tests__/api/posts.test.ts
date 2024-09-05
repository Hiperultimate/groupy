// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import prismaMock from "~/server/__mocks__/db";
import { type AppRouter, appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type { Post, Prisma } from "@prisma/client";
import { type Session } from "next-auth";

describe("getPosts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  vi.mock("~/utils/storageBucket", () => {
    return {
      supabase: {
        storage: {
          from: vi.fn((imagePath: string) => ({
            getPublicUrl: vi.fn((imageName: string) => {
              return {
                data: {
                  publicUrl: `https://supabaseURL.co/storage/v1/object/public/${imagePath}/${imageName}`,
                },
              };
            }),
          })),
        },
      },
    };
  });

  const postId = "51lik5tiug123tiu";

  const testSession: Session = {
    user: {
      id: "15uih1234",
      atTag: "@Tester",
      dateOfBirth: new Date("2022-03-25"),
      description: null,
      tags: [],
      name: "Tester",
      email: "tester@gmail.com",
      image: null,
    },
    expires: "1",
  };

  const ctx = createInnerTRPCContext({ session: testSession });
  const caller = appRouter.createCaller({ ...ctx, prisma: prismaMock });

  it("getPosts api returning true if current user has liked the post ", async () => {
    type GetPostOutput = Prisma.PostGetPayload<{
      include: {
        tags: true;
        comments: true;
        likedBy: true;
      };
    }>;

    const prismaPostFindManyMock: GetPostOutput[] = [
      // This post is liked by current user session
      {
        id: postId,
        content: "Hello this is a test post",
        image: "9881729412hg5ij",
        authorId: "125451asffwef",
        groupId: "k2j35b25hu",
        groupSize: 100,
        createdAt: new Date("2022-03-25"),
        updatedAt: new Date("2022-03-25"),
        tags: [
          {
            id: "15hio15jopif",
            name: "social",
          },
          {
            id: "b12hui5b",
            name: "friendly",
          },
          {
            id: "61lhjiof",
            name: "development",
          },
        ],
        comments: [
          {
            authorId: "1hui24ubb",
            content: "That is nice",
            id: "12515ghj124",
            postId: postId,
            createdAt: new Date("2022-03-25"),
          },
        ],
        likedBy: [
          {
            userId: "15uih1234",
            createdAt: new Date("2022-03-25"),
            id: "21h5g12jk",
            postId: "iu12hg5",
            updatedAt: new Date("2022-03-25"),
          },
          {
            userId: "235b63n67",
            createdAt: new Date("2022-03-25"),
            id: "512bhgf",
            postId: "iu12hg5",
            updatedAt: new Date("2022-03-25"),
          },
        ],
      },
    ];

    const result = [
      {
        id: postId,
        content: "Hello this is a test post",
        image:
          "https://supabaseURL.co/storage/v1/object/public/images/9881729412hg5ij",
        authorId: "125451asffwef",
        groupId: "k2j35b25hu",
        groupSize: 100,
        createdAt: new Date("2022-03-25"),
        updatedAt: new Date("2022-03-25"),
        tags: [
          {
            id: "15hio15jopif",
            name: "social",
          },
          {
            id: "b12hui5b",
            name: "friendly",
          },
          {
            id: "61lhjiof",
            name: "development",
          },
        ],
        likeCount: 2,
        isUserLikePost: true,
        commentCount: 1,
      },
    ];

    prismaMock.post.findMany.mockResolvedValue(prismaPostFindManyMock);
    const postData = await caller.post.getPosts({ takenPosts: 0 });
    expect(postData).toMatchObject(result);
  });
});
