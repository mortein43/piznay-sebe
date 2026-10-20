import Link from "next/link";
import styles from "./TestsTable.module.scss";
import type { TestSummary } from "../../../lib/adminTests";

export default function TestsTable({ tests }: { tests: TestSummary[] }) {
  return (
    <section className={styles.testsTable}>
      <div className={styles.testsTable__head}>
        <h1 className={styles.testsTable__title}>Тести в piznay_sebe_staging</h1>
        <Link className={styles.testsTable__new} href="/admin/new">
          Новий тест або імпорт
        </Link>
      </div>
      {tests.length === 0 ? (
        <p className={styles.testsTable__empty}>Тестів поки немає.</p>
      ) : (
        <ul className={styles.testsTable__list}>
          {tests.map((test) => (
            <li key={test._id} className={styles.testsTable__item}>
              <Link className={styles.testsTable__name} href={`/admin/${test._id}`}>
                {test.name ?? "(без назви)"}
              </Link>
              <span className={styles.testsTable__meta}>
                Питань: {test.questionCount} · {test._id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
