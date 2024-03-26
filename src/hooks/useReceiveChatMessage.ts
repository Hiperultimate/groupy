import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import {
  ServerToClientChatMessageSchema,
  chatRoomMessages,
} from "~/store/atoms/chat";

const useReceiveChatMessage = (socket: Socket) => {
  const setChatRoomMessages = useSetRecoilState(chatRoomMessages);

  useEffect(() => {
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
              [toRoomId]: updatedChatRoomData,
            };
            return updatedChatRoomMessage;
          });
        }
      }
    );

    return () => {
      socket.off("roomData");
    };
  }, [setChatRoomMessages, socket]);
};

export default useReceiveChatMessage;
