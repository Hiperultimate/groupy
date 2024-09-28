import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEventHandler } from "react";

import { useQuery } from "@tanstack/react-query";

import { loginSchema } from "~/common/authSchema";

import SvgGroupyLogo from "public/SvgGroupyLogo";
import BackgroundContainer from "../components/BackgroundContainer";
import InputField from "../components/InputField";

import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/auth";

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

  const globalUserCredentials = {
    email: process.env.GLOBAL_ACCOUNT_EMAIL,
    password: process.env.GLOBAL_ACCOUNT_PASSWORD,
  };
  return {
    props: { globalUserCredentials },
  };
};

const SignInPage: NextPage<{
  globalUserCredentials: { email: string; password: string };
}> = ({ globalUserCredentials }) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const autoFillGlobalCredentials = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (globalUserCredentials.email && globalUserCredentials.password) {
      setEmailField(globalUserCredentials.email);
      setPasswordField(globalUserCredentials.password);
    }
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
                    data-test="email"
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
                    data-test="password"
                    isRequired={true}
                    placeholder="Enter your password"
                    handleState={{
                      inputState: passwordField,
                      changeInputState: handlePasswordChange,
                    }}
                    disabled={signInFetching}
                  />
                </div>
                <span className="relative top-[12px] text-red-600" data-test="error-message">
                  {errorMessage}
                </span>

                <div className="flex w-full">
                  <button
                    type="submit"
                    data-test="loginBtn"
                    className="my-6 h-12 w-full rounded-lg bg-orange text-white transition duration-300 ease-in-out hover:bg-[#ff853e]"
                  >
                    Login
                  </button>

                  {globalUserCredentials.email &&
                    globalUserCredentials.password && (
                      <>
                        <span className="p-2" />

                        <button
                          className="background-animate relative my-6 h-12 w-full rounded-lg bg-gradient-to-r from-orange to-[#4DCCBD] text-white transition duration-300 ease-in-out hover:bg-[#ff853e]"
                          onClick={(e) => {
                            autoFillGlobalCredentials(e);
                          }}
                        >
                          Auto Credentials
                        </button>
                      </>
                    )}
                </div>

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
