import cors from "cors";
import { createId } from "@paralleldrive/cuid2";
import express, { type Express, type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env";
import redisClient from "./utils/redis";
import type { ServerToClientEvents } from "./types";
import { ClientToServerMessageSchema } from "./utils/schema";
import redisPopulateGroup from "./db_helpers/postgres_to_redis/populateGroups";
import { increaseUnreadMessageCount } from "./db_helpers/unreadMessageCount";
import { errorMessages, errorType } from "./constants";
import { isUserGroupInRedis } from "./db_helpers/common/redisCheckGroup";

const app: Express = express();
app.use(cors());

const server = createServer(app);
const io = new Server<ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

app.get("/serverstatus", (req: Request, res: Response) => {
  console.log("Check server status");
  res.json({ status: "OK" });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", async (groupId, userId) => {
    socket.data.userId = userId;
    void socket.join(groupId);
    redisPopulateGroup(groupId);
  });

  socket.on("roomMessage", async (object) => {
    const receivedData = ClientToServerMessageSchema.safeParse(object);

    if (!receivedData.success) {
      console.log(
        "Bad request object : ",
        receivedData.error.flatten().fieldErrors
      );
      io.to(socket.id).emit("error", errorMessages[errorType.INVALID_MESSAGE]);
      return;
    }

    const { senderTag, senderName, message, senderImg, roomId, senderId } =
      receivedData.data;

    const messageId = createId(); // generating cuid
    const messageObject = {
      id: messageId,
      senderName: senderName,
      senderTag: senderTag,
      sentAt: Date.now(),
      senderImg: senderImg,
      roomId: roomId,
      senderId: senderId,
      message: message,
    };

    const batch = redisClient.multi();
    batch.hset(messageId, messageObject);
    batch.rpush(`roomMessages:${object.roomId}`, messageId);
    await batch.exec();
    increaseUnreadMessageCount({
      groupId: roomId,
      senderId: object.senderId,
    });

    socket.nsp.to(object.roomId).emit(`roomData`, messageObject);
  });

  socket.on("userReadingGroup", async ({ groupId, userId }) => {
    const exists = await isUserGroupInRedis(groupId, userId);
    if (!exists) {
      io.to(socket.id).emit("error", errorMessages[errorType.NOT_ALLOWED]);
      return;
    }

    await redisClient.sadd(`activeGroupMembers:${groupId}`, userId);
  });

  socket.on("userStopReadingGroup", async ({ groupId, userId }) => {
    const exists = await isUserGroupInRedis(groupId, userId);
    if (!exists) {
      io.to(socket.id).emit("error", errorMessages[errorType.NOT_ALLOWED]);
      return;
    }

    await redisClient.srem(`activeGroupMembers:${groupId}`, userId);
  });

  socket.on("disconnecting", async () => {
    const currentUserId: string | undefined = socket.data.userId;

    if (!currentUserId) {
      return;
    }

    const allRooms = socket.rooms;
    allRooms.delete(socket.id);
    const userJoinedRooms = allRooms;

    const batch = redisClient.multi();
    for (const groupId of userJoinedRooms) {
      batch.srem(`activeGroupMembers:${groupId}`, currentUserId);
    }

    await batch.exec();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(env.CS_PORT, () => {
  console.log(`App listening on port http://localhost:${env.CS_PORT}`);
});
