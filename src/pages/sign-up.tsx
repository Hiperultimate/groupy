import { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/navigation";

import { signUpSchema } from "~/common/authSchema";
import { api } from "~/utils/api";
import { type ZodError } from "zod";

import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";

import SvgGroupyLogo from "public/SvgGroupyLogo";
import InputField from "./components/InputField";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
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

const SignUp: NextPage = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate: signUpUser, isLoading: registerUser_isLoading } =
    api.account.signup.useMutation();

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const checkDetails = signUpSchema.safeParse({ name, email, password });

    console.log(checkDetails);
    // Retrieve error message ==> console.log(JSON.parse(checkDetails.error.message)[0].message); // Make sure you typecase "as ZodError"

    if (checkDetails.success) {
      signUpUser(checkDetails.data, {
        onError: (error) => {
          console.log(error.message);
        },
        onSuccess: (data) => {
          console.log("Success!");
          console.log("New user data : ", data);
          router.push("/");
        },
      });
    } else {
      const wrongInputError: ZodError = checkDetails.error;
      console.log(wrongInputError);
    }
  };

  return (
    <>
      <div className="background-design" />
      <div className="blur-gradient flex items-center">
        <div className="m-auto w-4/5 rounded-xl bg-white p-12 font-poppins shadow-lg">
          <div className="flex flex-col items-center">
            <div className="bg-orange p-4">
              <SvgGroupyLogo fillcolor="#ffffff" />
            </div>
            <div className="m-2 text-3xl font-bold text-dark-blue">
              Create your account
            </div>
            <div className="m-2 text-xl text-grey">Start your journey</div>
          </div>
          <form onSubmit={submitHandler}>
            <InputField
              title="Name"
              isRequired={true}
              placeholder="Full name"
              handleState={{ inputState: name, changeInputState: setName }}
              disabled={registerUser_isLoading}
            />
            <InputField
              title="Email"
              isRequired={true}
              placeholder="Email"
              handleState={{ inputState: email, changeInputState: setEmail }}
              disabled={registerUser_isLoading}
            />
            <InputField
              title="Password"
              isRequired={true}
              placeholder="Enter password"
              handleState={{
                inputState: password,
                changeInputState: setPassword,
              }}
              disabled={registerUser_isLoading}
            />
            <button
              className="rounded-md bg-slate-500 px-2 text-white"
              type="submit"
            >
              Submit
            </button>
            {registerUser_isLoading && <span>Loading...</span>}
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
