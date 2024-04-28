import { ErrorTypes } from "./types";

export const errorType = {
  NOT_ALLOWED: "not_allowed",
  INVALID_MESSAGE: "invalid_message",
} as const;

export const errorMessages: { [key in ErrorTypes]: string } = {
  [errorType.NOT_ALLOWED]: "You do not have permission to access this group",
  [errorType.INVALID_MESSAGE]: "Incorrect message type",
};
