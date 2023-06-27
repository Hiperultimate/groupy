import { useRef } from "react";
import DisplayUserImage from "./DisplayUserImage";

interface DialogElement extends HTMLDialogElement {
  showModal: () => void;
  close: () => void;
  // Add any additional properties or methods specific to your dialog
}

/* On clicking the input field, open a modal which has all the form options to create a post */
const CreatePostInput = ({
  userImage,
}: {
  userImage: string | null | undefined;
}) => {
  const dialogRef = useRef<DialogElement>(null);

  return (
    <div>
      <dialog ref={dialogRef}>
        <header>
          <div>
            <h2>Create a post</h2>
            <button
              onClick={() => {
                dialogRef.current?.close();
              }}
            >
              Close
            </button>
          </div>
        </header>
        <section></section>
      </dialog>
      <div className="mx-3 flex rounded-lg bg-white p-3 font-poppins shadow-md">
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
          onClick={() => {
            dialogRef.current?.showModal();
          }}
        />
      </div>
    </div>
  );
};

export default CreatePostInput;
