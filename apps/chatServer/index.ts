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

  socket.on("joinRoom", (groupId) => {
    console.log("User joined room :", groupId);
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
      return new Error("Bad request");
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

    await redisClient.hset(messageId, messageObject);
    await redisClient.rpush(`roomMessages:${object.roomId}`, messageId);
    await increaseUnreadMessageCount({
      groupId: roomId,
      senderId: object.senderId,
    });

    console.log(`Broadcasting room ${object.roomId} message :`, messageObject);
    socket.nsp.to(object.roomId).emit(`roomData`, messageObject);
  });

  socket.on("userReadingGroup", async ({ groupId, userId }) => {
    const exists = await redisClient.hexists(
      `isGroupMemberReading:${groupId}`,
      userId
    );
    if (!exists) {
      console.log(`User ${userId} is not a member of group ${groupId}`);
      return;
    }
    await redisClient.hset(`isGroupMemberReading:${groupId}`, userId, "true");
  });

  socket.on("userStopReadingGroup", async ({ groupId, userId }) => {
    const exists = await redisClient.hexists(
      `isGroupMemberReading:${groupId}`,
      userId
    );
    if (!exists) {
      console.log(`User ${userId} is not a member of group ${groupId}`);
      return;
    }
    await redisClient.hset(`isGroupMemberReading:${groupId}`, userId, "false");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(env.CS_PORT, () => {
  console.log(`App listening on port http://localhost:${env.CS_PORT}`);
});
