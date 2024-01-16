import { useRouter } from "next/router";
import DisplayUserImage from "../DisplayUserImage";

const ChatHeader = ({
  authorName,
  authorAtTag,
  authorProfilePicture,
}: {
  authorName: string;
  authorAtTag: string | null;
  authorProfilePicture: string | null;
}) => {
  const router = useRouter();
  function redirectToSelectedUser() {
    if (authorAtTag) {
      void router.push(`/${authorAtTag}`);
    }
  }

  return (
    <div className="m-4 flex items-center ">
      <div>
        <DisplayUserImage
          userImage={authorProfilePicture}
          sizeOption="medium"
        />
      </div>
      <div className="ml-5 flex justify-between">
        <div
          className="flex flex-wrap hover:cursor-pointer"
          onClick={redirectToSelectedUser}
        >
          <div className="font-bold">
            <span className=" underline-offset-4 hover:underline">
              {authorName}
            </span>
          </div>
          {authorAtTag && (
            <div className="ml-1 text-grey">
              <span className=" underline-offset-4 hover:underline">
                @{authorAtTag}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
