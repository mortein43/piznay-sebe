import styles from "./Logo.module.scss";

// The site mark: a face in profile with a sprout growing inside, "know yourself, grow".
// Decorative: the text next to it (or the button's label) names the site.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`${styles.logo} ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className={styles.logo__ground} cx="32" cy="32" r="30" />
      <path
        className={styles.logo__head}
        d="M22 54 C22 48 20 44 18 40 C14 34 14 24 20 18 C25 13 33 12 39 15 C45 18 48 24 47 30 L50 35 C51 36.5 50 37.5 48.5 37.5 L47 37.5 L47 41 C47 43 45.5 44 43.5 44 L40 44 L40 54 Z"
      />
      <path className={styles.logo__stem} d="M30 35 L30 24" />
      <path
        className={styles.logo__leaf}
        d="M30 28 C26 28 23 25.5 23 22 C27 22 30 24.5 30 28 Z"
      />
      <path
        className={styles.logo__leafLight}
        d="M30 26 C30 22 33 19 37 19 C37 23 34 26 30 26 Z"
      />
    </svg>
  );
}
