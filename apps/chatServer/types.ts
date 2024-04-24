export type TMessage = {
  roomId: string;
  id: string;
  senderId: string;
  senderName: string;
  senderTag: string;
  sentAt: number;
  message: string;
  senderImg: string | undefined;
};

export type TOldRoomMessages = {
  [roomId: string]: TChatMessage[];
};

export type TChatMessage = Omit<TMessage, "roomId">;
type TClientMessage = Omit<TMessage, "id" | "sentAt">;

export interface ServerToClientEvents {
  joinRoom: (room: string) => void;
  roomMessage: (messageObj: TClientMessage) => void;
  roomData: (messageObj: TMessage) => void;
}
