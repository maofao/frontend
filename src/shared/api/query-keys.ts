export function createQueryKeyRoot(scope: string) {
  const all = [scope] as const;
  return {
    all,
    lists: () => [...all, "list"] as const,
    list: (filters: Record<string, unknown>) => [...all, "list", filters] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: string | number) => [...all, "detail", id] as const,
  };
}
