import { fetchJson } from "@/shared/api";
import { authOkResponseSchema } from "../model/schemas";

export function postRefresh(acceptLanguage: string) {
  return fetchJson("/auth/refresh", { method: "POST" }, authOkResponseSchema, acceptLanguage);
}
