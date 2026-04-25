import type { ComponentPropsWithoutRef } from "react";
import styles from "./card.module.css";

export type CardProps = ComponentPropsWithoutRef<"div"> & {
  variant?: "elevated" | "muted" | "outline";
  padding?: "compact" | "comfortable" | "spacious";
  maxWidth?: "sm" | "md" | "lg" | "full";
  interactive?: boolean;
  accentTop?: boolean;
};

const maxWidthMap = {
  sm: styles["max-sm"],
  md: styles["max-md"],
  lg: styles["max-lg"],
  full: styles["max-full"],
} as const;

export function Card({
  variant = "elevated",
  padding = "comfortable",
  maxWidth = "md",
  interactive = false,
  accentTop = false,
  className,
  ...props
}: CardProps) {
  const rootClass = [
    styles.root,
    styles[`variant-${variant}`],
    styles[`padding-${padding}`],
    maxWidthMap[maxWidth],
    interactive ? styles.interactive : null,
    accentTop ? styles["accent-top"] : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={rootClass} {...props} />;
}

export type CardHeaderProps = ComponentPropsWithoutRef<"header">;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <header className={[styles.header, className].filter(Boolean).join(" ")} {...props} />;
}

export type CardTitleProps = ComponentPropsWithoutRef<"h2">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h2 className={[styles.title, className].filter(Boolean).join(" ")} {...props} />;
}

export type CardDescriptionProps = ComponentPropsWithoutRef<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={[styles.description, className].filter(Boolean).join(" ")} {...props} />;
}

export type CardBodyProps = ComponentPropsWithoutRef<"div"> & {
  gap?: "none" | "md" | "lg";
};

export function CardBody({ gap = "none", className, ...props }: CardBodyProps) {
  const gapClass = gap === "md" ? styles["gap-md"] : gap === "lg" ? styles["gap-lg"] : null;
  return (
    <div className={[styles.body, gapClass, className].filter(Boolean).join(" ")} {...props} />
  );
}

export type CardFooterProps = ComponentPropsWithoutRef<"footer">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <footer className={[styles.footer, className].filter(Boolean).join(" ")} {...props} />;
}
