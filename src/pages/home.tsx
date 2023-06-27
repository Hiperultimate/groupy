import { type NextPage } from "next";
import { useEffect } from "react";

import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";
import BackgroundContainer from "~/components/BackgroundContainer";
import UserDetails from "~/components/UserDetails";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPosts } from "~/server/api/routers/posts";

import CreatePostInput from "~/components/CreatePostInput";
import { prisma } from "~/server/db";
import { type Post } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

  // Getting posts to show
  const posts = await getPosts(prisma, session);
  const jsonPosts = JSON.stringify(posts);

  return {
    props: { posts: jsonPosts },
  };
};

const Home: NextPage<{posts: string}> = ({posts} : {posts: string}) => {
  const router = useRouter();
  const { data: userSession = null } = useSession();

  useEffect(() => {
    if (!userSession) {
      router.push("/");
    }
  }, [userSession, router]);

  if (!userSession) {
    return <></>;
  }

  const postsObj : Post[] = JSON.parse(posts) as Post[];
  console.log("Posts on the client side : " , postsObj)

  return (
    <>
      <BackgroundContainer>
        <div className="pt-[80px]">
          <main className="my-8 flex justify-center">
            <UserDetails userData={userSession} />
            <div>
              <CreatePostInput userImage={userSession.user.image} />

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
