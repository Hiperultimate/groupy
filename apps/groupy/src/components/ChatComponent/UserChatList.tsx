import ChatOption from "./ChatOption";
import {
  chatOptionState,
  isChatOptionLoading as isChatOptionLoadingState,
} from "~/store/atoms/chat";
import { useRecoilValue } from "recoil";
import LoadingAnimation from "../LoadingAnimation";

const UserChatList = () => {
  const isChatOptionLoading = useRecoilValue(isChatOptionLoadingState);
  const chatOptions = useRecoilValue(chatOptionState);

  if (isChatOptionLoading) {
    return (
      <div className="chat-viewport-height flex w-full justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="chat-viewport-height overflow-y-auto">
      {chatOptions.map((chatData) => {
        return (
          <ChatOption
            key={chatData.roomID}
            roomID={chatData.roomID}
            chatName={chatData.chatName}
            chatImg={chatData.chatImg}
            chatLastMsg={chatData.chatLastMsg}
            lastMsgSentAt={chatData.lastMsgSentAt}
            unreadMsgCount={chatData.unreadMsgCount}
            isSelected={chatData.isSelected}
          />
        );
      })}
    </div>
  );
};

export default UserChatList;
