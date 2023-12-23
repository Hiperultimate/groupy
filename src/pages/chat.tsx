import { type NextPage } from "next";
import ChatArea from "~/components/ChatComponent/ChatArea";
import UserChatList from "~/components/ChatComponent/UserChatList";

const Chat: NextPage = () => {
  return (
    <main className="flex pt-20">
      <div className="w-1/5">
        <UserChatList />
      </div>
      <div className="w-4/5">
        <ChatArea />
      </div>
    </main>
  );
};

export default Chat;
