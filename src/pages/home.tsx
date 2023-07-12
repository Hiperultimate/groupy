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
import { useEffect, useState } from "react";

import BackgroundContainer from "~/components/BackgroundContainer";
import CreatePostInput from "~/components/CreatePostInput";
import { DisplayPost } from "~/components/DisplayPost";
import FriendList from "~/components/FriendList";
import UserDetails from "~/components/UserDetails";
import { type Tag } from "@prisma/client";
import { type Session } from "next-auth";
import { api } from "~/utils/api";

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
  const [displayPosts, setDisplayPosts] = useState<SerializablePost[]>([...posts]);

  useEffect(() => {
    if (!userSession) {
      router.push("/");
    }
  }, [userSession, router]);


  const { refetch: refetchPosts, isFetching: isPostFetching } =
    api.post.getPosts.useQuery(
      { takenPosts: displayPosts.length },
      { enabled: false }
    );

  async function handlePostFetching() {
    const getNewPosts = await refetchPosts();
    if (!getNewPosts.data) {
      throw Error("Error occured while fetching posts.");
    }

    const serializablePosts = getNewPosts.data.map( (post) => {
      const convertedCreatedAt = post.createdAt.toString();
      const convertedUpdatedAt = post.updatedAt.toString();
      return {
        ...post,
        createdAt: convertedCreatedAt,
        updatedAt: convertedUpdatedAt,
      };
    })

    setDisplayPosts([...displayPosts, ...serializablePosts]);
  }

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
              {displayPosts.map((post) => {
                return (
                  <DisplayPost
                    key={post.id}
                    postData={post}
                    currentUser={userSession.user as CurrentUser}
                  />
                );
              })}
            </div>
            {/* Change this button for onscroll loading */}
            <button onClick={() => void handlePostFetching()}>
              Get new posts (Temp)
            </button>
            <FriendList />
          </main>
        </div>
      </BackgroundContainer>
    </>
  );
};

export default Home;
