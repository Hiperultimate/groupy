type TMessage = {
  roomId: string;
  id: string;
  senderName: string;
  senderTag: string;
  sentAt: number;
  message: string;
  senderImg: string | undefined;
};

type TClientMessage = Omit<TMessage, "id" | "sentAt">

export interface ServerToClientEvents {
  joinRoom: (room: string) => void;
  roomMessage: (messageObj: TClientMessage) => void;
  roomData: (messageObj: TMessage) => void;
}
