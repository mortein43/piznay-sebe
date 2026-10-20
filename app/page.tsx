"use client";
import { Fragment, useState } from "react";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import type { Test } from "../types/test";

export default function Home() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

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
