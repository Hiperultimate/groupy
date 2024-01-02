import ChatOption from "./ChatOption";

const dummyChatData = [
  {
    id: 123123,
    chatName: "John Smith",
    chatImg: null,
    chatLastMsg: "That would be great!",
    lastMsgSentAt: new Date(new Date("2023-12-30").setSeconds(new Date().getSeconds() - 57)),
    unreadMsgCount: 12,
  },
  {
    id: 12312233,
    chatName: "Immortals",
    chatImg: null,
    chatLastMsg: "Another day another win",
    lastMsgSentAt: new Date(new Date("2023-12-30").setHours(new Date().getHours() - 18)),
    unreadMsgCount: 1,
  },
  {
    id: 1231523,
    chatName: "Lazy Group",
    chatImg: null,
    chatLastMsg: "Darui..",
    lastMsgSentAt: new Date(new Date("2023-12-30").setMonth(new Date().getMonth() - 3)),
    unreadMsgCount: 2190,
  },
];

const UserChatList = () => {
  return (
    <div className="chat-viewport-height border">
      User Chat List
      {dummyChatData.map((chatData) => {
        return (
          <ChatOption
            key={chatData.id}
            chatName={chatData.chatName}
            chatImg={chatData.chatImg}
            chatLastMsg={chatData.chatLastMsg}
            lastMsgSentAt={chatData.lastMsgSentAt}
            unreadMsgCount={chatData.unreadMsgCount}
          />
        );
      })}
    </div>
  );
};

export default UserChatList;
