import { fetchJson } from "@/shared/api";
import type { LoginBody } from "../model/types";
import { authOkResponseSchema } from "../model/schemas";

export function postLogin(body: LoginBody, acceptLanguage: string) {
  return fetchJson(
    "/auth/login",
    { method: "POST", body: JSON.stringify(body) },
    authOkResponseSchema,
    acceptLanguage,
  );
}
