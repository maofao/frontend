import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(200),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(1024),
});

export const authOkResponseSchema = z.object({
  ok: z.literal(true),
});

export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  permissions: z.array(z.string()),
});
