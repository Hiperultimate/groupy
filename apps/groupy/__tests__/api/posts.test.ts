// @vitest-environment node

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import prismaMock from "~/server/__mocks__/db";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { type Session } from "next-auth";
import {
  createPostDefaultData,
  postFindOne,
} from "__tests__/__factories__/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  base64ImgTag,
} from "__tests__/__fixtures__/JPGBase64Image";

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

const supabaseStorageBucketMock = vi.mock("~/utils/storageBucket", () => {
  return {
    supabase: {
      storage: {
        from: vi.fn((imagePath: string) => ({
          upload: vi.fn(() =>
            // path: string,
            // buffer: Buffer,
            // typeObj: { contentType: string }
            {
              return {
                data: null,
                error: new Error("Error occured while uploading"),
              };
            }
          ),
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

describe("getPosts", () => {
  beforeAll(() => {
    supabaseStorageBucketMock;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Should throw UNAUTHORIZED error if session is invalid ", async () => {
    const nullSessionCtx = createInnerTRPCContext({ session: null });
    const testCaller = appRouter.createCaller({
      ...nullSessionCtx,
      prisma: prismaMock,
    });

    await expect(testCaller.post.getPosts({ takenPosts: 0 })).rejects.toThrow(
      new TRPCError({ code: "UNAUTHORIZED" })
    );
  });

  it("getPosts api returning true if current user has liked the post ", async () => {
    type GetPostOutput = Prisma.PostGetPayload<{
      include: {
        tags: true;
        comments: true;
        likedBy: true;
      };
    }>;

    const postId = "51lik5tiug123tiu";
    const datePlaceholder = new Date(2015, 11, 19);
    const prismaPostFindManyMock: GetPostOutput[] = [
      postFindOne({
        id: postId,
        image: null,
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
        image: null,
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

    expect(postData.every((post) => post.isUserLikePost)).toBeTruthy();
    expect(postData).toMatchObject(result);
  });

  it("getPosts api generating proper public url for image", async () => {
    type GetPostOutput = Prisma.PostGetPayload<{
      include: {
        tags: true;
        comments: true;
        likedBy: true;
      };
    }>;

    const postId = "51lik5tiug123tiu";
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

    expect(postData[0]?.image).toBe(result[0]?.image);
  });
});

describe("getPostsFromUserTag", () => {
  beforeAll(() => {
    supabaseStorageBucketMock;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Should throw UNAUTHORIZED error if session is invalid", async () => {
    const nullSessionCtx = createInnerTRPCContext({ session: null });
    const testCaller = appRouter.createCaller({
      ...nullSessionCtx,
      prisma: prismaMock,
    });

    await expect(testCaller.post.getPosts({ takenPosts: 0 })).rejects.toThrow(
      new TRPCError({ code: "UNAUTHORIZED" })
    );
  });

  it("Should throw NOT_FOUND error if user is not found in database", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      caller.post.getPostsFromUserTag({ userTag: "sphinx", takenPosts: 0 })
    ).rejects.toThrow(
      new TRPCError({ code: "NOT_FOUND", message: "User not found" })
    );
  });

  it("Should return all posts by the current logged user ", async () => {
    type PostWithTagsAndCounts = Prisma.PostGetPayload<{
      include: {
        tags: true;
        _count: {
          select: {
            comments: true;
            likedBy: true;
          };
        };
      };
    }>;

    const randomUser = {
      id: "15uih1234",
      atTag: "ttester",
      dateOfBirth: new Date(2015, 11, 19),
      password: "hashedPassword",
      description: null,
      tags: [],
      name: "Tester",
      email: "tester@gmail.com",
      image: null,
    };

    const mockPost = {
      ...postFindOne({
        image: "image1.jpg",
        comments: Array.from({ length: 3 }, (_, index) => ({
          id: `${index}`,
          content: `Default comment ${index}`,
          postId: `${index}-post-id`,
          authorId: `${index}-author-id`,
          createdAt: new Date("2022-02-02"),
        })),
        likedBy: Array.from({ length: 10 }, (_, index) => ({
          id: `${index}`,
          userId: `user-id-${index}`,
          postId: `${index}-post-id`,
          updatedAt: new Date("2022-02-02"),
          createdAt: new Date("2022-02-02"),
        })),
      }),
    };

    prismaMock.user.findUnique.mockResolvedValue(randomUser);
    prismaMock.post.findMany.mockResolvedValue([
      {
        ...mockPost,
        _count: {
          comments: 3,
          likedBy: 10,
        },
      },
    ] as PostWithTagsAndCounts[]);

    const getUserPostsFromAtTag = await caller.post.getPostsFromUserTag({
      userTag: randomUser.atTag,
      takenPosts: 0,
    });

    const result = [
      {
        ...mockPost,
        image:
          "https://supabaseURL.co/storage/v1/object/public/images/image1.jpg",
        likeCount: 10,
        isUserLikePost: true,
        commentCount: 3,
      },
    ];

    expect(getUserPostsFromAtTag).toMatchObject(result);
  });
});

describe("createPost", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Throws UNAUTHORIZED if user session is not created", async () => {
    const nullSessionCtx = createInnerTRPCContext({ session: null });
    const nullSessionCaller = appRouter.createCaller({
      ...nullSessionCtx,
      prisma: prismaMock,
    });

    await expect(nullSessionCaller.post.createPost).rejects.toThrow(
      new TRPCError({ code: "UNAUTHORIZED" })
    );
  });

  it("Throws Zod Error if base64Image is not valid", async () => {
    const createPostInput = createPostDefaultData({
      image: "invalidBase64ImageData",
    });
    await expect(caller.post.createPost(createPostInput)).rejects.toThrow(
      new z.ZodError([
        {
          code: "custom",
          message: "Something went wrong while converting the image",
          path: ["image"],
        },
      ])
    );
  });

  it("Throws INTERNAL_SERVER_ERROR if image upload to storage bucket failed", async () => {
    const createPostInput = createPostDefaultData({
      image: base64ImgTag,
    });
    await expect(caller.post.createPost(createPostInput)).rejects.toThrow(
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error occured while generating image URL",
      })
    );
  });
  // it("Throws BAD_REQUEST if isGroup is true and group name is not provided", () => {});
  // it("Returns serialized post data if createPost API worked", () => {});
  // it("Returns groupId and groupSize and post data if isGroup field is true and valid data is given", () => {});
});
