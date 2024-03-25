import { type NextPage } from "next";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";

import {
  ServerToClientChatMessageSchema,
  chatEditModalData,
  chatOptionState,
  chatRoomMessages,
} from "~/store/atoms/chat";
import { socket } from "~/utils/socket";

const Chat: NextPage = () => {
  const editModalData = useRecoilValue(chatEditModalData);
  const userChatList = useRecoilValue(chatOptionState);
  const setChatRoomMessages = useSetRecoilState(chatRoomMessages);

  useEffect(() => {
    socket.connect();
    socket.on(
      `roomData`,
      (roomData: {
        [key: string]: {
          id: string;
          senderName: string;
          message: string;
          sentAt: number;
          senderTag: string;
          roomId: string;
          senderImg: string | null;
        };
      }) => {
        const messageUpdate = {
          ...roomData,
          roomID: roomData.roomId,
          sentAt: new Date(Number(roomData.sentAt)),
        };
        const isValidMsg =
          ServerToClientChatMessageSchema.safeParse(messageUpdate);
        if (!isValidMsg.success) {
          console.log("Incorrect type : ", isValidMsg.error);
        } else {
          setChatRoomMessages((existingData) => {
            const newMessage = isValidMsg.data;
            newMessage.sentAt = new Date(newMessage["sentAt"]);
            const toRoomId = newMessage.roomId;
            const existingRoomChatData = existingData[toRoomId];
            if (!existingRoomChatData) {
              // toast some error message
              return existingData;
            }
            const updatedChatRoomData = [...existingRoomChatData, newMessage];
            const updatedChatRoomMessage = {
              ...existingData,
              [toRoomId] : updatedChatRoomData
            }
            return updatedChatRoomMessage;
          });
        }
      }
    );
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
