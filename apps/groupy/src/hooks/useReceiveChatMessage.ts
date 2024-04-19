import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import {
  type TServerToClientChatMessageSchema,
  ServerToClientChatMessageSchema,
  chatRoomMessages,
} from "~/store/atoms/chat";

type TServerIncomingChatMessage = Omit<
  TServerToClientChatMessageSchema,
  "sentAt"
> & { sentAt: number };

const useReceiveChatMessage = (socket: Socket) => {
  const setChatRoomMessages = useSetRecoilState(chatRoomMessages);

  useEffect(() => {
    socket.on(
      `roomData`,
      ({
        id,
        senderName,
        senderTag,
        sentAt,
        senderImg,
        roomId,
        message,
      }: TServerIncomingChatMessage) => {
        const messageUpdate = {
          id,
          senderName,
          senderTag,
          senderImg,
          roomId,
          message,
          roomID: roomId,
          sentAt: new Date(Number(sentAt)),
        };
        const isValidMsg =
          ServerToClientChatMessageSchema.safeParse(messageUpdate);
        if (!isValidMsg.success) {
          console.log("Incorrect type : ", isValidMsg.error);
        } else {
          setChatRoomMessages((existingData) => {
            const newMessage = isValidMsg.data;
            const toRoomId = newMessage.roomId;
            const existingRoomChatData = existingData[toRoomId];
            if (!existingRoomChatData) {
              // Creating new room in chatRoomMessages
              return {
                [toRoomId]: [newMessage],
              };
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
