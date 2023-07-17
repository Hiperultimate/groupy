import { z } from "zod";
import {
  serverImageTypeValidation,
  serverImageFormatValidation,
  serverImageSizeValidation,
} from "./imageValidation";
import { base64ToImageData } from "./imageConversion";

export const postSchema = z
  .object({
    content: z.string().min(1).max(300),
    tags: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .min(3, { message: "You must select at least 3 tags." }),
    isGroup: z.boolean(),
    groupName: z.string().min(1).max(25).optional().or(z.literal("")),
    ageSpectrum: z
      .object({ minAge: z.number(), maxAge: z.number() })
      .optional(),
    groupSize: z.number().min(1).optional(),
    instantJoin: z.boolean().optional(),
    image: z.string().optional(),
  })
  .refine((schema) => {
    if (schema.isGroup) {
      return schema.groupName ? schema.groupName?.trim().length > 0 : false;
    }
    return true;
  }, { message: "Group name cannot be empty", path: ["groupName"] })
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
  .refine((schema) => schema.tags.every(({ value }) => !/\s/.test(value)), {
    message: "Selected tags cannot have blank spaces in value property",
    path: ["tags"],
  });

export type IPost = z.infer<typeof postSchema>;
