import { type NextPage } from "next";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";
import { chatEditModalData, chatOptionState } from "~/store/atoms/chat";
import { socket } from "~/utils/socket";

const Chat: NextPage = () => {
  const editModalData = useRecoilValue(chatEditModalData);
  const userChatList = useRecoilValue(chatOptionState);

  useEffect(() => {
    socket.connect();
    socket.on(`roomData`, (roomData) => {
      console.log("Checking :", roomData);
    });
    userChatList.forEach((chatData) => {
      socket.emit("joinRoom", chatData.roomID);
    });

    return () => {
      // Cleanup logic to remove socket connections
      socket.off("roomData");
      socket.off("joinRoom");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
