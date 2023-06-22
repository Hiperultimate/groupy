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

  function outsideModalClickHandler(e: React.MouseEvent) {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      dialogRef.current?.close();
    }
  }

  return (
    <div>
      <dialog ref={dialogRef} onClick={(e) => outsideModalClickHandler(e)}>
        <header>
          <div>
            <div className="flex items-center">
              <div className="m-2 text-3xl font-bold text-dark-blue">
                Create your post
              </div>
            </div>
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
