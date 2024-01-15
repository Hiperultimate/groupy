import SvgChatIcon from "public/SvgChatIcon";
import { useState } from "react";

const ChatTextInput = () => {
  const [chatInput, setChatInput] = useState("");
  return (
    <div className="flex h-full items-center justify-center border-t">
      <div className="flex h-11 w-full items-center justify-center rounded-full border">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="mx-5 w-full text-lg outline-none"
        />
        <span className="h-full border-l" />
        <div className="relative top-[2px] pl-3 pr-4 hover:cursor-pointer">
          <SvgChatIcon />
        </div>
      </div>
    </div>
  );
};

export default ChatTextInput;
