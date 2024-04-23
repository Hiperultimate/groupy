import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import {
  type TServerToClientChatMessageSchema,
  ServerToClientChatMessageSchema,
  chatRoomMessages,
  chatOptionState,
} from "~/store/atoms/chat";

type TServerIncomingChatMessage = Omit<
  TServerToClientChatMessageSchema,
  "sentAt"
> & { sentAt: number };

const useReceiveChatMessage = (socket: Socket) => {
  const setChatRoomMessages = useSetRecoilState(chatRoomMessages);
  const setChatOption = useSetRecoilState(chatOptionState);

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
          const newMessage = isValidMsg.data;
          const toRoomId = newMessage.roomId;
          setChatRoomMessages((existingData) => {
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

          setChatOption((options) => {
            const requiredRoom = options.find(
              (room) => room.roomID === toRoomId
            );

            if (!requiredRoom) {
              console.log(
                "Client side error, unable to update required chatRoomOption with latest message"
              );
              return options;
            }

            const updateRequiredRoom = {
              ...requiredRoom,
              chatLastMsg: newMessage.message,
              lastMsgSentAt: newMessage.sentAt,
            };

            const updateOptions = options.map((chatOption) => {
              if (chatOption.roomID === toRoomId) {
                return updateRequiredRoom;
              }
              return chatOption;
            });

            return updateOptions;
          });
        }
      }
    );

    return () => {
      socket.off("roomData");
    };
  }, [setChatRoomMessages, setChatOption, socket]);
};

export default useReceiveChatMessage;
