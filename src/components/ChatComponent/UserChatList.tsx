import ChatOption from "./ChatOption";
import { chatOptionState } from "~/store/atoms/chat";
import { useRecoilValue } from "recoil";

const UserChatList = () => {
  const chatOptions = useRecoilValue(chatOptionState);

  return (
    <div className="chat-viewport-height border">
      {chatOptions.map((chatData) => {
        return (
          <ChatOption
            key={chatData.id}
            id={chatData.id}
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
