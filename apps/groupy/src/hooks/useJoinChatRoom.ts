import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";
import { api } from "~/utils/api";

const useJoinChatRoom = (socket: Socket, currentUserId: string) => {
  const setUserChatList = useSetRecoilState(chatOptionState);

  const {
    data: fetchChatOptions,
    isSuccess,
    isLoading,
  } = api.group.getCurrentUserGroupOptions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      const chatOptions: TChatOption[] = fetchChatOptions.map((option) => {
        return { ...option, isSelected: false };
      });
      setUserChatList(chatOptions);
      chatOptions.forEach((option) => {
        socket.emit("joinRoom", option.roomID, currentUserId);
      });
    }

    if (!isSuccess && !isLoading) {
      toast.error("User not found");
    }

    return () => {
      socket.off("joinRoom");
    };
  }, [
    socket,
    fetchChatOptions,
    setUserChatList,
    isSuccess,
    isLoading,
    currentUserId,
  ]);

  return { isLoading, isSuccess };
};

export default useJoinChatRoom;
