"use client";
import { Fragment, useState } from "react";
import Header from "./components/header/Header";
import Main from "./components/main/Main";

export default function Home() {
  const [selectedTest, setSelectedTest] = useState(null);

  const resetTest = () => {
    setSelectedTest(null);
  };
  return (
    <>
      <Header className="headerInPage" onLogoClick={resetTest} />
      <Main selectedTest={selectedTest} setSelectedTest={setSelectedTest} />
    </>
  );
}
