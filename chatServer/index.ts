import cors from "cors";
import { createId } from "@paralleldrive/cuid2";
import express, { type Express, type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env";
import redisClient from "./utils/redis";
import type { ServerToClientEvents } from "./types";
import { ClientToServerMessageSchema } from "./utils/schema";

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
  console.log("a user connected");

  socket.on("joinRoom", async (room) => {
    // Logic to get last N messages from a room
    const previousMessageArr = await redisClient.lrange(
      `roomMessages:${room}`,
      -3, // Start
      -1 // Stop
    );

    await Promise.all(
      previousMessageArr.map(async (id) => {
        const message = await redisClient.hgetall(id);
        console.log(`Message ${id} : `, message);
      })
    );

    void socket.join(room);
    console.log("Room joined ID: ", room);
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

    console.log("Broadcasting message : ", receivedData.data);
    const { senderTag, senderName, message, senderImg, roomId } =
      receivedData.data;

    const messageId = createId(); // generating cuid
    const messageObject = {
      id: messageId,
      senderName: senderName,
      senderTag: senderTag,
      sentAt: Date.now(),
      senderImg: senderImg,
      roomId: roomId,
      message: message,
    };

    await redisClient.hset(messageId, messageObject);
    await redisClient.rpush(`roomMessages:${object.roomId}`, messageId);

    socket.to(object.roomId).emit(`roomData`, messageObject);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${env.PORT}`);
});
