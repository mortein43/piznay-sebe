import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <button
          type="button"
          className={styles.header__home}
          onClick={onLogoClick}
          aria-label="На головну"
        >
          <Image
            className={styles.header__logo}
            src="/logo.svg"
            width={64}
            height={64}
            alt=""
            priority={true}
          />
        </button>
        <div className={styles.header__brand}>
          <h1 className={styles.header__title}>Пізнай себе</h1>
          <p className={styles.header__tagline}>
            Психологічні тести для самопізнання
          </p>
        </div>
      </div>
    </header>
  );
}
