import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  weight: "400",
  subsets: ["cyrillic"],
});

export default function Header({ onLogoClick }) {
  return (
    <>
      <header className={styles.header}>
        <Image
          className={styles.header__logo}
          src="/logo.svg"
          width={175}
          height={175}
          alt="logo"
          onClick={onLogoClick}
          priority={true}
        />
        <h1 className={`${styles.header__title} ${caveat.className}`}>
          Пізнай себе
        </h1>
      </header>
    </>
  );
}
