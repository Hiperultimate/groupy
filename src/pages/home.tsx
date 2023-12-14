import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";

import { getPosts } from "~/server/api/routers/posts";

import { prisma } from "~/server/db";
import { getServerAuthSession } from "../server/auth";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { type Tag } from "@prisma/client";
import { type Session } from "next-auth";
import BackgroundContainer from "~/components/BackgroundContainer";
import CreatePostInput from "~/components/CreatePostInput";
import FriendList from "~/components/FriendList";
import NotificationFeed from "~/components/NotificationComponent/NotificationFeed";
import UserDetails from "~/components/UserDetails";
import { notification } from "~/store/atoms/notification";
import { RenderPosts } from "~/components/RenderPosts";

export type SerializablePost = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likeCount: number;
  isUserLikePost: boolean;
  commentCount: number;
};

type ServerSideProps = {
  posts: SerializablePost[];
};

export type CurrentUser = Session["user"] & {
  name: string;
  image: string | null;
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

  const posts = await getPosts(prisma, session, 0); // Getting the first X amount of posts
  const serializablePosts = posts.map((post) => {
    const convertedCreatedAt = post.createdAt.toString();
    const convertedUpdatedAt = post.updatedAt.toString();
    return {
      ...post,
      createdAt: convertedCreatedAt,
      updatedAt: convertedUpdatedAt,
    };
  });
  return {
    props: { posts: serializablePosts },
  };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: userSession = null } = useSession();

  const setNotification = useSetRecoilState(notification);

  useEffect(() => {
    setNotification([]);
  }, [setNotification]);

  useEffect(() => {
    if (!userSession) {
      router.push("/");
    }
  }, [userSession, router]);

  if (!userSession) {
    return <>Error Occured. No user found!</>;
  }

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
              <RenderPosts initialPosts={posts}/>
            </div>
            <div className="flex flex-col gap-2">
              <NotificationFeed />
              <FriendList />
            </div>
          </main>
        </div>
      </BackgroundContainer>
    </>
  );
};

export default Home;
