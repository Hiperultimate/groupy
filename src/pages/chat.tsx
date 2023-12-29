import { type NextPage } from "next";
import ChatArea from "~/components/ChatComponent/ChatArea";
import UserChatList from "~/components/ChatComponent/UserChatList";

const Chat: NextPage = () => {
  return (
    <main className="flex pt-20 font-poppins">
      <div className="w-3/12">
        <UserChatList />
      </div>
      <div>
        <ChatArea />
      </div>
    </main>
  );
};

export default Chat;
