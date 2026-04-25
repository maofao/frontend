import { ApiClientError } from "@/shared/api";

type Issue = { path: string[]; message: string };

function parseIssues(details: unknown): Issue[] | null {
  if (details === null || typeof details !== "object") return null;
  const raw = (details as { issues?: unknown }).issues;
  if (!Array.isArray(raw)) return null;
  const out: Issue[] = [];
  for (const item of raw) {
    if (item === null || typeof item !== "object") continue;
    const pathRaw = (item as { path?: unknown }).path;
    const message = (item as { message?: unknown }).message;
    if (!Array.isArray(pathRaw) || typeof message !== "string") continue;
    out.push({ path: pathRaw.map(String), message });
  }
  return out.length ? out : null;
}

export function mapApiClientErrorToRhfServerErrors(err: unknown): {
  field: Record<string, { type: string; message: string }>;
  root?: string;
} | null {
  if (!(err instanceof ApiClientError) || err.code !== "VALIDATION_ERROR") return null;
  const issues = parseIssues(err.details);
  if (!issues) return null;
  const field: Record<string, { type: string; message: string }> = {};
  let root: string | undefined;
  for (const issue of issues) {
    if (!issue.path.length) {
      root = issue.message;
      continue;
    }
    const top = issue.path[0];
    if (typeof top === "string") {
      field[top] = { type: "server", message: issue.message };
    }
  }
  return { field, root };
}
