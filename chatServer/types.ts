type TMessage = {
  roomId: string;
  message: string;
};

export interface ServerToClientEvents {
  joinRoom: (room: string) => void;
  roomMessage: (messageObj: TMessage) => void;
  roomData: (message: string) => void;
}