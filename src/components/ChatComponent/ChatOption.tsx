import { useState } from "react";
import DisplayUserImage from "../DisplayUserImage";
import { timeDifference } from "~/utils/timeOperations";

const ChatOption = () => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(1243);


  // Demo data to populate last read message 
  const demoCurrentDate = new Date("2023-12-30");
  const demoOldDate = new Date(demoCurrentDate);
  // demoOldDate.setFullYear(demoCurrentDate.getFullYear() - 3);
  // demoOldDate.setMonth(demoCurrentDate.getMonth() - 3);
  // demoOldDate.setHours(demoCurrentDate.getHours() - 18);
  demoOldDate.setSeconds(demoCurrentDate.getSeconds() - 57);

  const [lastReadMsgTime, setLastReadMsgTime] = useState(
    timeDifference(demoCurrentDate, demoOldDate)
  );

  console.log(timeDifference(demoCurrentDate, demoOldDate));

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
