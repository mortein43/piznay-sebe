import styles from "./TestList.module.scss";

export default function TestList() {
  return (
    <section className={styles.testList_wrapper}>
      <ul className={styles.testList}>
        <li className={styles.testList__item}></li>
      </ul>
    </section>
  );
}
