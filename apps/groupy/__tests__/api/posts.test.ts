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
import {
  type inferProcedureInput,
  type inferProcedureOutput,
  TRPCError,
} from "@trpc/server";
import { z } from "zod";
import { base64ImgTag } from "__tests__/__fixtures__/JPGBase64Image";

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

  // There is some issue with prisma.$transactions not working while testing.
  // it("Throws INTERNAL_SERVER_ERROR for rejection in prisma transaction createGroup", async () => {
  //   vi.mock("~/server/prismaOperations/createGroup", () => ({
  //     default: vi
  //       .fn()
  //       .mockRejectedValue(new Error("Error while creating group.")),
  //   }));

  //   const createPostData = createPostDefaultData({image : undefined});

  //   // Call createPost API, and expect error code. Check for terminal logs of postRouter/posts/createPost line 257
  //   // Find out why image is undefined error is occuring
  //   await expect(caller.post.createPost(createPostData)).rejects.toThrow(
  //     new TRPCError({
  //       message: "Error occured while creating group, please try again.",
  //       code: "INTERNAL_SERVER_ERROR",
  //     })
  //   );
  // });
});

describe("addCommentToPost", () => {
  it("Expect FORBIDDEN if input comment exceeds 300 characters", async () => {
    const procedureInput: inferProcedureInput<
      typeof appRouter.post.addCommentToPost
    > = {
      postId: "1234567",
      addComment:
        "In recent years, the importance of mental well-being has gained widespread recognition across various societies. The fast-paced nature of modern life, with its constant demands and pressures, has made mental health an essential part of daily conversations. People are increasingly aware of the need to balance work, social life, and personal care to maintain a healthy mental state. Practices like mindfulness, meditation, and regular physical exercise are now recommended not just as therapeutic interventions but as preventive measures. ",
    };

    await expect(caller.post.addCommentToPost(procedureInput)).rejects.toThrow(
      new TRPCError({
        code: "FORBIDDEN",
        message: "Character limit exceeded",
      })
    );
  });

  it("Expect NOT_FOUND error if input postId does not exist in DB", async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);
    const procedureInput: inferProcedureInput<
      typeof appRouter.post.addCommentToPost
    > = {
      postId: "1234567",
      addComment: "That is really nice!",
    };

    await expect(caller.post.addCommentToPost(procedureInput)).rejects.toThrow(
      new TRPCError({
        code: "NOT_FOUND",
        message: "Post not found",
      })
    );
  });

  it("Expect comment data if procedure is working as expected", async () => {
    const procedureInput: inferProcedureInput<
      typeof appRouter.post.addCommentToPost
    > = {
      postId: "1234567",
      addComment: "That is really nice!",
    };

    const procedureOutput: inferProcedureOutput<
      typeof appRouter.post.addCommentToPost
    > = {
      id: "892472913",
      postId: "1234567",
      content: "That is really nice!",
      authorId: "325956",
      createdAt: new Date("02-04-2022"),
    };

    prismaMock.post.findFirst.mockResolvedValue({
      id: "8912475",
      content: "Check out my new ride!",
      image: null,
      authorId: "2345692984",
      groupId: null,
      groupSize: null,
      createdAt: new Date("02-04-2022"),
      updatedAt: new Date("02-04-2022"),
    });
    prismaMock.comment.create.mockResolvedValue(procedureOutput);

    await expect(caller.post.addCommentToPost(procedureInput)).resolves.toBe(
      procedureOutput
    );
  });
});
