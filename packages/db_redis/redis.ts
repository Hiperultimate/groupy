import { Redis } from "ioredis";
import { env } from "env";

export const redis = new Redis({
  port: Number(env.REDIS_PORT), // Redis port
  host: String(env.REDIS_HOST), // Redis host
  username: "default", // needs Redis >= 6
  password: env.REDIS_PASSWORD,
});
