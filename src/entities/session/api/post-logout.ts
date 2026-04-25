import { fetchJson } from "@/shared/api";
import { authOkResponseSchema } from "../model/schemas";

export function postLogout(acceptLanguage: string) {
  return fetchJson("/auth/logout", { method: "POST" }, authOkResponseSchema, acceptLanguage);
}
