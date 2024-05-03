import type { Prisma, PrismaClient } from "@groupy/db_prisma";
import type { PrismaTransactionalClient } from "~/common/types";


type CreatePost = {
  prisma:
    | PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >
    | PrismaTransactionalClient
  content: string;
  tags: {
    value: string;
    label: string;
  }[];
  userId: string;
  image: string | null;
  groupId?: string;
  groupSize?: number;
};

const createPost = async ({
  prisma,
  content,
  tags,
  userId,
  image,
  groupId,
  groupSize,
}: CreatePost) => {
  const post = await prisma.post.create({
    data: {
      content,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag.value },
          create: { name: tag.value },
        })),
      },
      authorId: userId,
      image: image,
      groupId: groupId ? groupId : null,
      groupSize: groupSize ? groupSize : null,
    },
  });

  return post;
};

export default createPost;
