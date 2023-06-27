import { z } from "zod";
import {
  serverImageTypeValidation,
  serverImageFormatValidation,
  serverImageSizeValidation,
} from "./imageValidation";
import { base64ToImageData } from "./imageConversion";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export const signUpSchema = loginSchema
  .extend({
    name: z.string().min(3),
    confirmPassword: z.string().min(8).max(16),
    dob: z.date(),
    nameTag: z.string().min(3).max(30),
    description: z.string().optional(),
    image: z.string().optional(),
    userTags: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .min(3, { message: "You must select at least 3 tags." }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (schema) => {
      const dob = new Date(schema.dob);
      const now = new Date();
      return dob < now;
    },
    { message: "Birth date must be in the past", path: ["dob"] }
  )
  .refine((schema) => schema.nameTag.indexOf(" ") < 0, {
    message: "Tag-name cannot have blank spaces.",
    path: ["nameTag"],
  })
  .refine(
    (schema) => {
      // Image is an optional field. Skip image validation if no image is passed.
      if(schema.image === undefined){
        return true;
      }
      try {
        const { imageMime } = base64ToImageData(schema.image);
        if (!imageMime) {
          console.log("Something went wrong while converting the image");
          return false;
        }
        return serverImageTypeValidation(imageMime);
      } catch (e) {
        return false;
      }
    },
    {
      message: "Invalid file type",
      path: ["image"],
    }
  )
  .refine(
    (schema) => {
      // Image is an optional field. Skip image validation if no image is passed.
      if(schema.image === undefined){
        return true;
      }
      try {
        const { imageMime } = base64ToImageData(schema.image);
        if (!imageMime) {
          console.log("Something went wrong while converting the image");
          return false;
        }
        return serverImageFormatValidation(imageMime);
      } catch (e) {
        return false;
      }
    },
    {
      message: "Invalid image format",
      path: ["image"],
    }
  )
  .refine(
    (schema) => {
      // Image is an optional field. Skip image validation if no image is passed.
      if(schema.image === undefined){
        return true;
      }
      try {
        const { fileSizeInBytes } = base64ToImageData(schema.image);
        if (!fileSizeInBytes) {
          console.log("Something went wrong while converting the image");
          return false;
        }
        return serverImageSizeValidation(fileSizeInBytes);
      } catch (e) {
        return false;
      }
    },
    {
      message: "Image size must be less than 1 MB",
      path: ["image"],
    }
  )
  .refine((schema) => schema.userTags.every(({ value }) => !/\s/.test(value)), {
    message: "Selected tags cannot have blank spaces in value property",
    path: ["userTags"],
  });

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
