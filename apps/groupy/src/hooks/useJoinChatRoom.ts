import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { type Socket } from "socket.io-client";
import { type TChatOption, chatOptionState } from "~/store/atoms/chat";
import { api } from "~/utils/api";

const useJoinChatRoom = (socket: Socket, currentUserId: string) => {
  const setUserChatList = useSetRecoilState(chatOptionState);

  const {
    isSuccess,
    isLoading,
  } = api.group.getCurrentUserGroupOptions.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const chatOptions: TChatOption[] = data.map((option) => {
        return { ...option, isSelected: false };
      });
      setUserChatList(chatOptions);
      chatOptions.forEach((option) => {
        socket.emit("joinRoom", option.roomID, currentUserId);
      });
    },
    onError: (_) => {
      toast.error("User not found");
    }
  });

  return { isLoading, isSuccess };
};

export default useJoinChatRoom;
