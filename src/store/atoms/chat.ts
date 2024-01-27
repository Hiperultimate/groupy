// import type { Notification } from "@prisma/client"; -> Import chat type from prisma instead of TChatOption

import { atom } from "recoil";

export type TChatOption = {
  id: string;
  chatName: string;
  chatUserTag: string | null;
  chatImg: string | null;
  chatLastMsg: string;
  lastMsgSentAt: Date;
  unreadMsgCount: number;
  isSelected: boolean;
};

export type ChatMemberEditType = "invite_member" | "remove_member" | "make_moderator";

type TChatEditModal = {
  chatId : string, editType :ChatMemberEditType
}

export const chatOptionState = atom({
  key: "chatOption",
  // Dummy data
  default: [
    {
      id: "123123",
      chatName: "John Smith",
      chatUserTag : "johnSmith",
      isSelected: false,
      chatImg: null,
      chatLastMsg: "That would be great!",
      lastMsgSentAt: new Date(
        new Date("2023-12-30").setSeconds(new Date().getSeconds() - 57)
      ),
      unreadMsgCount: 12,
    },
    {
      id: "12312233",
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
      id: "1231523",
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


export const isChatEditModelOpen = atom({
  key: "isChatEditModelOpen",
  default: false,
})

export const chatEditModalData = atom({
  key: "isChatEditModelOpen",
  default: {} as TChatEditModal,
})