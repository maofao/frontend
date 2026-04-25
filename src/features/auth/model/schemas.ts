import { z } from "zod";
import { registerBodySchema } from "@/entities/session";

export const registerFormSchema = registerBodySchema
  .extend({
    confirmPassword: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "mismatch",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
