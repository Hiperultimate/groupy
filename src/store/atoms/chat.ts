// import type { Notification } from "@prisma/client"; -> Import chat type from prisma instead of TChatOption

import { atom } from "recoil";

// Chat groups
export type TChatOption = {
  roomID: string;
  chatName: string;
  chatUserTag: string | null;
  chatImg: string | null;
  chatLastMsg: string;
  lastMsgSentAt: Date;
  unreadMsgCount: number;
  isSelected: boolean;
};

export type TChatMessage = {
  id: string;
  senderName: string;
  senderTag: string;
  sentAt: Date;
  message: string;
  senderImg: string | null;
};

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
  // Dummy data
  default: [
    {
      roomID: "123123",
      chatName: "John Smith",
      chatUserTag: "johnSmith",
      isSelected: false,
      chatImg: null,
      chatLastMsg: "That would be great!",
      lastMsgSentAt: new Date(
        new Date("2023-12-30").setSeconds(new Date().getSeconds() - 57)
      ),
      unreadMsgCount: 12,
    },
    {
      roomID: "12312233",
      chatName: "Immortals",
      isSelected: false,
      chatImg: null,
      chatLastMsg: "Another day another win",
      lastMsgSentAt: new Date(
        new Date("2023-12-30").setHours(new Date().getHours() - 18)
      ),
      unreadMsgCount: 1,
    },
    {
      roomID: "1231523",
      chatName: "Lazy Group",
      isSelected: false,
      chatImg: null,
      chatLastMsg: "Darui..",
      lastMsgSentAt: new Date(
        new Date("2023-12-30").setMonth(new Date().getMonth() - 3)
      ),
      unreadMsgCount: 2190,
    },
  ] as TChatOption[],
  //   default: [] as TChatOption[],
});

export const chatRoomMessages = atom({
  key: "chatRoomMessages",
  // default: {} as TChatRoomMessages,
  default: {
    "123123": [
      {
        id: "623626",
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
      {
        id: "15231455",
        senderName: "John Smith",
        senderTag: "JohnSmith",
        sentAt: new Date("2023-12-30"),
        message: "Good thing",
        senderImg: null,
      },
      {
        id: "15231523",
        senderName: "Some new guy",
        senderTag: "newGuy",
        sentAt: new Date(),
        message: "But ofcourse man",
        senderImg: null,
      },
      {
        id: "1523143",
        senderName: "John Smith",
        senderTag: "JohnSmith",
        sentAt: new Date(),
        message: "Good thing",
        senderImg: null,
      },
    ],
  } as TChatRoomMessages,
});

export const isChatEditModelOpen = atom({
  key: "isChatEditModelOpen",
  default: false,
});

export const chatEditModalData = atom({
  key: "chatEditModalData",
  default: {} as TChatEditModal,
});
