"use client";
import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import styles from "./Main.module.scss";
import TestList from "./tests_list/TestList";
import Test from "./test/Test";
import type { Test as TestDocument } from "../../../types/test";

interface MainProps {
  selectedTest: TestDocument | null;
  setSelectedTest: Dispatch<SetStateAction<TestDocument | null>>;
}

export default function Main({ selectedTest, setSelectedTest }: MainProps) {
  const [isTestListOpen, setIsTestOpen] = useState(false);

  useEffect(() => {
    if (isTestListOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isTestListOpen]);

  const handleSelectTest = (test: TestDocument) => {
    setSelectedTest(null);
    setTimeout(() => {
      if (test) {
        setSelectedTest(test);
      }
    }, 10);
    setIsTestOpen(false);
  };

  return (
    <main className={styles.main}>
      <button
        type="button"
        className={styles.main__menuButton}
        onClick={() => setIsTestOpen(!isTestListOpen)}
      >
        {isTestListOpen ? "Закрити" : "Вибрати тест"}
      </button>

      {isTestListOpen && (
        <div
          className={styles.main__overlay}
          onClick={() => setIsTestOpen(false)}
        />
      )}
      <TestList isOpen={isTestListOpen} onSelectTest={handleSelectTest} />
      <Test key={selectedTest?._id} test={selectedTest} />
    </main>
  );
}
