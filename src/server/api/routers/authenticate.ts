import { z } from "zod";

import { signUpSchema } from "../../../common/authSchema";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { base64ToImageData } from "~/common/imageConversion";
import { supabase } from "~/utils/storageBucket";
import { v4 as uuidv4 } from "uuid";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .output(
      z.object({
        message: z.string(),
        status: z.number(),
        result: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        email,
        password,
        dob,
        nameTag,
        description,
        userTags,
        image,
      } = input;

      const emailExists = await ctx.prisma.user.findFirst({ where: { email } });
      if (emailExists) {
        throw new TRPCError({
          message: "User with this Email ID already exists",
          code: "FORBIDDEN",
        });
      }

      const nameTagExists = await ctx.prisma.user.findFirst({
        where: { atTag: nameTag },
      });

      if (nameTagExists) {
        throw new TRPCError({
          message: "User with this Tag-name already exists",
          code: "FORBIDDEN",
        });
      }

      let imageHolder = image;
      // Image is already validated through schema validation, upload image to supabase and get url then save the url to image
      if (image !== undefined) {
        const { imageBuffer, imageMime, imageFormat } =
          base64ToImageData(image);

        if (!imageMime || !imageFormat) {
          throw new TRPCError({
            message: "Error occured while handling image",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        // This successfully uploads the image
        // Add name with Checking.png using npm install uuid and add format
        const { data: getImageURL, error } = await supabase.storage
          .from("images")
          .upload(`displayPictures/${uuidv4()}.${imageFormat}`, imageBuffer, {
            contentType: `${imageMime}`,
          });

        if (error) {
          throw new TRPCError({
            message: "Error occured while generating image URL",
            code: "INTERNAL_SERVER_ERROR",
          });
        } else {
          imageHolder = getImageURL.path;
        }
      }

      // TODO: userTags should fetch data from the server
      // TODO: Hash password here and pass to result like password : hashed_password

      const result = await ctx.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
          dateOfBirth: dob,
          atTag: nameTag,
          description: description,
          tags: {
            connectOrCreate: userTags.map((tag) => ({
              where: { name: tag.value },
              create: { name: tag.value },
            })),
          },
          image: imageHolder,
        },
      });

      return {
        message: "Account created successfully",
        status: 201,
        result: result.email,
      };
    }),
});
