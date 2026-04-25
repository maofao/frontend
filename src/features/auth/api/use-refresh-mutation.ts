"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { postRefresh, sessionKeys } from "@/entities/session";

export function useRefreshMutation() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postRefresh(locale),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
    },
  });
}
