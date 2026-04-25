"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { LoginBody } from "@/entities/session";
import { postLogin, sessionKeys } from "@/entities/session";

export function useLoginMutation() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginBody) => postLogin(body, locale),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
    },
  });
}
