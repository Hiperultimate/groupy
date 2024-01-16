import { useState } from "react";
import DisplayUserImage from "../DisplayUserImage";
import { timeDifference } from "~/utils/timeOperations";
import { useSetRecoilState } from "recoil";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";

type TChatOptionComponent = Omit<TChatOption, "chatUserTag">;

const ChatOption = ({
  id,
  chatName,
  chatImg,
  chatLastMsg,
  lastMsgSentAt,
  unreadMsgCount,
  isSelected,
}: TChatOptionComponent) => {
  // Demo data to populate last read message
  const demoCurrentDate = new Date("2023-12-30");

  const [unreadMessageCount, setUnreadMessageCount] = useState(unreadMsgCount);
  const [lastChatMsg, setLastChatMsg] = useState(chatLastMsg);
  const [lastReadMsgTime, setLastReadMsgTime] = useState(
    timeDifference(demoCurrentDate, lastMsgSentAt)
  );
  const setChatOptions = useSetRecoilState(chatOptionState);

  function selectChatOption() {
    setChatOptions((chatOptions) => {
      const updatedOptions = chatOptions.map((chat) => {
        if (chat.id === id) {
          return { ...chat, isSelected: true };
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
            {lastChatMsg}
          </div>
          <div>
            <div className="m-2 h-1 w-1 rounded-full bg-grey"></div>
          </div>
          <div>{lastReadMsgTime}</div>
        </div>
      </div>
      <div className="flex w-full items-center">
        <div className="ml-auto mr-3 rounded-full bg-orange px-2 py-1 text-[11px] text-white">
          {unreadMessageCount > 999 ? "999+" : unreadMessageCount}
        </div>
      </div>
    </div>
  );
};

export default ChatOption;
