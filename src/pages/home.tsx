import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";

import { getUserByID } from "~/server/api/routers/account";
import { getPosts } from "~/server/api/routers/posts";

import { prisma } from "~/server/db";
import { getServerAuthSession } from "../server/auth";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import BackgroundContainer from "~/components/BackgroundContainer";
import CreatePostInput from "~/components/CreatePostInput";
import { DisplayPost } from "~/components/DisplayPost";
import FriendList from "~/components/FriendList";
import UserDetails from "~/components/UserDetails";
import { type Tag } from "@prisma/client";

export type SerializablePost = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorDOB: string;
  authorEmail: string;
  authorAtTag: string | null;
  authorDescription: string | null;
  authorProfilePicture: string | null;
  authorTags: Tag[];
};

type ServerSideProps = {
  posts: SerializablePost[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    // Redirect to home page
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const posts = await getPosts(prisma, session);

  const serializablePosts = await Promise.all(posts.map(async (post) => {
    const authorID = post.authorId;
    const authorInfo = await getUserByID(prisma, session, authorID);
    const filteredAuthorData = {
      authorName: authorInfo.name,
      authorDOB: authorInfo.dateOfBirth.toString(),
      authorEmail: authorInfo.email,
      authorAtTag: authorInfo.atTag,
      authorDescription: authorInfo.description,
      authorProfilePicture: authorInfo.image,
      authorTags: authorInfo.tags,
    };

    const convertedCreatedAt = post.createdAt.toString();
    const convertedUpdatedAt = post.updatedAt.toString();

    return {
      ...post,
      ...filteredAuthorData,
      createdAt: convertedCreatedAt,
      updatedAt: convertedUpdatedAt,
    };
  }));

  return {
    props: { posts: serializablePosts },
  };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: userSession = null } = useSession();

  useEffect(() => {
    if (!userSession) {
      router.push("/");
    }
  }, [userSession, router]);

  if (!userSession) {
    return <>Error Occured. No user found!</>;
  }

  // Converting string dates to date type
  const postData = posts.map((post) => {
    const convertedCreatedAt = new Date(post.createdAt);
    const convertedUpdatedAt = new Date(post.updatedAt);
    const convertedAuthorDOB = new Date(post.authorDOB);

    return {
      ...post,
      createdAt: convertedCreatedAt,
      updatedAt: convertedUpdatedAt,
      authorDOB: convertedAuthorDOB
    };
  });

  return (
    <>
      <BackgroundContainer>
        <div className="pt-[80px]">
          <main className="my-8 flex justify-center">
            <div>
              <UserDetails userData={userSession} />
            </div>
            <div className="min-w-[545px] lg:w-[825px]">
              <CreatePostInput userImage={userSession.user.image} />
              {postData.map((post) => {
                return <DisplayPost key={post.id} postData={post} />;
              })}
            </div>
            <FriendList />
          </main>
        </div>
      </BackgroundContainer>
    </>
  );
};

export default Home;
