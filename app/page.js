"use client";
import { useState } from "react";
import Header from "./components/header/Header";
import Main from "./components/main/Main";

export default function Home() {
  const [selectedTest, setSelectedTest] = useState(null);

  const resetTest = () => {
    setSelectedTest(null);
  };
  return (
    <>
      <Header onLogoClick={resetTest} />
      <Main selectedTest={selectedTest} setSelectedTest={setSelectedTest} />
    </>
  );
}
