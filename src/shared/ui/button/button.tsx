import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const rootClass = [
    styles.root,
    variant === "primary" ? styles.primary : styles.ghost,
    fullWidth ? styles["full-width"] : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <button type={type} className={rootClass} {...props} />;
}
