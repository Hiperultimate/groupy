import { z } from "zod";

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
  .refine((schema) => schema.nameTag.indexOf(" ") <= 0, {
    message: "Input cannot have blank spaces.", path : ["nameTag"],
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords do not match", path: ["confirmPassword"],
  })
  .refine(
    (schema) => {
      const dob = new Date(schema.dob);
      const now = new Date();
      return dob < now;
    },
    { message: "Birth date must be in the past", path: ["dob"] }
  );

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
