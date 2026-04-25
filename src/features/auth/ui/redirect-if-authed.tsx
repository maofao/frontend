"use client";

import { useEffect } from "react";
import { useRouter } from "@/shared/lib/i18n/navigation";
import { useMeQuery } from "../api/use-me-query";

export function RedirectIfAuthed() {
  const router = useRouter();
  const { data, isSuccess } = useMeQuery();
  useEffect(() => {
    if (isSuccess && data) {
      router.replace("/");
    }
  }, [data, isSuccess, router]);
  return null;
}
