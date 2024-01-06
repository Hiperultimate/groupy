import ChatDialogs from "./ChatDialogs";
import ChatHeader from "./ChatHeader";
import ChatTextInput from "./ChatTextInput";

const ChatArea = () => {
  return (
    <div className="h-full flex flex-col ">
      <div className="h-24">
        <ChatHeader />
      </div>
      <div className="flex-auto">
        <ChatDialogs />
      </div>
      <div className="h-20">
        <ChatTextInput />
      </div>
    </div>
  );
};

export default ChatArea;
