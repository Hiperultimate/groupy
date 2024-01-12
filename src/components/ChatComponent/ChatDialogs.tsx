import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TChatMessage = {
  id: string;
  senderName: string;
  senderTag: string;
  sentAt: Date;
  message: string;
  senderImg: string | null;
};

const ChatDialogs = ({ chatId }: { chatId: string }) => {
  const [chatMessages, setChatMessages] = useState<TChatMessage[]>([
    {
      id: "123123",
      senderName: "John Smith",
      senderTag: "JohnSmith",
      sentAt: new Date("2023-12-30"),
      message:
        "Hey man, I know you have been coding a lot but you should CODE EVEN MORE",
      senderImg: null,
    },
    {
      id: "1523123",
      senderName: "Some new guy",
      senderTag: "newGuy",
      sentAt: new Date("2023-12-30"),
      message: "But ofcourse man",
      senderImg: null,
    },
  ]);

  // Use session and get currently logged in user's Tag, then design the chat box
  const router = useRouter();
  const { data: currentUserSession } = useSession();

  if (!currentUserSession) {
    router.push("/");
    return <></>;
  }

  // Fetch chat data from chatId through useMemo
  console.log(currentUserSession.user.atTag);

  return (
    <>
      {chatMessages.map((message) => {
        return (
          <div
            key={message.id}
            className={`m-2 ${
              currentUserSession.user.atTag === message.senderTag
                ? "ml-auto justify-end"
                : "mr-auto justify-start"
            } flex w-full max-w-lg  space-x-3`}
          >
            <p
              className={` space rounded-md ${
                currentUserSession.user.atTag === message.senderTag
                  ? "bg-amber-500"
                  : "bg-orange"
              } p-2 text-white`}
            >
              {message.message}
            </p>
          </div>
        );
      })}
    </>
  );
};

export default ChatDialogs;
