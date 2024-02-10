import { useRecoilValue } from "recoil";
import ChatDialogs from "./ChatDialogs";
import ChatHeader from "./ChatHeader";
import ChatTextInput from "./ChatTextInput";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";
import { useEffect, useState } from "react";
import { socket } from "~/utils/socket";

const ChatArea = () => {
  const chatData = useRecoilValue(chatOptionState);
  const [textInput, setTextInput] = useState("");

  const activeChat: TChatOption | undefined = chatData.find((chat) => {
    return chat.isSelected === true;
  });

  useEffect(() => {
    if (activeChat) {
      socket.emit("joinRoom", activeChat.id);
      socket.on(`room:${activeChat.id}`, (roomData) => {
        console.log("Checking :" , roomData);
      });
    }
  }, [activeChat]);

  if (!activeChat) {
    return <></>;
  }

  return (
    <div className="flex h-full flex-col ">
      <div className="h-24 border-b border-light-grey">
        <ChatHeader
          chatId={activeChat.id}
          authorName={activeChat.chatName}
          authorAtTag={activeChat.chatUserTag}
          authorProfilePicture={activeChat.chatImg}
        />
      </div>
      <div className="h-2 flex-grow overflow-y-auto">
        <ChatDialogs chatId={activeChat.id} />
      </div>
      <div className="flex h-20 flex-col items-center justify-center border-t px-4">
        <ChatTextInput
          chatId={activeChat.id}
          inputState={textInput}
          setInputState={setTextInput}
        />
      </div>
    </div>
  );
};

export default ChatArea;
