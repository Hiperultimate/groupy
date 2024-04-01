import type { Prisma, PrismaClient } from "@prisma/client";

type CreatePost = {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  content: string;
  tags: {
    value: string;
    label: string;
  }[];
  userId: string;
  image: string | null;
  groupId?: string;
};

const createPost = async ({
  prisma,
  content,
  tags,
  userId,
  image,
  groupId,
}: CreatePost) => {
  const post = await prisma.post.create({
    data: {
      content,
      groupId: groupId ? groupId : null,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag.value },
          create: { name: tag.value },
        })),
      },
      authorId: userId,
      image: image,
    },
  });

  return post;
};

export default createPost;
