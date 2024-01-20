import { useRouter } from "next/router";
import DisplayUserImage from "../DisplayUserImage";
import SvgMenuIcon from "public/SvgMenuIcon";
import { useState } from "react";
import FadeInOut from "../Animation/FadeInOut";

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function redirectToSelectedUser() {
    if (authorAtTag) {
      void router.push(`/${authorAtTag}`);
    }
  }

  function displayMenu() {
    console.log("Display menu...");
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className="m-4 flex items-center ">
      <div>
        <DisplayUserImage
          userImage={authorProfilePicture}
          sizeOption="medium"
        />
      </div>
      <div className="ml-5 flex w-full items-center justify-between">
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
        <div>
          <div className="hover:cursor-pointer" onClick={displayMenu}>
            <SvgMenuIcon />
          </div>
          <FadeInOut displayState={isMenuOpen}>
            {/* Menu logic here */}
            <div className="absolute right-5  w-44 border border-light-grey bg-white">
              Hello
            </div>
          </FadeInOut>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
