import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./label.module.css";

export type LabelProps = ComponentPropsWithoutRef<"label"> & {
  requiredMark?: ReactNode;
};

export function Label({ children, className, requiredMark, ...props }: LabelProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(" ");
  return (
    <label className={rootClass} {...props}>
      {children}
      {requiredMark != null ? <span className={styles.required}>{requiredMark}</span> : null}
    </label>
  );
}
