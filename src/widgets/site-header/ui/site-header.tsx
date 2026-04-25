"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/shared/lib/i18n/navigation";
import { useMeQuery } from "@/features/auth";
import btnStyles from "@/shared/ui/button/button.module.css";
import { LocaleSwitcher } from "./locale-switcher";
import styles from "./site-header.module.css";

const AUTH_PATHS = new Set(["/login", "/register"]);

const NAV_ITEMS = [
  { href: "/artists" as const, msgKey: "navArtists" as const },
  { href: "/albums" as const, msgKey: "navAlbums" as const },
  { href: "/race" as const, msgKey: "navRace" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const { data, isPending } = useMeQuery();
  const [drawerRendered, setDrawerRendered] = useState(false);
  const [drawerEntered, setDrawerEntered] = useState(false);
  const closingRef = useRef(false);
  const drawerPanelRef = useRef<HTMLDivElement>(null);

  const resetDrawer = useCallback(() => {
    closingRef.current = false;
    setDrawerRendered(false);
    setDrawerEntered(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      resetDrawer();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, resetDrawer]);

  useEffect(() => {
    if (!drawerRendered) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDrawerEntered(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [drawerRendered]);

  useEffect(() => {
    if (!drawerRendered || drawerEntered || !closingRef.current) return;
    const el = drawerPanelRef.current;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      closingRef.current = false;
      setDrawerRendered(false);
    };
    const t = window.setTimeout(finish, 320);
    const onEnd = (e: TransitionEvent) => {
      if (e.target !== el || e.propertyName !== "transform") return;
      finish();
    };
    el?.addEventListener("transitionend", onEnd);
    return () => {
      window.clearTimeout(t);
      el?.removeEventListener("transitionend", onEnd);
    };
  }, [drawerRendered, drawerEntered]);

  useEffect(() => {
    if (!drawerRendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closingRef.current = true;
        setDrawerEntered(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerRendered]);

  useEffect(() => {
    if (drawerRendered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerRendered]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 56rem)");
    const onChange = () => {
      if (mq.matches) {
        resetDrawer();
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [resetDrawer]);

  if (AUTH_PATHS.has(pathname)) {
    return null;
  }

  const closeMenu = () => {
    if (!drawerRendered) return;
    if (!drawerEntered) {
      closingRef.current = false;
      setDrawerRendered(false);
      return;
    }
    closingRef.current = true;
    setDrawerEntered(false);
  };

  const toggleDrawer = () => {
    if (!drawerRendered) {
      setDrawerEntered(false);
      setDrawerRendered(true);
      return;
    }
    if (!drawerEntered) {
      closingRef.current = false;
      setDrawerEntered(true);
      return;
    }
    closeMenu();
  };

  const authDesktop = isPending ? (
    <span className={styles["right-placeholder"]} aria-hidden />
  ) : data ? (
    <Link href="/app" className={styles["profile-link"]}>
      {t("profile")}
    </Link>
  ) : (
    <Link href="/login" className={[btnStyles.root, btnStyles.ghost].filter(Boolean).join(" ")}>
      {t("login")}
    </Link>
  );

  const authMobile = isPending ? (
    <span className={styles["right-placeholder"]} aria-hidden />
  ) : data ? (
    <Link href="/app" className={styles["drawer-profile"]} onClick={closeMenu}>
      {t("profile")}
    </Link>
  ) : (
    <Link
      href="/login"
      className={[btnStyles.root, btnStyles.ghost, styles["drawer-login"]]
        .filter(Boolean)
        .join(" ")}
      onClick={closeMenu}
    >
      {t("login")}
    </Link>
  );

  return (
    <>
      <header className={styles.shell}>
        <Link href="/" className={styles.brand}>
          {t("brand")}
        </Link>
        <nav className={styles["nav-desktop"]} aria-label={t("navAria")}>
          {NAV_ITEMS.map(({ href, msgKey }) => (
            <Link key={href} href={href} className={styles["nav-link"]}>
              {t(msgKey)}
            </Link>
          ))}
        </nav>
        <div className={styles.right}>
          <div className={styles["desktop-only"]}>
            <LocaleSwitcher />
            {authDesktop}
          </div>
          <button
            type="button"
            className={[styles.burger, drawerRendered ? styles["burger-open"] : ""]
              .filter(Boolean)
              .join(" ")}
            aria-expanded={drawerRendered}
            aria-controls="site-header-drawer"
            onClick={toggleDrawer}
          >
            <span className={styles["burger-line"]} aria-hidden />
            <span className={styles["burger-line"]} aria-hidden />
            <span className={styles["burger-line"]} aria-hidden />
            <span className={styles["burger-label"]}>{t("menuToggle")}</span>
          </button>
        </div>
      </header>
      {drawerRendered ? (
        <>
          <button
            type="button"
            className={[styles.backdrop, drawerEntered ? styles["backdrop-entered"] : ""]
              .filter(Boolean)
              .join(" ")}
            aria-label={t("menuClose")}
            onClick={closeMenu}
          />
          <div
            id="site-header-drawer"
            ref={drawerPanelRef}
            className={[styles.drawer, drawerEntered ? styles["drawer-entered"] : ""]
              .filter(Boolean)
              .join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label={t("menuDrawerAria")}
          >
            <nav className={styles["drawer-nav"]} aria-label={t("navAria")}>
              <p className={styles["drawer-nav-label"]}>{t("drawerNavLinks")}</p>
              {NAV_ITEMS.map(({ href, msgKey }) => (
                <Link
                  key={href}
                  href={href}
                  className={styles["drawer-nav-link"]}
                  onClick={closeMenu}
                >
                  {t(msgKey)}
                </Link>
              ))}
            </nav>
            <div className={styles["drawer-block"]}>
              <p className={styles["drawer-nav-label"]}>{t("localeSwitchLabel")}</p>
              <LocaleSwitcher />
            </div>
            <div className={styles["drawer-block"]}>{authMobile}</div>
          </div>
        </>
      ) : null}
    </>
  );
}
