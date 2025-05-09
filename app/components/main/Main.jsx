"use client";
import { useState, useEffect } from "react";
import styles from "./Main.module.scss";
import TestList from "./tests_list/TestList";
import Test from "./test/Test";

export default function Main({ selectedTest, setSelectedTest }) {
  const [isTestListOpen, setIsTestOpen] = useState(false);

  useEffect(() => {
    if (isTestListOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isTestListOpen]);

  const handleSelectTest = (test) => {
    setSelectedTest(null);
    setTimeout(() => {
      if (test) {
        setSelectedTest(test);
      }
    }, 10);
    setIsTestOpen(false);
  };

  return (
    <main className={`${styles.main_wrapper} ${styles.myContainer}`}>
      <button
        className={styles.menuButton}
        onClick={() => setIsTestOpen(!isTestListOpen)}
      >
        {isTestListOpen ? "Закрити" : "Вибрати тест"}
      </button>

      {isTestListOpen && (
        <div className={styles.overlay} onClick={() => setIsTestOpen(false)} />
      )}
      <TestList isOpen={isTestListOpen} onSelectTest={handleSelectTest} />
      <Test key={selectedTest?._id} test={selectedTest} />
    </main>
  );
}
