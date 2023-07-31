import { type InferGetServerSidePropsType, type NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { type GetServerSideProps } from "next";
import { type IUpdateUser, updateUserSchema } from "~/common/authSchema";
import { api } from "~/utils/api";

import Image from "next/image";
import SvgCamera from "public/SvgCamera";
import SvgGroupyLogo from "public/SvgGroupyLogo";
import { encodeImageToBase64 } from "~/common/imageConversion";
import BackgroundContainer from "~/components/BackgroundContainer";
import ErrorNotification from "~/components/ErrorNotification";
import AsyncCreatableSelectComponent, {
  type TagOption,
} from "~/components/InputCreatableSelect";
import InputErrorText from "~/components/InputErrorText";
import InputField from "~/components/InputField";
import StyledImageInput from "~/components/StyledImageInput";
import { getServerAuthSession } from "~/server/auth";
import { type AccountRouter, getUserByID } from "~/server/api/routers/account";
import { prisma } from "~/server/db";
import type { inferRouterOutputs } from "@trpc/server";

type FieldSetErrorMap = {
  [key: string]: React.Dispatch<React.SetStateAction<string[]>>;
};

type UserOutput = inferRouterOutputs<AccountRouter>;
type GetUserByID = UserOutput["getUserById"];
type SerializableUserData = Omit<GetUserByID, "id" | "dateOfBirth" | "tags"> & {
  dateOfBirth: string;
  tags: TagOption[];
};

export const getServerSideProps: GetServerSideProps<{
  userData: SerializableUserData;
}> = async (ctx) => {
  const { atTag: checkUrlTag } = ctx.query;
  const session = await getServerAuthSession(ctx);
  if (!session || checkUrlTag !== session.user.atTag) {
    // Redirect to home page
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userData = await getUserByID(prisma, session, session.user.id);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { id, ...rest } = userData;

  const serializedTags = rest.tags.map((tag) => {
    return { value: tag.name, label: tag.name };
  });

  const serializableUserData = {
    ...rest,
    dateOfBirth: rest.dateOfBirth.toString(),
    tags: serializedTags,
  };

  return {
    props: { userData: serializableUserData },
  };
};

const EditProfile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ userData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  // Instead of signUpUser write a procedure to update user data here
  const { mutate: updateUser, isLoading: updateUser_isLoading } =
    api.account.updateUser.useMutation();

  const [name, setName] = useState<string>(userData.name);
  const [email, setEmail] = useState<string>(userData.email);
  const [dob, setDob] = useState<string>(
    new Date(userData.dateOfBirth).toISOString().split("T")[0] || ""
  );
  const [userNameTag, setUserNameTag] = useState<string>(userData.atTag);
  const [description, setDescription] = useState<string>(
    userData.description ? userData.description : ""
  );
  const [userImage, setUserImage] = useState<string | undefined>(
    userData.image ? userData.image : undefined
  );
  // This state is for the AsyncCreatableSelectComponent component
  const [selectedTags, setSelectedTags] = useState<TagOption[]>(userData.tags);
  const [userImageFile, setUserImageFile] = useState<File | null>(null);

  const [nameError, setNameError] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [dobError, setDobError] = useState<string[]>([]);
  const [userNameTagError, setUserNameTagError] = useState<string[]>([]);
  const [descriptionError, setDescriptionError] = useState<string[]>([]);
  const [userImageError, setUserImageError] = useState<string[]>([]);
  const [selectedTagsError, setSelectedTagsError] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string>("");

  const fieldSetErrorMap: FieldSetErrorMap = {
    name: setNameError,
    email: setEmailError,
    dob: setDobError,
    nameTag: setUserNameTagError,
    description: setDescriptionError,
    userTags: setSelectedTagsError,
    image: setUserImageError,
  };

  const formDataCheck = (): IUpdateUser | null => {
    const checkDetails = updateUserSchema.safeParse({
      name: name,
      email: email,
      dob: new Date(dob),
      nameTag: userNameTag,
      description: description,
      userTags: selectedTags,
      image: userImage,
    });

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
    const userData: IUpdateUser | null = formDataCheck();
    const isValid: boolean = isValidFormData();

    if (isValid && userData) {
      // Transform image to base64 and overwrite image to userData
      if (userImageFile) {
        const base64Image = await encodeImageToBase64(userImageFile);
        userData.image = base64Image;
      }

      
      // Update user
      updateUser(userData, {
        onError: (error) => {
          setServerError(error.message);
        },
        onSuccess: (data) => {
          console.log("Success!");
          console.log("Updated data : ", data);
          // router.push("/");
        },
      });
    }
  };

  return (
    <>
      <ErrorNotification
        errorMessage={serverError}
        setErrorMessage={setServerError}
      />
      <BackgroundContainer>
        <div className="flex items-center py-60">
          <div className="m-auto w-4/5 max-w-[1250px] rounded-xl bg-white px-12 pt-12 font-poppins shadow-lg">
            <div className="relative flex flex-col items-center">
              <div className="absolute top-[-90px] h-20 w-20 rounded-lg bg-orange p-4">
                <SvgGroupyLogo fillcolor="#ffffff" />
              </div>
              <div className="m-2 text-3xl font-bold text-dark-blue">
                Edit Profile
              </div>
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
                    disabled={updateUser_isLoading}
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
                    disabled={updateUser_isLoading}
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
                    disabled={updateUser_isLoading}
                  />
                </div>

                <div className="w-1/2">
                  <InputField
                    title="@Tag-name"
                    isRequired={false}
                    placeholder="ExampleName25"
                    handleState={{
                      inputState: userNameTag,
                      changeInputState: setUserNameTag,
                    }}
                    handleErrorState={{
                      inputState: userNameTagError,
                      changeInputState: setUserNameTagError,
                    }}
                    disabled={true}
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
                />
                <InputErrorText errorArray={descriptionError} />
              </div>

              <div className="my-4">
                <span>
                  Choose tags which resonates with you the most, or just create
                  them!
                </span>
                <AsyncCreatableSelectComponent
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
                disabled={updateUser_isLoading}
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

export default EditProfile;
