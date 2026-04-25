"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "@/shared/lib/i18n/navigation";
import { useMeQuery } from "../api/use-me-query";

export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useMeQuery();
  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);
  if (isPending) {
    return <div style={{ minHeight: "50vh" }} />;
  }
  if (isError || !data) {
    return null;
  }
  return children;
}
