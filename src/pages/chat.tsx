import { type NextPage } from "next";
import ChatArea from "~/components/ChatComponent/ChatArea";
import UserChatList from "~/components/ChatComponent/UserChatList";

const Chat: NextPage = () => {
  return (
    <main className="flex pt-20 font-poppins">
      <div className="absolute top-2  flex h-full w-full items-center justify-center">
        <span className="background-animate z-50 rounded-md p-4 bg-cyan-600 text-white">
          ! Work in progress !
        </span>
      </div>
      <div className="w-3/12 border blur">
        <UserChatList />
      </div>
      <div className="w-9/12 border border-l-0 blur">
        <ChatArea />
      </div>
    </main>
  );
};

export default Chat;
