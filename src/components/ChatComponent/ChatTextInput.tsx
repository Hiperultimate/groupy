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

  const submitHandler = () => {
    socket.emit("roomMessage", { roomId: chatId, message: inputState});
  };

  return (
    <div className="flex w-full items-center justify-center rounded-full border">
      <input
        type="text"
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
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
