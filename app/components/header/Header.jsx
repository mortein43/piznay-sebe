import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <Image
          className={styles.header__logo}
          src="/logo.png"
          width={250}
          height={250}
          alt="logo"
        ></Image>
        <h1 className={styles.header__title}>Пізнай себе</h1>
      </header>
    </>
  );
}
