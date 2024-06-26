import { errorType } from "./constants";

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

export type ErrorTypes = typeof errorType[keyof typeof errorType];

export type TChatMessage = Omit<TMessage, "roomId">;
type TClientMessage = Omit<TMessage, "id" | "sentAt">;
type TUserReadingGroup = {
  groupId: string;
  userId: string;
};

export interface ServerToClientEvents {
  joinRoom: (room: string, userId: string) => void;
  roomMessage: (messageObj: TClientMessage) => void;
  roomData: (messageObj: TMessage) => void;

  userReadingGroup: (userReadingArgs: TUserReadingGroup) => void;
  userStopReadingGroup: (userReadingArgs: TUserReadingGroup) => void;

  error: (errorType : string) => void;
}
