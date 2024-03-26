import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { type Socket } from "socket.io-client";
import { chatOptionState } from "~/store/atoms/chat";

const useJoinChatRoom = (socket: Socket) => {
  const userChatList = useRecoilValue(chatOptionState);

  useEffect(() => {
    userChatList.forEach((chatData) => {
      socket.emit("joinRoom", chatData.roomID);
    });
    return () => {
      socket.off("joinRoom");
    };
  },[socket, userChatList]);
};

export default useJoinChatRoom;