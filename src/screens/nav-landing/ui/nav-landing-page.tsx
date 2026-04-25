import styles from "./nav-landing-page.module.css";

export function NavLandingPage({ title }: { title: string }) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
    </main>
  );
}
