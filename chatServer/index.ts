
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

  socket.on("create", (room) => {
    console.log("Room created");
    socket.join(room);
  });

  socket.on("roomMsg", (object) => {
    // console.log("Checking data received : ", JSON.parse(object));
    console.log("Checking data received : ", object);
    socket.to(object.roomId).emit(object.message);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
    // socket.broadcast.emit(msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${env.PORT}`);
});
