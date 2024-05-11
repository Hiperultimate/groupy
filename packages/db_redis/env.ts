import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  REDIS_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const checkErrors = envSchema.safeParse(process.env);
if (checkErrors.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    checkErrors.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export const env = envSchema.parse(process.env);
