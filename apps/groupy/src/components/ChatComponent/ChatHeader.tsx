import { useRouter } from "next/router";
import DisplayUserImage from "../DisplayUserImage";
import SvgMenuIcon from "public/SvgMenuIcon";
import { type Dispatch, type SetStateAction, useState } from "react";
import FadeInOut from "../Animation/FadeInOut";
import HeaderMenu, { menuItems, type Options } from "./HeaderMenu";
import OutsideClickDetector from "../OutsideClickDetector";
import { type SetterOrUpdater, useSetRecoilState } from "recoil";
import {
  chatEditModalData,
  type ChatMemberEditType,
  isChatEditModelOpen,
} from "~/store/atoms/chat";
import { invokeChatMemberEditModal } from "./ChatMemberEditModal";

const ChatHeader = ({
  chatId,
  authorName,
  authorAtTag,
  authorProfilePicture,
}: {
  chatId: string;
  authorName: string;
  authorAtTag: string | null;
  authorProfilePicture: string | null;
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setIsEditChatModalOpen = useSetRecoilState(isChatEditModelOpen);
  const setChatEditModalData = useSetRecoilState(chatEditModalData);

  function redirectToSelectedUser() {
    if (authorAtTag) {
      void router.push(`/${authorAtTag}`);
    }
  }

  function displayMenu() {
    setIsMenuOpen((previousState) => !previousState);
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
            <OutsideClickDetector
              onOutsideClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <HeaderMenu
                menuOptions={checkPermissions(
                  invokeChatMemberEditModal,
                  setIsEditChatModalOpen,
                  setChatEditModalData,
                  setIsMenuOpen,
                  chatId
                )}
              />
            </OutsideClickDetector>
          </FadeInOut>
        </div>
      </div>
    </div>
  );
};

function checkPermissions(
  invokeChatMemberEditModal: (
    setIsEditChatModalOpen: SetterOrUpdater<boolean>,
    setChatEditModalData: SetterOrUpdater<{
      chatId: string;
      editType: ChatMemberEditType;
    }>,
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>,
    chatId: string,
    editType: ChatMemberEditType
  ) => void,
  
  setIsEditChatModalOpen: SetterOrUpdater<boolean>,
  setChatEditModalData: SetterOrUpdater<{
    chatId: string;
    editType: ChatMemberEditType;
  }>,
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>,
  chatId: string
) {
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
        invokeChatMemberEditModal(
          setIsEditChatModalOpen,
          setChatEditModalData,
          setIsMenuOpen,
          chatId,
          menuItems.invite_member
        );
      },
    };

    permission[menuItems.remove_member] = {
      optionTitle: "Remove Members",
      useOption: () => {
        invokeChatMemberEditModal(
          setIsEditChatModalOpen,
          setChatEditModalData,
          setIsMenuOpen,
          chatId,
          menuItems.remove_member
        );
      },
    };

    permission[menuItems.make_moderator] = {
      optionTitle: "Make Moderator",
      useOption: () => {
        invokeChatMemberEditModal(
          setIsEditChatModalOpen,
          setChatEditModalData,
          setIsMenuOpen,
          chatId,
          menuItems.make_moderator
        );
      },
    };
  }

  return permission;
}

export default ChatHeader;
