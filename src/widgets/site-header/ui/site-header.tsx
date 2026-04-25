"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/shared/lib/i18n/navigation";
import { useMeQuery } from "@/features/auth";
import btnStyles from "@/shared/ui/button/button.module.css";
import styles from "./site-header.module.css";

const AUTH_PATHS = new Set(["/login", "/register"]);

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const { data, isPending } = useMeQuery();

  if (AUTH_PATHS.has(pathname)) {
    return null;
  }

  return (
    <header className={styles.shell}>
      <Link href="/" className={styles.brand}>
        {t("brand")}
      </Link>
      <nav className={styles.nav} aria-label={t("navAria")}>
        <Link href="/artists" className={styles["nav-link"]}>
          {t("navArtists")}
        </Link>
        <Link href="/albums" className={styles["nav-link"]}>
          {t("navAlbums")}
        </Link>
        <Link href="/race" className={styles["nav-link"]}>
          {t("navRace")}
        </Link>
      </nav>
      <div className={styles.right}>
        {isPending ? (
          <span className={styles["right-placeholder"]} aria-hidden />
        ) : data ? (
          <Link href="/app" className={styles["profile-link"]}>
            {t("profile")}
          </Link>
        ) : (
          <Link
            href="/login"
            className={[btnStyles.root, btnStyles.ghost].filter(Boolean).join(" ")}
          >
            {t("login")}
          </Link>
        )}
      </div>
    </header>
  );
}
