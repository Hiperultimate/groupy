import cors from "cors";
import { env } from "./env";
import express, { type Express, type Request, type Response } from "express";
import redisClient from "./redis";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app: Express = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/serverstatus", (req: Request, res: Response) => {
  console.log("Check server status");
  res.json({ status: "OK" });
});

// TODO: Implement redis, just use it to store messages and fetch messages when user loads in initially
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (room) => {
    console.log("Room joined ID: ", room);
    socket.join(room);
  });

  socket.on("roomMessage", async (object) => {
    console.log("Message object received : ", object);
    await redisClient.set(`room:${object.roomId}`,object.message);
    socket.to(object.roomId).emit(`room:${object.roomId}`, object.message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${env.PORT}`);
});
