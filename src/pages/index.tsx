import { type FormEventHandler, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type NextPage } from "next";
import Head from "next/head";

import { useQuery } from "@tanstack/react-query";

import { api } from "~/utils/api";
import { loginSchema } from "~/common/authSchema";

import SvgGroupyLogo from "public/SvgGroupyLogo";
import InputField from "../components/InputField";
import BackgroundContainer from "../components/BackgroundContainer";

import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";

const INVALID_CREDENTIALS_ERROR_MESSAGE =
  "Email-ID or Password is incorrect" as const;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
    // Redirect to home page
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const SignInPage: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  useEffect(() => {
    if (sessionData) {
      router.push("/home");
    }
  }, [sessionData, router]);

  const {
    isFetching: signInFetching,
    data: signInData,
    error: signInError,
    refetch: signInFunc,
  } = useQuery(
    ["signIn", emailField, passwordField],
    async () => {
      const response = await signIn("credentials", {
        email: emailField,
        password: passwordField,
        redirect: false,
      });

      if (!response || response.status === 401) {
        throw new Error(INVALID_CREDENTIALS_ERROR_MESSAGE);
      }

      return response;
    },
    {
      enabled: false,
      retry: 0,
      onError: () => {
        setErrorMessage(INVALID_CREDENTIALS_ERROR_MESSAGE);
      },
      onSuccess: () => {
        router.push("home");
      },
    }
  );

  const formSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const validate = loginSchema.safeParse({
      email: emailField,
      password: passwordField,
    });

    if (!validate.success) {
      setErrorMessage(INVALID_CREDENTIALS_ERROR_MESSAGE);
      return;
    }
    void signInFunc();
  };

  const handleEmailChange = (changeValue: string) => {
    setErrorMessage("");
    setEmailField(changeValue);
  };

  const handlePasswordChange = (changeValue: string) => {
    setErrorMessage("");
    setPasswordField(changeValue);
  };

  return (
    <>
      <Head>
        <title>Groupy</title>
        <meta
          name="description"
          content="Find a group today, groupy is the ultimate platform to find and connect with like-minded people to help you achieve your goals!"
        />
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
      <main className="font-poppins">
        <BackgroundContainer>
          <div className="flex h-screen w-screen items-center">
            <div className="flex w-3/6 flex-col items-end">
              <span className="max-w-[701px] px-20 text-5xl font-bold text-dark-blue">
                &quot;Alone we can do so little, together we can do so
                much.&quot;
              </span>
              <span className="px-20 text-xl">-Helen Keller</span>
            </div>

            <form className="w-3/6" onSubmit={formSubmitHandler}>
              <div className="flex w-5/6 max-w-[590px] flex-col items-center rounded-3xl bg-white px-24 pb-6 pt-12 drop-shadow-lg">
                <div className="absolute top-[-30px] h-16 w-16 rounded-lg bg-orange p-3">
                  <SvgGroupyLogo fillcolor="#ffffff" />
                </div>

                <span className="text-3xl font-bold text-dark-blue">
                  Sign in to your account
                </span>
                <span className="my-4 text-xl text-grey">
                  Start your journey
                </span>
                <div className="w-full">
                  <InputField
                    title="Email"
                    isRequired={true}
                    placeholder="Enter your email address"
                    handleState={{
                      inputState: emailField,
                      changeInputState: handleEmailChange,
                    }}
                    disabled={signInFetching}
                  />

                  <span className="p-2" />

                  <InputField
                    title="Password"
                    type="password"
                    isRequired={true}
                    placeholder="Enter your password"
                    handleState={{
                      inputState: passwordField,
                      changeInputState: handlePasswordChange,
                    }}
                    disabled={signInFetching}
                  />
                </div>
                <span className="relative top-[12px] text-red-600">
                  {errorMessage}
                </span>
                <button
                  type="submit"
                  className="my-6 h-12 w-full rounded-lg bg-orange text-white transition duration-300 ease-in-out hover:bg-[#ff853e]"
                >
                  Login
                </button>
                <div className="flex w-full">
                  <div className="relative top-[-10px] w-full border-b-2" />
                  <span className="mx-4 text-sm text-grey">OR</span>
                  <div className="relative top-[-10px] w-full border-b-2" />
                </div>
                <span className="py-4 text-3xl font-bold text-dark-blue">
                  Join our community
                </span>
                <button
                  type="button"
                  className="h-12 w-24 rounded-lg bg-orange text-white transition duration-300 ease-in-out hover:bg-[#ff853e]"
                  onClick={() => router.push("/sign-up")}
                  disabled={signInFetching}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </BackgroundContainer>
      </main>
    </>
  );
};

export default SignInPage;

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
