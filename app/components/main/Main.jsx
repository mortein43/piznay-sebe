"use client";
import styles from "./Main.module.scss";
import TestList from "./tests_list/TestList";
import Test from "./test/Test";

export default function Main({ selectedTest, setSelectedTest }) {
  const handleSelectTest = (test) => {
    setSelectedTest(null);
    setTimeout(() => setSelectedTest(test), 10);
  };

  return (
    <main className={`${styles.main_wrapper} container mx-auto`}>
      <TestList onSelectTest={handleSelectTest} />
      <Test key={selectedTest?._id} test={selectedTest} />
    </main>
  );
}
