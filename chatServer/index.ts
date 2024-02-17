import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env";
import redisClient from "./utils/redis";
import type { ServerToClientEvents } from "./types";

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
    console.log("Room joined ID: ", room);

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
  });

  socket.on("roomMessage", async (object) => {
    console.log("Message object received : ", object);

    const messageId = Math.random() * 10000; // Generate a MUID instead
    await redisClient.hset(messageId.toString(), {
      sentAt: Date.now(),
      message: object.message,
    });
    await redisClient.rpush(
      `roomMessages:${object.roomId}`,
      messageId.toString()
    );

    socket.to(object.roomId).emit(`roomData`, object.message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${env.PORT}`);
});
