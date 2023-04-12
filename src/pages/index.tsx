import { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import InputField from "./components/InputField";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <AuthShowcase />
        </div>
          Some text
        
      </main> */}
      <main className="pt-[80px] font-poppins">
        <div className="background-design" />
        <div className="blur-gradient pt-[80px]">
          <div className="flex w-screen">
            <div className="flex w-3/6 flex-col items-end">
              <span className="text-5xl font-bold text-dark-blue">
                &quot;Alone we can do so little, together we can do so
                much.&quot;
              </span>
              <span className="text-xl">-Helen Keller</span>
            </div>

            <div className="flex w-3/6 flex-col">
              <span>Sign in to your account</span>
              <span>Start your journey</span>
              <InputField
                title="Email"
                isRequired={true}
                placeholder="Enter your email address"
                // handleState={{ inputState: name, changeInputState: setName }}
                // disabled={registerUser_isLoading}
              />

              <InputField
                title="Password"
                isRequired={true}
                placeholder="Enter your password"
                // handleState={{ inputState: name, changeInputState: setName }}
                // disabled={registerUser_isLoading}
              />
              <button>Login</button>
              <span>--------or---------</span>
              <span>Join our community</span>
              <button>Sign Up</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  useEffect(() => {
    console.log("Front-end session data : ", sessionData);
  }, [sessionData]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>

      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => router.push("/sign-up")}
      >
        Sign up
      </button>
    </div>
  );
};
