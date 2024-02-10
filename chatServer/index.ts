import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env";

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

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (room) => {
    console.log("Room joined ID: ", room);
    socket.join(room);
  });

  socket.on("roomMessage", (object) => {
    console.log("Message object received : ", object);
    socket.to(object.roomId).emit(`room:${object.roomId}`, object.message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${env.PORT}`);
});
