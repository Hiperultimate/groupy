import { expect, test } from "vitest";
import { hashPassword } from "../src/utils/passwordUtils";

test("Checking if hashPassword function returns a hashed string", () => {
  const password = "randomPassword123";
  const hashedPass = hashPassword(password);
  expect(hashedPass).not.toBe(password);
});
