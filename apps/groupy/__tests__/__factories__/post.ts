import { type Prisma } from "@groupy/db_prisma";
import { IPost } from "~/common/postSchema";

type GetPostOutput = Prisma.PostGetPayload<{
  include: {
    tags: true;
    comments: true;
    likedBy: true;
  };
}>;

export const postFindOne = (
  overrides: Partial<GetPostOutput> = {}
): GetPostOutput => {
  const datePlaceholder = new Date(2015, 11, 19);
  return {
    id: "default-post-id",
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
    comments: [
      {
        id: "default-comment-id",
        content: "Default comment content",
        postId: "default-post-id",
        authorId: "default-author-id",
        createdAt: datePlaceholder,
      },
    ],
    likedBy: [
      {
        id: "default-like-id",
        userId: "default-user-id",
        postId: "default-post-id",
        createdAt: datePlaceholder,
        updatedAt: datePlaceholder,
      },
    ],
    ...overrides,
  };
};

export const createPostDefaultData = (overrides : Partial<IPost>) : IPost => {
  return {
    content: "Default content",
    tags: [
      { value: "red", label: "Red" },
      { value: "green", label: "Green" },
      { value: "blue", label: "Blue" },
    ],
    isGroup: true,
    groupName: "Default group name",
    ageSpectrum: { minAge: 20, maxAge: 100 },
    groupSize: 30,
    instantJoin: false,
    image: undefined,
    ...overrides
  }
}
