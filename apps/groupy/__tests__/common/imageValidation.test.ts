import { describe, expect, it } from "vitest";
import {
  serverImageFormatValidation,
  serverImageSizeValidation,
  serverImageTypeValidation,
} from "../../src/common/imageValidation";
import { base64Image } from "../__fixtures__/JPGBase64Image";

describe("serverImageTypeValidation", () => {
  it("Return true if type type is image/", () => {
    const result = serverImageTypeValidation("image/");
    expect(result).toBeTruthy();
  });

  it("Return false if type is not image/", () => {
    const result = serverImageTypeValidation("txt/");
    expect(result).toBeFalsy();
  });
});

describe("serverImageFormatValidation", () => {
  it("Checks for valid image format including png, jpg, jpeg", () => {
    const mimeType = {
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpg",
    };
    const pngCheck = serverImageFormatValidation(mimeType.png);
    const jpegCheck = serverImageFormatValidation(mimeType.jpeg);
    const jpgCheck = serverImageFormatValidation(mimeType.jpg);

    expect(pngCheck).toBeTruthy();
    expect(jpegCheck).toBeTruthy();
    expect(jpgCheck).toBeTruthy();
  });

  it("Checks for invalid image format", () => {
    const txtMime = "text/plain";
    const invalidType = "inval1dM1meType";
    const txtCheck = serverImageFormatValidation(txtMime);
    const invalidTypeCheck = serverImageFormatValidation(invalidType);

    expect(txtCheck).toBeFalsy;
    expect(invalidTypeCheck).toBeFalsy;
  });
});

describe("serverImageSizeValidation", () => {
  it("Valid string type validation", () => {
    expect(serverImageSizeValidation(base64Image)).toBeTruthy();
  });
  it("Valid number type validation", () => {
    expect(serverImageSizeValidation(999999)).toBeTruthy();
  });
  it("Invalid number type validation", () => {
    expect(serverImageSizeValidation(9999999)).toBeFalsy();
  });
});
