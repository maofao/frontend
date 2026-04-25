import { fetchJson } from "@/shared/api";
import type { RegisterBody } from "../model/types";
import { authOkResponseSchema } from "../model/schemas";

export function postRegister(body: RegisterBody, acceptLanguage: string) {
  return fetchJson(
    "/auth/register",
    { method: "POST", body: JSON.stringify(body) },
    authOkResponseSchema,
    acceptLanguage,
  );
}
