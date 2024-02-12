import { Redis } from "ioredis";
import { env } from "./env";

const redisClient = new Redis({
  port: Number(env.REDIS_PORT), // Redis port
  host: env.REDIS_HOST, // Redis host
  username: "default", // needs Redis >= 6
  password: env.REDIS_PASSWORD,
});

export default redisClient;
