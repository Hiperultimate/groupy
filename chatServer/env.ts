import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().min(4),
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
