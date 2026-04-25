import { forwardRef, type ComponentPropsWithoutRef } from "react";
import styles from "./input.module.css";

export type InputProps = ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  const rootClass = [styles.root, className].filter(Boolean).join(" ");
  return <input ref={ref} className={rootClass} {...props} />;
});
