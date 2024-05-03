import { io } from "socket.io-client";
import { env } from "~/env.mjs";

const URL = env.NEXT_PUBLIC_CHATSERVER_URL;

export const socket = io(URL, { autoConnect: false });
