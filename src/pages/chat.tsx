import { type NextPage } from "next";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";
import { chatEditModalData } from "~/store/atoms/chat";
import { socket } from "~/utils/socket";

const Chat: NextPage = () => {
  const editModalData = useRecoilValue(chatEditModalData);

  useEffect(() => {
    console.log("Connecting with socketio");
    const roomId = "1233412";
    socket.connect();
    socket.emit("create", roomId);
    socket.emit("roomMsg", { roomId: roomId, message: "Hello socketio!" });
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
