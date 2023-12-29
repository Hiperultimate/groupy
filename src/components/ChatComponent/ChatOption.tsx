import { useState } from "react";
import DisplayUserImage from "../DisplayUserImage";

const ChatOption = () => {
  const [unreadMessage, setUnreadMessage] = useState(1243);
  const demoDate = new Date().getHours();

  return (
    <div className="flex">
      <div className="p-2">
        <DisplayUserImage userImage={null} sizeOption="small" />
      </div>
      <div className="flex min-w-[55%] flex-col justify-center text-sm">
        <div>John Smith</div>
        <div className="flex w-full text-grey">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap ">
            That should be perfect, lets go with that!
          </div>
          <div>
            <div className="m-2 h-1 w-1 rounded-full bg-grey"></div>
          </div>
          <div>{demoDate}h</div>
        </div>
      </div>
      <div className="flex w-full items-center">
        <div className="ml-auto mr-3 rounded-full bg-orange px-2 py-1 text-[11px] text-white">
          {unreadMessage > 999 ? "999+" : unreadMessage}
        </div>
      </div>
    </div>
  );
};

export default ChatOption;
