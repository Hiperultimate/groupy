import { type NextPage } from "next";
import { useRecoilValue } from "recoil";
import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";
import { chatEditModalData } from "~/store/atoms/chat";

const Chat: NextPage = () => {
  const editModalData = useRecoilValue(chatEditModalData);
  return (
    <>
      <ChatMemberEditModal
        chatId={editModalData.chatId}
        editType={editModalData.editType}
      />
      <main className="flex pt-20 font-poppins">
        <div className="absolute top-2  flex h-full w-full items-center justify-center">
          <span className="background-animate z-50 rounded-md bg-cyan-600 p-4 text-white">
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
    </>
  );
};

export default Chat;
