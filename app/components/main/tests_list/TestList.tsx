"use client";
import styles from "./TestList.module.scss";
import { useEffect, useState } from "react";
import type { Test } from "../../../../types/test";

interface TestListProps {
  isOpen: boolean;
  onSelectTest: (test: Test) => void;
  selectedId?: string;
}

type LoadStatus = "loading" | "ready" | "error";

export default function TestList({
  isOpen,
  onSelectTest,
  selectedId,
}: TestListProps) {
  const [tests, setTests] = useState<Test[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/api/test");
        // An error response is an object ({ message }), not a list: show the error state instead of crashing.
        if (!res.ok) {
          throw new Error(`Unexpected status ${res.status}`);
        }
        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response shape");
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
        <>
          <p className={styles.testList__message} role="status">
            Завантажуємо тести…
          </p>
          <div className={styles.testList__skeleton} aria-hidden="true">
            <span className={styles.testList__skeletonLine} />
            <span className={styles.testList__skeletonLine} />
            <span className={styles.testList__skeletonLine} />
          </div>
        </>
      )}

      {status === "error" && (
        <p
          className={`${styles.testList__message} ${styles["testList__message--error"]}`}
          role="alert"
        >
          Не вдалося завантажити тести. Спробуйте оновити сторінку.
        </p>
      )}

      {status === "ready" && tests.length === 0 && (
        <p className={styles.testList__message}>Тестів поки немає.</p>
      )}

      {tests.length > 0 && (
        <ul className={styles.testList__items}>
          {tests.map((test) => {
            const isActive = test._id === selectedId;
            return (
              <li key={test._id} className={styles.testList__item}>
                <button
                  type="button"
                  className={`${styles.testList__button} ${isActive ? styles["testList__button--active"] : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onSelectTest(test)}
                >
                  {test.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
