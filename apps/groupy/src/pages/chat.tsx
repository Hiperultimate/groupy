import { type NextPage } from "next";
import { useRecoilValue } from "recoil";

import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";
import useChatConnect from "~/hooks/useChatConnect";
import useJoinChatRoom from "~/hooks/useJoinChatRoom";
import useReceiveChatMessage from "~/hooks/useReceiveChatMessage";

import { chatEditModalData } from "~/store/atoms/chat";

const Chat: NextPage = () => {
  const editModalData = useRecoilValue(chatEditModalData);

  const socket = useChatConnect();
  useJoinChatRoom(socket);
  useReceiveChatMessage(socket);

  return (
    <>
      <ChatMemberEditModal
        chatId={editModalData.chatId}
        editType={editModalData.editType}
      />
      <main className="flex pt-20 font-poppins">
        <div className="w-3/12 border ">
          <UserChatList />
        </div>
        <div className="w-9/12 border border-l-0 ">
          <ChatArea />
        </div>
      </main>
    </>
  );
};

export default Chat;
