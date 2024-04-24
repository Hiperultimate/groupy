import { z } from "zod";

export const ServerToClientMessageSchema = z.object({
  id: z.string().cuid(),
  senderTag: z.string(),
  senderName: z.string(),
  sentAt: z.number(),
  message: z.string(),
  senderImg: z.string().url().optional(),
});

export const ClientToServerMessageSchema = z.object({
  senderId: z.string(),
  senderTag: z.string(),
  senderName: z.string(),
  message: z.string(),
  senderImg: z.string().url().optional(),
  roomId: z.string(),
});
