import { fetchJson } from "@/shared/api";
import { meResponseSchema } from "../model/schemas";

export function getMe(acceptLanguage: string) {
  return fetchJson("/auth/me", { method: "GET" }, meResponseSchema, acceptLanguage);
}
