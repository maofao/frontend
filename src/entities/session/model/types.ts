import type { input, output } from "zod";
import { loginBodySchema, meResponseSchema, registerBodySchema } from "./schemas";

export type RegisterBody = input<typeof registerBodySchema>;
export type LoginBody = input<typeof loginBodySchema>;
export type MeResponse = output<typeof meResponseSchema>;
