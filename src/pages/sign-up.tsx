import React, { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/navigation";

import { signUpSchema } from "~/common/authSchema";
import { api } from "~/utils/api";
import { type ZodError } from "zod";

import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";

import SvgGroupyLogo from "public/SvgGroupyLogo";
import SvgUploadIcon from "public/SvgUploadIcon";
import SvgCamera from "public/SvgCamera";
import InputField from "./components/InputField";
import AsyncCreatableSelectComponent from "./components/InputCreatableSelect";

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

  const giveOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  // This state is for the AsyncCreatableSelectComponent component
  const [tagOptions, setTagOptions] =
    useState<{ value: string; label: string }[]>(giveOptions);

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

  const handleDrop = (e : React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    // do something with the dropped file
    console.log(file);
  };

  return (
    <>
      <div className="background-design" />
      <div className="blur-gradient flex items-center">
        <div className="m-auto w-4/5 max-w-[1250px] rounded-xl bg-white p-12 font-poppins shadow-lg">
          <div className="relative flex flex-col items-center">
            <div className="absolute top-[-90px] h-20 w-20 rounded-lg bg-orange p-4">
              <SvgGroupyLogo fillcolor="#ffffff" />
            </div>
            <div className="m-2 text-3xl font-bold text-dark-blue">
              Create your account
            </div>
            <div className="m-2 text-xl text-grey">Start your journey</div>
          </div>
          <form onSubmit={submitHandler}>
            <div className="my-4 flex w-full flex-row">
              <div className="mr-6 w-1/2">
                <InputField
                  title="Name"
                  isRequired={true}
                  placeholder="Full name"
                  handleState={{ inputState: name, changeInputState: setName }}
                  disabled={registerUser_isLoading}
                />
              </div>
              <div className="w-1/2">
                <InputField
                  title="Email"
                  isRequired={true}
                  placeholder="Email"
                  handleState={{
                    inputState: email,
                    changeInputState: setEmail,
                  }}
                  disabled={registerUser_isLoading}
                />
              </div>
            </div>
            <div className="my-4 flex w-full flex-row">
              <div className="mr-6 w-1/2">
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
              </div>

              <div className="w-1/2">
                <InputField
                  title="Confirm Password"
                  isRequired={true}
                  placeholder="Re-enter password"
                  // handleState={{
                  //   inputState: password,
                  //   changeInputState: setPassword,
                  // }}
                  disabled={registerUser_isLoading}
                />
              </div>
            </div>

            <div className="my-4 flex w-full flex-row">
              <div className="mr-6 w-1/2">
                <InputField
                  title="Date of Birth"
                  type="date"
                  isRequired={true}
                  placeholder="Enter your DOB"
                  // handleState={{
                  //   inputState: password,
                  //   changeInputState: setPassword,
                  // }}
                  disabled={registerUser_isLoading}
                />
              </div>

              <div className="w-1/2">
                <InputField
                  title="@Tag-name"
                  isRequired={true}
                  placeholder="ExampleName25"
                  // handleState={{
                  //   inputState: password,
                  //   changeInputState: setPassword,
                  // }}
                  disabled={registerUser_isLoading}
                />
              </div>
            </div>

            <div className="my-2 flex w-full flex-col">
              <label htmlFor="describe" className="hover:cursor-pointer">
                Describe Yourself*
              </label>
              {/* Set character or word limit to the textarea */}
              <textarea
                id="describe"
                placeholder="Something about you..."
                rows={4}
                required
                className="rounded-lg border-2 px-4 py-3"
                // value={}
                // onChange={}
              />
            </div>

            <div className="my-4">
              <span>
                Choose tags which resonates with you the most, or just create
                them!
              </span>
              <AsyncCreatableSelectComponent />
            </div>

            <div className="flex flex-col">
              <span>Upload your profile picture*</span>
              {/* Handle file submit with on drag and imageUpload to update state to a single useState */}
              <input className="hidden" type="file" id="imageUpload" />
              <label
                htmlFor="imageUpload"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="my-1 flex h-60 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8"
              >
                <span className="flex flex-col items-center text-grey">
                  <SvgUploadIcon dimention={50} />
                  <span>
                    Drag and drop an image, or{" "}
                    <span className="text-orange">Browse</span>
                  </span>
                  <span className="text-[#cad0d9]">
                    High resolution images (png, jpg)
                  </span>
                </span>
              </label>
            </div>

            <div>
              <span>Your Profile Picture</span>
                {/* if no image, export this */}
                  <div><SvgCamera /></div>

                {/* Else this */}
            </div>

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
