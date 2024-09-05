// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import prismaMock from "~/server/__mocks__/db";
import { type AppRouter, appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type { Post, Prisma } from "@prisma/client";
import { type Session } from "next-auth";
import { postFindOne } from "__tests__/__factories__/post";

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

    const datePlaceholder = new Date(2015, 11, 19);
    const prismaPostFindManyMock: GetPostOutput[] = [
      postFindOne({
        id: postId,
        image: "9881729412hg5ij",
        likedBy: [
          {
            userId: "15uih1234",
            createdAt: datePlaceholder,
            id: "21h5g12jk",
            postId: "iu12hg5",
            updatedAt: datePlaceholder,
          },
        ],
      }),
    ];

    const result = [
      {
        id: postId,
        content: "Default Content",
        image:
          "https://supabaseURL.co/storage/v1/object/public/images/9881729412hg5ij",
        authorId: "deafult-author-id",
        groupId: null,
        groupSize: null,
        createdAt: datePlaceholder,
        updatedAt: datePlaceholder,
        tags: [
          { id: "default-tag-id-1", name: "default-tag-1" },
          { id: "default-tag-id-2", name: "default-tag-2" },
        ],
        likeCount: 1,
        isUserLikePost: true,
        commentCount: 1,
      },
    ];
    
    prismaMock.post.findMany.mockResolvedValue(prismaPostFindManyMock);
    const postData = await caller.post.getPosts({ takenPosts: 0 });
    expect(postData).toMatchObject(result);
  });
});
