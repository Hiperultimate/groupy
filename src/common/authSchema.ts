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
  .superRefine((schema, ctx) => {
    // Image is an optional field. Skip image validation if no image is passed.
    if (schema.image !== undefined) {
      try {
        const { imageMime, fileSizeInBytes } = base64ToImageData(schema.image);
        if (!imageMime || !fileSizeInBytes) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Something went wrong while converting the image",
            path: ["image"],
          });
          return;
        }

        if (!serverImageTypeValidation(imageMime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid file type",
            path: ["image"],
          });
        }

        if (!serverImageFormatValidation(imageMime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid image format",
            path: ["image"],
          });
        }

        if (!serverImageSizeValidation(fileSizeInBytes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image size must be less than 1 MB",
            path: ["image"],
          });
        }
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Something went wrong while converting the image",
          path: ["image"],
        });
      }
    }
  })
  .refine((schema) => schema.userTags.every(({ value }) => !/\s/.test(value)), {
    message: "Selected tags cannot have blank spaces in value property",
    path: ["userTags"],
  });

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
