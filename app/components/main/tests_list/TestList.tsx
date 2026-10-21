"use client";
import styles from "./TestList.module.scss";
import { useEffect, useState } from "react";
import type { Test } from "../../../../types/test";

interface TestListProps {
  isOpen: boolean;
  onSelectTest: (test: Test) => void;
}

export default function TestList({ isOpen, onSelectTest }: TestListProps) {
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    const fetchTests = async () => {
      const res = await fetch("/api/test");
      const data: Test[] = await res.json();
      setTests(data);
    };

    fetchTests();
  }, []);

  return (
    <section
      className={`${styles.testList} ${isOpen ? styles["testList--open"] : ""}`}
    >
      <h2 className={styles.testList__title}>Список тестів</h2>
      <ul className={styles.testList__items}>
        {tests.map((test) => (
          <li key={test._id} className={styles.testList__item}>
            <button
              type="button"
              className={styles.testList__button}
              onClick={() => onSelectTest(test)}
            >
              {test.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
