import { createQueryKeyRoot } from "@/shared/api";

const root = createQueryKeyRoot("session");

export const sessionKeys = {
  ...root,
  me: () => [...root.all, "me"] as const,
};
