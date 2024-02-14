import { z } from "zod";

const MessageSchema = z.object({
  messageId: z.string().uuid(),
  senderTag: z.string(),
  senderName: z.string(),
  sentAt: z.number(),
  message: z.string(),
  senderImg: z.string().url().optional(),
});
