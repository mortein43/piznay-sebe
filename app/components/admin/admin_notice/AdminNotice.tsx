import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./AdminNotice.module.scss";

interface AdminNoticeProps {
  title: string;
  text: string;
  // An error line under the text, for example why sign-in failed.
  error?: string;
  link?: { href: string; label: string };
  children?: ReactNode;
}

// The box shown on the admin sign-in, 401 and 403 pages.
export default function AdminNotice({ title, text, error, link, children }: AdminNoticeProps) {
  return (
    <main className={styles.notice}>
      <h1 className={styles.notice__title}>{title}</h1>
      <p className={styles.notice__text}>{text}</p>
      {error && <p className={styles.notice__error}>{error}</p>}
      {(link || children) && (
        <div className={styles.notice__actions}>
          {link && (
            <Link className={styles.notice__link} href={link.href}>
              {link.label}
            </Link>
          )}
          {children}
        </div>
      )}
    </main>
  );
}
