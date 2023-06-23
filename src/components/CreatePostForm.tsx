import { useState } from "react";
import AsyncCreatableSelectComponent, {
  type TagOption,
} from "../components/InputCreatableSelect";
import InputField from "./InputField";

function CreatePostForm() {
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
          <span>Select Age Spectrum : </span>
        </div>
        <div>
          <span>Group Size: </span>
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
