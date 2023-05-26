import { type NextPage } from "next";

import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";
import BackgroundContainer from "~/components/BackgroundContainer";
import UserDetails from "~/components/UserDetails";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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

  return {
    props: { session },
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
          <main className="flex justify-center">
            <UserDetails userData={userSession}/>
            <div>
              <div>Create a Post input</div>
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
