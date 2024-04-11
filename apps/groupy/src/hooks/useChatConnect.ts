import { useEffect } from "react";
import { socket } from "~/utils/socket";

// Hook to connect to the chat server
const useChatConnect = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};

export default useChatConnect;
