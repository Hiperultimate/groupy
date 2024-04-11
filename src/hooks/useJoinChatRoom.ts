import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import { chatOptionState } from "~/store/atoms/chat";
import { api } from "~/utils/api";

const useJoinChatRoom = (socket: Socket) => {
  const [userChatList, setUserChatList] = useRecoilState(chatOptionState);

  // Currently in progress
  const {data : chatOptions } = api.group.getCurrentUserGroupOptions.useQuery();


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