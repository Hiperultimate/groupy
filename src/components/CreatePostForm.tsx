import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState, type ReactElement } from "react";

import AsyncCreatableSelectComponent, {
  type TagOption,
} from "../components/InputCreatableSelect";
import HoverDisplayMessage from "./HoverDisplayMessage";
import InputField from "./InputField";
import StyledImageInput from "./StyledImageInput";
import SvgCamera from "public/SvgCamera";
import Image from "next/image";

type TScrollMark = { [key: string]: string | ReactElement };

function CreatePostForm() {
  const [content, setContent] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [ageSpectrum, setAgeSpectrum] = useState<{
    minAge: number;
    maxAge: number;
  }>({ minAge: 15, maxAge: 30 });
  const [groupSize, setGroupSize] = useState(1);
  const [isInstantJoin, setIsInstantJoin] = useState(false);
  const [userImage, setUserImage] = useState<string | undefined>();
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

  // These states are temporary until frontend is completed.
  const [contentError, setContentError] = useState<string[]>([]);
  const [isGroupError, setIsGroupError] = useState<string[]>([]);
  const [groupNameError, setGroupNameError] = useState<string[]>([]);
  const [ageSpectrumError, setAgeSpectrumError] = useState<string[]>([]);
  const [groupSizeError, setGroupSizeError] = useState<string[]>([]);
  const [isInstantJoinError, setIsInstantJoinError] = useState<string[]>([]);
  const [userImageError, setUserImageError] = useState<string[]>([]);
  const [selectedTagsError, setSelectedTagsError] = useState<string[]>([]);

  function handleFormSubmit() {
    console.log({
      content,
      isGroup,
      groupName,
      ageSpectrum,
      groupSize,
      isInstantJoin,
      userImage,
      userImageFile,
      selectedTags,
    });
  }

  // UI states
  const scrollAgeMarkScale = {
    1: (
      <span className="relative top-4 font-bold">
        1<br />
        y/o
      </span>
    ),
    160: <span className="relative top-4 font-bold">160 y/o</span>,
  };
  const scrollGroupMarkScale = {
    1: (
      <span className="relative top-4 font-bold">
        1<br />
        Person
      </span>
    ),
    100: <span className="relative top-4 font-bold">100 People</span>,
  };
  const [scrollAgeMark, setScrollAgeMark] = useState<TScrollMark>({
    ...scrollAgeMarkScale,
    15: `15`,
    30: `30`,
  });

  const [groupMark, setGroupMark] = useState<TScrollMark>({
    ...scrollGroupMarkScale,
    5: `5`,
  });

  return (
    <form className="font-poppins">
      <div className="flex items-center justify-center">
        <div className="m-2 text-3xl font-bold text-dark-blue">
          Create your post
        </div>
      </div>

      <div className="my-2 flex w-full flex-col">
        <label htmlFor="describe" className="hover:cursor-pointer">
          Type Something
        </label>
        <textarea
          id="description"
          placeholder="What do you want to talk about?"
          rows={4}
          className="rounded-lg border-2 px-4 py-3"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setContentError([]);
          }}
        />
        {/* <InputErrorText errorArray={descriptionError} /> */}
      </div>

      <div className="my-4">
        <span>
          Choose tags which resonates with your post the most, or just create
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

      <div className="my-2 flex">
        <div className="pr-2">Create a group: </div>
        <div className="flex gap-4">
          <div>
            <input
              id="group_no"
              type="radio"
              checked={isGroup === false}
              className="relative top-[1px] hover:cursor-pointer"
              onClick={() => {
                setIsGroup(false);
              }}
            />
            <label htmlFor="group_no" className="pl-1 hover:cursor-pointer">
              No
            </label>
          </div>
          <div>
            <input
              id="group_yes"
              type="radio"
              checked={isGroup === true}
              className="relative top-[1px] hover:cursor-pointer"
              onClick={() => setIsGroup(true)}
            />
            <label htmlFor="group_yes" className="pl-1 hover:cursor-pointer">
              Yes
            </label>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg border-2 border-dashed border-light-grey p-6 ${
          !isGroup ? `blur-sm` : ``
        } `}
      >
        <div className="my-2 items-center">
          <span className="pr-2">Group Name:</span>
          <InputField
            isRequired={true}
            placeholder="Name of your group"
            disabled={!isGroup}
            handleState={{
              inputState: groupName,
              changeInputState: setGroupName,
            }}
            handleErrorState={{
              inputState: groupNameError,
              changeInputState: setGroupNameError,
            }}
          />
        </div>
        <div className="my-2">
          <span>
            Select Age Spectrum
            <span className="mx-1">
              <HoverDisplayMessage message="Select the age spectrum which can display this post and join your group." />
            </span>
            :
          </span>
          <div className="h-20">
            <Slider
              marks={scrollAgeMark}
              range={true}
              allowCross={false}
              disabled={!isGroup}
              min={1}
              max={160}
              onChange={(ageArr) => {
                if (Array.isArray(ageArr)) {
                  const startAge = ageArr[0];
                  const endAge = ageArr[1];
                  if (
                    typeof startAge === "number" &&
                    typeof endAge === "number"
                  ) {
                    const newMark: TScrollMark = scrollAgeMarkScale;
                    newMark[startAge] = `${startAge}`;
                    newMark[endAge] = `${endAge}`;
                    setScrollAgeMark(newMark);
                    setAgeSpectrum({ minAge: startAge, maxAge: endAge });
                  }
                }
              }}
              defaultValue={[15, 30]}
              trackStyle={{
                backgroundColor: "orange",
              }}
              handleStyle={{
                borderColor: "orange",
              }}
            />
          </div>
        </div>
        <div className="my-2">
          <span>
            Group Size
            <span className="mx-1">
              <HoverDisplayMessage message="Select the maximum number of people you want in your group." />
            </span>
            :
          </span>
          <div className="h-20">
            <Slider
              marks={groupMark}
              min={1}
              max={100}
              disabled={!isGroup}
              onChange={(ageArr) => {
                if (Number.isInteger(ageArr)) {
                  const peopleAmtMost = ageArr;
                  if (typeof peopleAmtMost === "number") {
                    const newMark: TScrollMark = scrollGroupMarkScale;
                    newMark[peopleAmtMost] = `${peopleAmtMost}`;
                    setGroupMark(newMark);
                    setGroupSize(peopleAmtMost);
                  }
                }
              }}
              defaultValue={5}
              trackStyle={{
                backgroundColor: "orange",
              }}
              handleStyle={{
                borderColor: "orange",
              }}
            />
          </div>
        </div>
        <div className="flex">
          <span className="pr-2">Instant Join: </span>
          <div className="flex gap-4">
            <div>
              <input
                id="join_no"
                type="radio"
                checked={isInstantJoin === false}
                className="relative top-[1px] hover:cursor-pointer"
                disabled={!isGroup}
                onClick={() => {
                  setIsInstantJoin(false);
                }}
              />
              <label htmlFor="join_no" className="pl-1 hover:cursor-pointer">
                No
              </label>
            </div>
            <div>
              <input
                id="join_yes"
                type="radio"
                checked={isInstantJoin === true}
                className="relative top-[1px] hover:cursor-pointer"
                disabled={!isGroup}
                onClick={() => {
                  setIsInstantJoin(true);
                }}
              />
              <label htmlFor="join_yes" className="pl-1 hover:cursor-pointer">
                Yes
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4">
        <StyledImageInput
          title={"Upload a picture"}
          setUserImage={setUserImage}
          setUserImageFile={setUserImageFile}
          setUserImageError={setUserImageError}
          userImageError={userImageError}
        />
      </div>

      <div className="my-4">
        <span>Your Profile Picture</span>
        <div className="flex items-center justify-center bg-[#d9d9d9]">
          {userImage === undefined ? (
            <div className="relative m-4 flex h-48 w-full items-center justify-center bg-[#d9d9d9]">
              <SvgCamera />
            </div>
          ) : (
            <Image
              src={userImage}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto", maxHeight: "600px" }}
              alt={"An error occured while loading the image."}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        className="h-12 w-full rounded-lg bg-orange text-white transition duration-300 ease-in-out hover:bg-[#ff853e]"
        onClick={handleFormSubmit}
        // disabled={signInFetching}
      >
        Create
      </button>
    </form>
  );
}

export default CreatePostForm;
