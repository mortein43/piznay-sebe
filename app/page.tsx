"use client";
import { useState } from "react";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import styles from "./page.module.scss";
import type { Test } from "../types/test";

export default function Home() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const resetTest = () => {
    setSelectedTest(null);
  };
  return (
    <div className={styles.page}>
      <Header onLogoClick={resetTest} />
      <Main selectedTest={selectedTest} setSelectedTest={setSelectedTest} />
    </div>
  );
}
