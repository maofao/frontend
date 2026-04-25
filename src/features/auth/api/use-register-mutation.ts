"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { RegisterBody } from "@/entities/session";
import { postRegister, sessionKeys } from "@/entities/session";

export function useRegisterMutation() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterBody) => postRegister(body, locale),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
    },
  });
}
