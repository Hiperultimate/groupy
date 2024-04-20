import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";
import { api } from "~/utils/api";

const useJoinChatRoom = (socket: Socket) => {
  const setUserChatList = useSetRecoilState(chatOptionState);

  const { data: fetchChatOptions, isSuccess } =
    api.group.getCurrentUserGroupOptions.useQuery(
      undefined,
      {
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    if (isSuccess) {
      const chatOptions: TChatOption[] = fetchChatOptions.map((option) => {
        return { ...option, isSelected: false };
      });
      setUserChatList(chatOptions);
      chatOptions.forEach((option) => {
        socket.emit("joinRoom", option.roomID);
      });
    }
    return () => {
      socket.off("joinRoom");
    };
  }, [socket, fetchChatOptions, setUserChatList, isSuccess]);
};

export default useJoinChatRoom;
