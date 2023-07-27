import type { Notification } from "@prisma/client";
import { atom } from "recoil";

export const notification = atom({
    key: 'notification',
    default: [] as Notification[],
})
