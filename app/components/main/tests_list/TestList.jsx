"use client";
import styles from "./TestList.module.scss";
import { useEffect, useState } from "react";

export default function TestList({ onSelectTest }) {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const res = await fetch("/api/test");
      const data = await res.json();
      setTests(data);
    };

    fetchTests();
  }, []);

  return (
    <section className={styles.testList_wrapper}>
      <h2 className={styles.testList_title}>Список тестів</h2>
      <ul className={styles.testList}>
        {tests.map((test) => (
          <li
            key={test._id}
            className={styles.testList__item}
            onClick={() => {
              console.log("Вибраний тест:", test);
              onSelectTest(test);
            }}
          >
            {test.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
