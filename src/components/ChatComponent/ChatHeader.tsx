import { useRouter } from "next/router";
import DisplayUserImage from "../DisplayUserImage";
import SvgMenuIcon from "public/SvgMenuIcon";
import { useState } from "react";
import FadeInOut from "../Animation/FadeInOut";
import HeaderMenu, { menuItems, type Options } from "./HeaderMenu";

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
            <HeaderMenu menuOptions={checkPermissions()} />
          </FadeInOut>
        </div>
      </div>
    </div>
  );
};

function checkPermissions() {
  const permission: Options = {};

  // Checks for user's permission to chat
  if (true) {
    permission["leave_chat"] = {
      optionTitle: "Leave Chat",
      useOption: () => {
        console.log("Removed current user from chat logic here");
      },
    };
  }

  // Checks for user is moderator for chat
  if (true) {
    permission[menuItems.invite_member] = {
      optionTitle: "Invite Members",
      useOption: () => {
        console.log("Invoke invite member menu");
      },
    };

    permission[menuItems.remove_member] = {
      optionTitle: "Remove Members",
      useOption: () => {
        console.log("Invoke remove member menu");
      },
    };

    permission[menuItems.make_moderator] = {
      optionTitle: "Make Moderator",
      useOption: () => {
        console.log("Invoke make moderator menu");
      },
    };
  }

  return permission;
}

export default ChatHeader;
