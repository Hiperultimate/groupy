import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DisplayUserImage from "../DisplayUserImage";
import { chatRoomMessages, type TChatMessage } from "~/store/atoms/chat";
import { useRecoilValue } from "recoil";
import { api } from "~/utils/api";

const ChatDialogs = ({ chatId }: { chatId: string }) => {
  const allChatMessages = useRecoilValue(chatRoomMessages);
  let chatMessages: TChatMessage[] = [];

  if (allChatMessages.hasOwnProperty(chatId)) {
    const chatRoomMessages = allChatMessages[chatId];
    if (chatRoomMessages !== undefined) {
      chatMessages = chatRoomMessages;
    }
  }

  const dateDivide = new Set();

  // Use session and get currently logged in user's Tag, then design the chat box
  const router = useRouter();
  const { data: currentUserSession } = useSession();

  if (!currentUserSession) {
    router.push("/");
    return <></>;
  }

  // Fetch chat data from backend and set it in recoil
  const {data : oldChatMessages} = api.chat.getOldMessagesFromRoomId.useQuery({roomId: chatId}, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity
  });

  console.log("Checking old chat messages : ", oldChatMessages);

  function dateDivider(sentDate: Date) {
    const pushDate = sentDate.getTime();
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
