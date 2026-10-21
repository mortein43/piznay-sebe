import styles from "./Header.module.scss";
import Logo from "../logo/Logo";

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
          <Logo className={styles.header__logo} />
        </button>
        <div className={styles.header__text}>
          <h1 className={styles.header__title}>Пізнай себе</h1>
          <p className={styles.header__tagline}>
            Психологічні тести для самопізнання
          </p>
        </div>
      </div>
    </header>
  );
}
