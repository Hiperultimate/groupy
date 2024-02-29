import { useRecoilValue } from "recoil";
import ChatDialogs from "./ChatDialogs";
import ChatHeader from "./ChatHeader";
import ChatTextInput from "./ChatTextInput";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";
import { useState } from "react";

const ChatArea = () => {
  const chatData = useRecoilValue(chatOptionState);
  const [textInput, setTextInput] = useState("");

  const activeChat: TChatOption | undefined = chatData.find((chat) => {
    return chat.isSelected === true;
  });

  if (!activeChat) {
    return <></>;
  }

  return (
    <div className="flex h-full flex-col ">
      <div className="h-24 border-b border-light-grey">
        <ChatHeader
          chatId={activeChat.roomID}
          authorName={activeChat.chatName}
          authorAtTag={activeChat.chatUserTag}
          authorProfilePicture={activeChat.chatImg}
        />
      </div>
      <div className="h-2 flex-grow overflow-y-auto">
        <ChatDialogs chatId={activeChat.roomID} />
      </div>
      <div className="flex h-20 flex-col items-center justify-center border-t px-4">
        <ChatTextInput
          chatId={activeChat.roomID}
          inputState={textInput}
          setInputState={setTextInput}
        />
      </div>
    </div>
  );
};

export default ChatArea;
