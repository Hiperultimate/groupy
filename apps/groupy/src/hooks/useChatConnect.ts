import { useEffect } from "react";
import { toast } from "react-toastify";
import { socket } from "~/utils/socket";

// Hook to connect to the chat server
const useChatConnect = () => {
  useEffect(() => {
    socket.connect();
    socket.on("error", (message: string) => {
      toast.error(message);
    });

    return () => {
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  return socket;
};

export default useChatConnect;
