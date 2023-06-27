import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { type ReactElement, useState } from "react";

import AsyncCreatableSelectComponent, {
  type TagOption,
} from "../components/InputCreatableSelect";
import InputField from "./InputField";
import HoverDisplayMessage from "./HoverDisplayMessage";

type TScrollMark = { [key: string]: string | ReactElement };

function CreatePostForm() {
  // UI states
  const scrollAgeMarkScale = {
    1: <span className="relative top-4 font-bold">1 y/o</span>,
    160: <span className="relative top-4 font-bold">160 y/o</span>,
  };
  const scrollGroupMarkScale = {
    1: <span className="relative top-4 font-bold">1 Person</span>,
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

  // These states are temporary until frontend is completed.
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [selectedTagsError, setSelectedTagsError] = useState<string[]>([]);
  return (
    <form className="font-poppins">
      <div className="flex items-center">
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
          value={""}
          //   value={description}
          //   onChange={(e) => {
          //     setDescription(e.target.value);
          //     setDescriptionError([]);
          //   }}
        />
        {/* <InputErrorText errorArray={descriptionError} /> */}
      </div>

      <div className="my-4">
        <span>
          Choose tags which resonates with you the most, or just create them!
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

      <div className="flex">
        <div className="pr-2">Create a group: </div>
        <div className="flex gap-4">
          <div>
            <input type="radio" value="false" className="relative top-[1px]" />
            <span className="pl-1">No</span>
          </div>
          <div>
            <input type="radio" value="true" className="relative top-[1px]" />
            <span className="pl-1">Yes</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center">
          <span className="pr-2">Group Name:</span>
          <InputField isRequired={true} placeholder="Name of your group" />
        </div>
        <div>
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
              min={1}
              max={160}
              onChange={(ageArr) => {
                if (Array.isArray(ageArr)) {
                  const startAge = ageArr[0] as number;
                  const endAge = ageArr[1] as number;
                  const newMark: TScrollMark = scrollAgeMarkScale;
                  newMark[startAge] = `${startAge}`;
                  newMark[endAge] = `${endAge}`;
                  setScrollAgeMark(newMark);
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
        <div>
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
              onChange={(ageArr) => {
                if (Number.isInteger(ageArr)) {
                  const peopleAmtMost = ageArr as number;
                  const newMark: TScrollMark = scrollGroupMarkScale;
                  newMark[peopleAmtMost] = `${peopleAmtMost}`;
                  setGroupMark(newMark);
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
                type="radio"
                value="false"
                className="relative top-[1px]"
              />
              <span className="pl-1">No</span>
            </div>
            <div>
              <input type="radio" value="true" className="relative top-[1px]" />
              <span className="pl-1">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreatePostForm;
