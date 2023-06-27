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

import BackgroundContainer from "~/components/BackgroundContainer";
import CreatePostInput from "~/components/CreatePostInput";
import UserDetails from "~/components/UserDetails";
import { DisplayPost } from "~/components/DisplayPost";

type SerializablePost = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
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

    return {
      ...post,
      createdAt: convertedCreatedAt,
      updatedAt: convertedUpdatedAt,
    };
  });

  return (
    <>
      <BackgroundContainer>
        <div className="pt-[80px]">
          <main className="my-8 flex justify-center">
            <UserDetails userData={userSession} />
            <div>
              <CreatePostInput userImage={userSession.user.image} />
              {postData.map((post) => {
                return <DisplayPost key={post.id} postData={post} />;
              })}
              <div>Post 1</div>
              <div>Post 2</div>
            </div>
            <div>Your Friends</div>
          </main>
        </div>
      </BackgroundContainer>
    </>
  );
};

export default Home;
