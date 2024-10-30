import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { signUpSchema, type ISignUp } from "~/common/authSchema";
import { api } from "~/utils/api";

import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/auth";

import Image from "next/image";
import SvgCamera from "public/SvgCamera";
import SvgGroupyLogo from "public/SvgGroupyLogo";
import { toast } from "react-toastify";
import { encodeImageToBase64 } from "~/common/imageConversion";
import StyledImageInput from "~/components/StyledImageInput";
import BackgroundContainer from "../components/BackgroundContainer";
import AsyncCreatableSelectComponent, {
  type TagOption,
} from "../components/InputCreatableSelect";
import InputErrorText from "../components/InputErrorText";
import InputField from "../components/InputField";

type FieldSetErrorMap = {
  [key: string]: React.Dispatch<React.SetStateAction<string[]>>;
};

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
  const { mutate: signUpUser, isLoading: registerUser_isLoading } =
    api.account.signup.useMutation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [dob, setDob] = useState<string>(new Date().toLocaleString());
  const [userNameTag, setUserNameTag] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userImage, setUserImage] = useState<string | undefined>();
  // This state is for the AsyncCreatableSelectComponent component
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [userImageFile, setUserImageFile] = useState<File | null>(null);

  const [nameError, setNameError] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string[]>(
    []
  );
  const [dobError, setDobError] = useState<string[]>([]);
  const [userNameTagError, setUserNameTagError] = useState<string[]>([]);
  const [descriptionError, setDescriptionError] = useState<string[]>([]);
  const [userImageError, setUserImageError] = useState<string[]>([]);
  const [selectedTagsError, setSelectedTagsError] = useState<string[]>([]);

  const fieldSetErrorMap: FieldSetErrorMap = {
    name: setNameError,
    email: setEmailError,
    password: setPasswordError,
    confirmPassword: setConfirmPasswordError,
    dob: setDobError,
    nameTag: setUserNameTagError,
    description: setDescriptionError,
    userTags: setSelectedTagsError,
    image: setUserImageError,
  };

  const formDataCheck = (): ISignUp | null => {
    const checkDetails = signUpSchema.safeParse({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      dob: new Date(dob),
      nameTag: userNameTag,
      description: description,
      userTags: selectedTags,
      image: userImage,
    });
    // Retrieve error message ==> console.log(JSON.parse(checkDetails.error.message)[0].message); // Make sure you typecase "as ZodError"

    if (!checkDetails.success) {
      const formatErrors = checkDetails.error.format(); // Creates objects with key value pair of all the errors
      const fieldNames = Object.keys(formatErrors);
      fieldNames.forEach((fieldName) => {
        if (fieldSetErrorMap[fieldName]) {
          const key = fieldName as keyof typeof formatErrors &
            keyof typeof fieldSetErrorMap;
          const setErrorStateField = fieldSetErrorMap[key];
          const fieldError = formatErrors[key];
          if (fieldError && "_errors" in fieldError && setErrorStateField) {
            setErrorStateField(fieldError._errors);
          }
        }
      });
      return null;
    } else {
      return checkDetails.data;
    }
  };

  const isValidFormData = (): boolean => {
    const errorFields = [
      nameError,
      emailError,
      passwordError,
      confirmPasswordError,
      dobError,
      userNameTagError,
      descriptionError,
      userImageError,
      selectedTagsError,
    ];

    return errorFields.every((errors) => errors.length === 0);
  };

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const userData: ISignUp | null = formDataCheck();
    const isValid: boolean = isValidFormData();

    if (isValid && userData) {
      // Transform image to base64 and overwrite image to userData
      if (userImageFile) {
        const base64Image = await encodeImageToBase64(userImageFile);
        userData.image = base64Image;
      }

      // Create user
      signUpUser(userData, {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: (data) => {
          console.log("Success!");
          console.log("New user data : ", data);
          router.push("/");
        },
      });
    }
  };

  


  return (
    <>
      <BackgroundContainer>
        <div className="flex items-center py-60">
          <div className="m-auto w-4/5 max-w-[1250px] rounded-xl bg-white px-12 pt-12 font-poppins shadow-lg">
            <div className="relative flex flex-col items-center">
              <div className="absolute top-[-90px] h-20 w-20 rounded-lg bg-orange p-4">
                <SvgGroupyLogo fillcolor="#ffffff" />
              </div>
              <div className="m-2 text-3xl font-bold text-dark-blue" data-test="signup-title">
                Create your account
              </div>
              <div className="m-2 text-xl text-grey">Start your journey</div>
            </div>
            <form onSubmit={(event) => void submitHandler(event)}>
              <div className="my-4 flex w-full flex-row">
                <div className="mr-6 w-1/2">
                  <InputField
                    title="Name"
                    isRequired={true}
                    placeholder="Full name"
                    handleState={{
                      inputState: name,
                      changeInputState: setName,
                    }}
                    handleErrorState={{
                      inputState: nameError,
                      changeInputState: setNameError,
                    }}
                    disabled={registerUser_isLoading}
                    data-test="name-input"
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
                    handleErrorState={{
                      inputState: emailError,
                      changeInputState: setEmailError,
                    }}
                    disabled={registerUser_isLoading}
                    data-test="email-input"

                  />
                </div>
              </div>
              <div className="my-4 flex w-full flex-row">
                <div className="mr-6 w-1/2">
                  <InputField
                    title="Password"
                    type="password"
                    isRequired={true}
                    placeholder="Enter password"
                    handleState={{
                      inputState: password,
                      changeInputState: setPassword,
                    }}
                    handleErrorState={{
                      inputState: passwordError,
                      changeInputState: setPasswordError,
                    }}
                    disabled={registerUser_isLoading}
                    data-test="password-input"
                  />
                </div>

                <div className="w-1/2">
                  <InputField
                    title="Confirm Password"
                    type="password"
                    isRequired={true}
                    placeholder="Re-enter password"
                    handleState={{
                      inputState: confirmPassword,
                      changeInputState: setConfirmPassword,
                    }}
                    handleErrorState={{
                      inputState: confirmPasswordError,
                      changeInputState: setConfirmPasswordError,
                    }}
                    disabled={registerUser_isLoading}
                    data-test="confirmPassword-input"
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
                    handleState={{
                      inputState: dob,
                      changeInputState: setDob,
                    }}
                    handleErrorState={{
                      inputState: dobError,
                      changeInputState: setDobError,
                    }}
                    disabled={registerUser_isLoading}
                    data-test="dob-input"
                  />
                </div>

                <div className="w-1/2">
                  <InputField
                    title="@Tag-name"
                    isRequired={true}
                    placeholder="ExampleName25"
                    handleState={{
                      inputState: userNameTag,
                      changeInputState: setUserNameTag,
                    }}
                    handleErrorState={{
                      inputState: userNameTagError,
                      changeInputState: setUserNameTagError,
                    }}
                    disabled={registerUser_isLoading}
                    data-test="tagName-input"
                  />
                </div>
              </div>

              <div className="my-2 flex w-full flex-col">
                <label htmlFor="describe" className="hover:cursor-pointer">
                  Describe Yourself
                </label>
                {/* Set character or word limit to the textarea */}
                <textarea
                  id="description"
                  placeholder="Something about you..."
                  rows={4}
                  className="rounded-lg border-2 px-4 py-3"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setDescriptionError([]);
                  }}
                  data-test="userDescription-input"
                />
                <InputErrorText errorArray={descriptionError} />
              </div>

              <div className="my-4">
                <span>
                  Choose tags which resonates with you the most, or just create
                  them!
                </span>
                <AsyncCreatableSelectComponent
                  id="tagSelect-input"
                  handleFieldState={{
                    inputState: selectedTags,
                    setInputState: setSelectedTags,
                  }}
                  handleErrorState={{
                    errorState: selectedTagsError,
                    setErrorState: setSelectedTagsError,
                  }}
                />
              </div>

              {/* Image will be optional */}
              <StyledImageInput
                title={"Upload your profile picture"}
                setUserImage={setUserImage}
                setUserImageFile={setUserImageFile}
                setUserImageError={setUserImageError}
                userImageError={userImageError}
                data-test="image-input"
              />

              <div className="my-4">
                <span>Your Profile Picture</span>
                {/* if no image, export this */}
                <div className="flex items-end">
                  <div className="relative m-4 flex h-48 w-48 items-center justify-center rounded-full bg-[#d9d9d9] shadow-md">
                    {userImage === undefined ? (
                      <SvgCamera />
                    ) : (
                      <Image
                        className="rounded-full"
                        src={userImage}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="relative m-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#d9d9d9] shadow-md">
                    {userImage === undefined ? (
                      <SvgCamera />
                    ) : (
                      <Image
                        className="rounded-full"
                        src={userImage}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="relative m-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#d9d9d9] shadow-md">
                    {userImage === undefined ? (
                      <SvgCamera />
                    ) : (
                      <Image
                        className="rounded-full"
                        src={userImage}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                className="my-4 h-12 w-full rounded-md bg-orange px-2 text-white disabled:bg-[#ff9e3e]"
                type="submit"
                data-test="signupSubmit-btn"
                disabled={registerUser_isLoading}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </BackgroundContainer>
    </>
  );
};

export default SignUp;
