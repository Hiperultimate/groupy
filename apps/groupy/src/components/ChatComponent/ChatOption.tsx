import { useState } from "react";
import DisplayUserImage from "../DisplayUserImage";
import { timeDifference } from "~/utils/timeOperations";
import { useSetRecoilState } from "recoil";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";

type TChatOptionComponent = Omit<TChatOption, "chatUserTag">;

const ChatOption = ({
  roomID,
  chatName,
  chatImg,
  chatLastMsg,
  lastMsgSentAt,
  unreadMsgCount,
  isSelected,
}: TChatOptionComponent) => {
  const setChatOptions = useSetRecoilState(chatOptionState);

  function selectChatOption() {
    setChatOptions((chatOptions) => {
      const updatedOptions = chatOptions.map((chat) => {
        if (chat.roomID === roomID) {
          return { ...chat, isSelected: true, unreadMsgCount: 0 };
        }
        return { ...chat, isSelected: false };
      });

      return updatedOptions;
    });
  }

  return (
    <div
      onClick={selectChatOption}
      className={`flex hover:cursor-pointer hover:bg-slate-200 ${
        isSelected ? "bg-slate-100" : ""
      } `}
    >
      <div className="p-2">
        <DisplayUserImage userImage={chatImg} sizeOption="small" />
      </div>
      <div className="flex min-w-[55%] flex-col justify-center text-sm">
        <div>{chatName}</div>
        <div className="flex w-full text-grey">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap ">
            {chatLastMsg}
          </div>
          {chatLastMsg && (
            <div>
              <div className="m-2 h-1 w-1 rounded-full bg-grey"></div>
            </div>
          )}
          <div>
            {lastMsgSentAt !== null
              ? timeDifference(new Date(), lastMsgSentAt)
              : ""}
          </div>
        </div>
      </div>
      {unreadMsgCount > 0 && <div className="flex w-full items-center">
        <div className="ml-auto mr-3 rounded-full bg-orange px-2 py-1 text-[11px] text-white">
          {unreadMsgCount > 999 ? "999+" : unreadMsgCount}
        </div>
      </div>}
    </div>
  );
};

export default ChatOption;
