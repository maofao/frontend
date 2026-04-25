"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getMe, sessionKeys } from "@/entities/session";

export function useMeQuery() {
  const locale = useLocale();
  return useQuery({
    queryKey: sessionKeys.me(),
    queryFn: () => getMe(locale),
    retry: false,
    staleTime: 60_000,
  });
}
