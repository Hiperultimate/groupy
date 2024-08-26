import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const prismaEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
});

let finalPrismaEnv = prismaEnvSchema;

switch (process.env.NODE_ENV) {
  case "test":
    finalPrismaEnv = finalPrismaEnv.extend({
      TEST_DATABASE_URL: z.string().url(),
    });
    break;
  case "production":
    break;
  case "development":
    console.log("Checking DEVELOPMENT DEFAULT");
    break;
}

const checkErrors = finalPrismaEnv.safeParse(process.env);
console.log("Checking for errors in prisma :", checkErrors);
if (checkErrors.success === false) {
  console.error(
    "❌ Invalid environment variables in packages/db_prisma:",
    checkErrors.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

// Replacing DATABASE_URL with TEST_DATABASE_URL for prisma
if (process.env.NODE_ENV === "test") {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

export * from "@prisma/client";
