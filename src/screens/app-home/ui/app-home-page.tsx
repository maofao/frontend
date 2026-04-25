"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/shared/lib/i18n/navigation";
import { useLogoutMutation } from "@/features/auth";
import { Button } from "@/shared/ui/button";

export function AppHomePage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const logout = useLogoutMutation();

  return (
    <main style={{ padding: "var(--space-xl)" }}>
      <h1
        style={{
          fontFamily: "var(--font-stack-heading)",
          fontSize: "var(--text-2xl)",
          marginBottom: "var(--space-lg)",
        }}
      >
        {t("appTitle")}
      </h1>
      <Button
        variant="ghost"
        disabled={logout.isPending}
        onClick={() => {
          void (async () => {
            try {
              await logout.mutateAsync();
            } finally {
              router.replace("/");
            }
          })();
        }}
      >
        {t("logout")}
      </Button>
    </main>
  );
}
