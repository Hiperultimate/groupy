import { type NextPage } from "next";

import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";
import BackgroundContainer from "~/components/BackgroundContainer";
import UserDetails from "~/components/UserDetails";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CreatePostInput from "~/components/CreatePostInput";

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

// Fetch a comment from the server (which is made manually) and send it from server to client
//   const posts = [{
//     postId: '3512cx2',
//     userImage : undefined,
//     name: "John Smith",
//     atTag: "@John Smith",
//     tags: , 
//     createdAt: ,
//     description: ,
//     postImage: ,
//     postLikes: ,
//     postComments: ,
// }]

  return {
    props: { session },
    // props: { session, posts },
  };
};

const Home: NextPage = () => {
  const router = useRouter();
  const { data: userSession } = useSession();
  if(userSession === undefined || userSession === null) {
    void router.push("/")
    return <></>;
  }
  return (
    <>
      <BackgroundContainer>
        <div className="pt-[80px]">
          <main className="flex justify-center my-8">
            <UserDetails userData={userSession}/>
            <div>
              <CreatePostInput userImage={userSession.user.image}/>
              
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
