"use client";
import styles from "./TestList.module.scss";
import { useEffect, useState } from "react";
import type { Test } from "../../../../types/test";

interface TestListProps {
  isOpen: boolean;
  selectedId: string | null;
  onSelectTest: (test: Test) => void;
}

type LoadStatus = "loading" | "ready" | "error";

export default function TestList({
  isOpen,
  selectedId,
  onSelectTest,
}: TestListProps) {
  const [tests, setTests] = useState<Test[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    const fetchTests = async () => {
      // A failed request or an error body ({ message }) shows a message instead of breaking the page.
      try {
        const res = await fetch("/api/test");
        const data: unknown = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          setStatus("error");
          return;
        }
        setTests(data as Test[]);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    fetchTests();
  }, []);

  return (
    <section
      className={`${styles.testList} ${isOpen ? styles["testList--open"] : ""}`}
    >
      <h2 className={styles.testList__title}>Список тестів</h2>
      {status === "loading" && (
        <p className={styles.testList__status}>Завантаження тестів…</p>
      )}
      {status === "error" && (
        <p className={styles.testList__error}>
          Не вдалося завантажити тести. Спробуйте оновити сторінку.
        </p>
      )}
      {status === "ready" && tests.length === 0 && (
        <p className={styles.testList__status}>Тестів поки немає.</p>
      )}
      <ul className={styles.testList__items}>
        {tests.map((test) => {
          const isActive = test._id === selectedId;
          return (
            <li key={test._id}>
              <button
                type="button"
                className={`${styles.testList__button} ${
                  isActive ? styles["testList__button--active"] : ""
                }`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelectTest(test)}
              >
                {test.name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
