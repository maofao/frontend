"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/shared/lib/i18n/navigation";
import { routing } from "@/shared/lib/i18n/routing";
import styles from "./locale-switcher.module.css";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Header");

  return (
    <div className={styles.root} role="group" aria-label={t("localeSwitchLabel")}>
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            hrefLang={loc}
            prefetch={false}
            className={[styles.item, active ? styles["item-active"] : ""].filter(Boolean).join(" ")}
            aria-current={active ? "true" : undefined}
          >
            {loc === "ru" ? t("localeRu") : t("localeEn")}
          </Link>
        );
      })}
    </div>
  );
}
