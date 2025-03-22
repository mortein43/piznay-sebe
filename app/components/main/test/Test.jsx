"use client";
import styles from "./Test.module.scss";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Test({ test }) {
  if (!test) {
    return (
      <section className={styles.test}>
        <h2 className={styles.test__title}>
          Виберіть тест, щоб почати проходження
        </h2>
        <Image
          className={styles.test__logo}
          src="/logo.png"
          width={375}
          height={375}
          alt="logo"
          loading="lazy"
        />
      </section>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScores({});
    setShowResult(false);
  }, [test]);

  const currentQuestion = test.questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    const answerValue = currentQuestion.answers[answer];

    setScores((prevScores) => {
      const newScores = { ...prevScores };
      newScores[currentQuestion.scale] =
        (newScores[currentQuestion.scale] || 0) + answerValue;
      return newScores;
    });

    if (currentQuestionIndex < test.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
    } else {
      setShowResult(true);
    }
  };

  const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);

  return (
    <section className={styles.test}>
      <h2 className={styles.test__name}>{test.name}</h2>
      <p className={styles.test__description}>{test.description}</p>
      <p className={styles.test__instruction}>{test.instruction}</p>
      {showResult ? (
        <section>
          <h3 className={styles.test__resultTitle}>Тест завершено!</h3>
          <p className={styles.test__resultTotal}>
            Ваш результат: {totalScore}
          </p>
          {Object.keys(scores).length > 1 && (
            <>
              <br />
              <h4 className={styles.test__resultTitleForScale}>
                Результат по шкалах:
              </h4>
              <ul className={styles.test__resultForScale}>
                {Object.entries(scores).map(([scale, score]) => (
                  <li key={scale}>
                    {scale}: {score}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className={styles.test__interpritation}>
            {test.interpretation.split("  ").map((line, index) => (
              <span key={index}>
                {line}
                <br />
                <br />
              </span>
            ))}
          </p>
        </section>
      ) : (
        <section className={styles.test__questionWrapper}>
          <h3 className={styles.test__questionText}>
            {currentQuestion.question}
          </h3>
          <section className={styles.test__answersButtonsWrapper}>
            {Object.keys(currentQuestion.answers).map((answer, index) => (
              <button
                className={styles.test__button}
                key={index}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer}
              </button>
            ))}
          </section>
        </section>
      )}
    </section>
  );
}
