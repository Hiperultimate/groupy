import { z } from "zod";

const imageFormats = ["png", "jpg", "jpeg"] as const;
type Iformat = (typeof imageFormats)[number];

const MAX_IMAGE_SIZE = 1000000; // 1MB in Bytes

export function serverImageTypeValidation(base64Image: string) {
  if (!base64Image || !base64Image.startsWith("image/")) {
    return false;
  }
  return true;
}

export function serverImageFormatValidation(base64Mime: string): boolean {
  const imageFormat = base64Mime.split("/")[1];
  if (!imageFormats.includes(imageFormat as Iformat)) {
    return false;
  }
  return true;
}

const base64OrNumberSchema = z.union([z.string(), z.number()]);

export function serverImageSizeValidation(
  sizeOrBase64: z.infer<typeof base64OrNumberSchema>
): boolean {
  let imageSize: string | number = MAX_IMAGE_SIZE + 1; // Default value set to number, will fail validation if type is not a number or string

  if (typeof sizeOrBase64 === "number") {
    imageSize = sizeOrBase64;
  }

  if (typeof sizeOrBase64 === "string") {
    const imageBuffer = Buffer.from(sizeOrBase64, "base64");
    imageSize = imageBuffer.length;
  }

  if (imageSize > MAX_IMAGE_SIZE) {
    return false;
  }
  return true;
}

function clientImageTypeValidation(image: File): boolean {
  const imageFormat = image.name.split(".").at(-1);
  if (!imageFormat || !image.type.startsWith("image/")) {
    return false;
  }
  return true;
}

function clientImageFormatValidation(image: File): boolean {
  const imageFormat = image.name.split(".").at(-1);
  if (!imageFormats.includes(imageFormat as Iformat)) {
    return false;
  }
  return true;
}

function clientImageSizeValidation(image: File): boolean {
  if (image.size > MAX_IMAGE_SIZE) {
    return false;
  }
  return true;
}

const imageValidation = (image: File): string[] => {
  const errorList: string[] = [];

  if (clientImageTypeValidation(image) === false) {
    errorList.push("Invalid file");
  }

  if (clientImageFormatValidation(image) === false) {
    errorList.push("Invalid image format");
  }

  if (clientImageSizeValidation(image) === false) {
    errorList.push("Image size must be less than 1 MB");
  }

  return errorList;
};

export default imageValidation;
