// import type { Notification } from "@groupy/db_prisma"; -> Import chat type from prisma instead of TChatOption

import { atom } from "recoil";
import { z } from "zod";

export const chatUserTagKey = "chatUserTag" as const;
export type TChatOption = {
  roomID: string;
  chatName: string;
  chatImg: string | null;
  chatLastMsg: string | null;
  lastMsgSentAt: Date | null;
  unreadMsgCount: number;
  isSelected: boolean;
} & ({ [chatUserTagKey]: string | null } | Record<never, never>);

export const ChatMessageSchema = z.object({
  id: z.string(),
  senderName: z.string(),
  senderTag: z.string(),
  senderId: z.string(),
  sentAt: z.date(),
  message: z.string(),
  senderImg: z.string().nullable(),
});

export type TChatMessage = z.infer<typeof ChatMessageSchema>;

export const ServerToClientChatMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderTag: z.string(),
  sentAt: z.date(),
  senderImg: z.string().nullable(),
  roomId: z.string(),
  message: z.string(),
});

export type TServerToClientChatMessageSchema = z.infer<
  typeof ServerToClientChatMessageSchema
>;

export type TChatRoomMessages = {
  [roomId: string]: TChatMessage[];
};

export type ChatMemberEditType =
  | "invite_member"
  | "remove_member"
  | "make_moderator";

type TChatEditModal = {
  chatId: string;
  editType: ChatMemberEditType;
};

export const chatOptionState = atom({
  key: "chatOption",
  default: [] as TChatOption[],
});

export const isChatOptionLoading = atom({
  key: "isChatOptionLoading",
  default: false,
});

export const chatRoomMessages = atom({
  key: "chatRoomMessages",
  default: {} as TChatRoomMessages,
});

export const isChatEditModelOpen = atom({
  key: "isChatEditModelOpen",
  default: false,
});

export const chatEditModalData = atom({
  key: "chatEditModalData",
  default: {} as TChatEditModal,
});
