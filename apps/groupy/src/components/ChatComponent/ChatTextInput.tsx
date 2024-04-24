import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SvgChatIcon from "public/SvgChatIcon";
import { socket } from "~/utils/socket";

const ChatTextInput = ({
  chatId,
  inputState,
  setInputState,
}: {
  chatId: string;
  inputState: string;
  setInputState: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { data: currentUser } = useSession();
  const router = useRouter();

  if (!currentUser) {
    router.push("/");
    return <></>;
  }
  const submitHandler = () => {
    socket.emit("roomMessage", {
      senderName: currentUser.user.name,
      senderTag: currentUser.user.atTag,
      senderImg: currentUser.user.image,
      senderId : currentUser.user.id,
      roomId: chatId,
      message: inputState,
    });
    setInputState("");
  };

  const handleKeyDown = (event : React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      submitHandler();
    }
  };

  return (
    <div className="flex w-full items-center justify-center rounded-full border">
      <input
        type="text"
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
        onKeyDown={handleKeyDown}
        className="mx-5 my-2 w-full text-lg outline-none"
      />
      <span className="h-full border-l" />
      <div
        onClick={submitHandler}
        className="relative top-[2px] pl-3 pr-4 hover:cursor-pointer"
      >
        <SvgChatIcon />
      </div>
    </div>
  );
};

export default ChatTextInput;
