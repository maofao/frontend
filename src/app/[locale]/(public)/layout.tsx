import type { ReactNode } from "react";
import { RedirectIfAuthed } from "@/features/auth";
import styles from "./layout.module.css";

export default function PublicAuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RedirectIfAuthed />
      <div className={styles.root}>
        <div className={styles.inner}>{children}</div>
      </div>
    </>
  );
}
