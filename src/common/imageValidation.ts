const imageFormats = ["png", "jpg"] as const;

type Iformat = (typeof imageFormats)[number];
const MAX_IMAGE_SIZE = 1000000; // 1MB in Bytes

const imageValidation = (image: File): string[] => {
  const errorList: string[] = [];
  const imageFormat = image.name.split(".").at(-1);
  if (!imageFormat) {
    errorList.push("Invalid file");
  }

  if (imageFormat && !imageFormats.includes(imageFormat as Iformat)) {
    errorList.push("Invalid image format");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    errorList.push("Image size must be less than 1 MB");
  }

  return errorList;
};

export default imageValidation;
