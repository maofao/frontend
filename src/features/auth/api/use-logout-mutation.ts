"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { postLogout, sessionKeys } from "@/entities/session";

export function useLogoutMutation() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postLogout(locale),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: sessionKeys.me() });
    },
  });
}
