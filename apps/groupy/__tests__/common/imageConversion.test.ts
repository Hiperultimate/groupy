import { describe, expect, it } from "vitest";
import {
  base64ToImageData,
  encodeImageToBase64,
} from "../../src/common/imageConversion";
import { base64Image } from "../__fixtures__/JPGBase64Image";

describe("encodeImageToBase64", () => {
  const image = Buffer.from(base64Image, "base64");

  it("Encoding image to Base64", async () => {
    const imageBlob = new Blob([image], { type: "image/jpg" });
    const mockFile = new File([imageBlob], "dummy-file.jpg", {
      type: "image/jpg",
    });

    const result = await encodeImageToBase64(mockFile);

    expect(result).toBe("data:image/jpg;base64," + base64Image);
  });
});

describe("base64ToImageData", () => {
  const base64String = "data:image/jpg;base64," + base64Image;

  it("Converting base64 to image data", () => {
    const { imageBuffer, fileSizeInBytes, imageMime, imageFormat } =
      base64ToImageData(base64String);

    expect(fileSizeInBytes).toBe(1197);
    expect(imageMime).toBe("image/jpg");
    expect(imageFormat).toBe("jpg");
  });

  it("Invalid base64 image throws an error", ()=>{
    expect(() =>{
        base64ToImageData("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBw");
    }).toThrowError("Invalid image passed")
  })
});
