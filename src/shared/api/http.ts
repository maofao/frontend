import { z, type ZodType } from "zod";
import { env } from "@/shared/config";
import { ApiClientError, apiErrorBodySchema } from "./error-schema";

export class ApiHttpError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.body = body;
  }
}

function joinUrl(base: string, path: string) {
  const trimmedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
}

const PATHS_WITHOUT_REFRESH_ON_401 = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);

function mergeHeaders(init: RequestInit | undefined, acceptLanguage?: string): Headers {
  const headers = new Headers(init?.headers);
  if (acceptLanguage) {
    headers.set("Accept-Language", acceptLanguage);
  }
  const hasBody = init?.body != null && !(typeof init.body === "string" && init.body.length === 0);
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

async function rawFetch(
  path: string,
  init: RequestInit | undefined,
  acceptLanguage?: string,
): Promise<Response> {
  const url = joinUrl(env.NEXT_PUBLIC_API_URL, path);
  return fetch(url, {
    ...init,
    credentials: "include",
    headers: mergeHeaders(init, acceptLanguage),
  });
}

async function fetchWithOptionalRefresh(
  path: string,
  init: RequestInit | undefined,
  acceptLanguage?: string,
): Promise<Response> {
  let res = await rawFetch(path, init, acceptLanguage);
  if (res.status === 401 && !PATHS_WITHOUT_REFRESH_ON_401.has(path)) {
    const refresh = await rawFetch("/auth/refresh", { method: "POST" }, acceptLanguage);
    if (refresh.ok) {
      res = await rawFetch(path, init, acceptLanguage);
    }
  }
  return res;
}

function parseErrorBody(text: string, status: number): ApiClientError | ApiHttpError {
  if (!text) {
    return new ApiHttpError(`HTTP ${status}`, status, text);
  }
  try {
    const json = JSON.parse(text) as unknown;
    const parsed = apiErrorBodySchema.safeParse(json);
    if (parsed.success) {
      return new ApiClientError(parsed.data);
    }
  } catch {
    // fallthrough
  }
  return new ApiHttpError(`HTTP ${status}`, status, text);
}

export async function fetchJson<S extends ZodType>(
  path: string,
  init: RequestInit | undefined,
  schema: S,
  acceptLanguage?: string,
): Promise<z.output<S>> {
  const res = await fetchWithOptionalRefresh(path, init, acceptLanguage);
  const text = await res.text();
  if (!res.ok) {
    throw parseErrorBody(text, res.status);
  }
  const json = text ? (JSON.parse(text) as unknown) : null;
  return schema.parse(json);
}
