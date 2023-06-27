import DisplayUserImage from "./DisplayUserImage";

/* On clicking the input field, open a modal which has all the form options to create a post */
const CreatePostInput = ({
  userImage,
}: {
  userImage: string | null | undefined;
}) => {
  return (
    <div className="mx-3 flex w-[545px] rounded-lg bg-white p-3 font-poppins shadow-md">
      <div>
        <DisplayUserImage userImage={userImage} sizeOption="small" />
      </div>
      <input
        className="ml-3 w-full rounded-full border-2 pl-5 pr-6"
        type="text"
        name="createPostInput"
        value=""
        placeholder="Create a post &rarr;"
        onChange={() => {
          console.log("Placeholder");
        }}
      />
    </div>
  );
};

export default CreatePostInput;
