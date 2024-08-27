import { expect, test } from "vitest";
import { hashPassword , comparePassword } from "../src/utils/passwordUtils";

test("Checking if hashPassword function returns a hashed string", () => {
  const password = "randomPassword123";
  const hashedPass = hashPassword(password);
  expect(hashedPass).not.toBe(password);
});

test("Checking if passwords can be compared after hashing", () => {
  const password = "randomPassword123";
  const hashedPass = hashPassword(password);
  const isPasswordMatching = comparePassword(hashedPass, password);
  const incorrectMatch = comparePassword(hashedPass, "randomPassword456");

  expect(isPasswordMatching).toBeTruthy();
  expect(incorrectMatch).toBeFalsy();
})
