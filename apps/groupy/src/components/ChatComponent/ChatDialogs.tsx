import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import {
  chatRoomMessages,
  type TChatMessage,
  type TChatRoomMessages,
} from "~/store/atoms/chat";
import { api } from "~/utils/api";
import DisplayUserImage from "../DisplayUserImage";
import { useEffect } from "react";
import { socket } from "~/utils/socket";

const ChatDialogs = ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) => {
  const [allChatMessages, setAllChatMessages] =
    useRecoilState(chatRoomMessages);
  let chatMessages: TChatMessage[] = [];

  const router = useRouter();
  const { data: currentUserSession } = useSession();

  // Updates the server about user reading state of a group
  useEffect(() => {
    if (chatId && userId) {
      socket.emit("userReadingGroup", {
        groupId: chatId,
        userId: userId,
      });
    }
    return () => {
      if (chatId && userId) {
        socket.emit("userStopReadingGroup", {
          groupId: chatId,
          userId: userId,
        });
      }
    };
  }, [chatId, userId]);

  if (!currentUserSession) {
    router.push("/");
    return <></>;
  }

  if (allChatMessages.hasOwnProperty(chatId)) {
    const roomMessage = allChatMessages[chatId];
    if (roomMessage !== undefined) {
      chatMessages = roomMessage;
    }
  }

  // Fetching chat data from backend and setting it in recoil state
  api.group.getOldMessagesFromRoomId.useQuery(
    { roomId: chatId },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      onSuccess: (data) => {
        if (data !== undefined) {
          setAllChatMessages((prevData) => {
            const existingRoomChatData = data[chatId];
            if (!existingRoomChatData) {
              return { ...prevData };
            }
            const itemToAdd: TChatRoomMessages = {
              [chatId]: existingRoomChatData,
            };
            return { ...prevData, ...itemToAdd };
          });
        }
      },
    }
  );

  const dateDivide = new Set<string>();
  function dateDivider(sentDate: Date) {
    const pushDate = sentDate.toLocaleDateString();
    if (dateDivide.has(pushDate)) {
      return null;
    }
    dateDivide.add(pushDate);
    return (
      <div className="my-2 flex justify-center ">
        <div className="rounded-md bg-grey px-4 py-2 text-white">
          {new Date(pushDate).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <>
      {chatMessages.map((message) => {
        const isByUser = currentUserSession.user.atTag === message.senderTag;
        return (
          <div key={message.id}>
            {dateDivider(message.sentAt)}
            <div
              className={`m-2 ${
                isByUser ? "ml-auto justify-end" : "mr-auto justify-start"
              } flex max-w-lg space-x-3`}
            >
              {!isByUser && (
                <div>
                  <DisplayUserImage
                    userImage={message.senderImg}
                    sizeOption="medium"
                  />
                </div>
              )}
              <div>
                <div
                  className={` space rounded-md ${
                    isByUser
                      ? "rounded-tr-none bg-amber-500"
                      : "rounded-tl-none bg-orange"
                  } p-2 text-white`}
                >
                  <div className="flex">
                    <div className="font-bold">{message.senderName}</div>
                    <div className="m-2 mx-4 h-1 w-1 rounded-full bg-white"></div>
                    <div>
                      {message.sentAt.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </div>
                  </div>
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatDialogs;
