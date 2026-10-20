"use client";
import styles from "./Test.module.scss";
import { useState, useEffect } from "react";
import Image from "next/image";
import ProgressBar from "./progress_bar/ProgressBar";
import type { ScaleScores, Test as TestDocument } from "../../../../types/test";

export default function Test({ test }: { test: TestDocument | null }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<ScaleScores>({});
  const [showResult, setShowResult] = useState(false);
  // The answer picked for the current question, highlighted until the next question shows.
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScores({});
    setShowResult(false);
    setChosenAnswer(null);
  }, [test]);

  if (!test) {
    return (
      <section className={`${styles.test} ${styles.test_welcome}`}>
        <Image
          className={styles.test__logo}
          src="/logo.svg"
          width={240}
          height={240}
          alt=""
          priority={true}
        />
        <h2 className={styles.test__title}>
          Виберіть тест, щоб почати проходження
        </h2>
        <p className={styles.test__lead}>
          Тут немає правильних чи неправильних відповідей — лише ви і ваші
          відчуття. Оберіть тест у списку й відповідайте чесно, не поспішаючи.
        </p>
      </section>
    );
  }

  if (!Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <section className={styles.test}>
        <h2 className={styles.test__name}>{test.name}</h2>
        <p className={styles.test__empty}>У цьому тесті поки немає питань.</p>
      </section>
    );
  }

  // Narrowed by the check above; a local keeps the narrowing inside the callbacks below.
  const questions = test.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isDisabled) return;

    setIsDisabled(true);
    setChosenAnswer(answer);

    const answerValue = currentQuestion.answers[answer];

    setScores((prevScores) => {
      const newScores = { ...prevScores };
      newScores[currentQuestion.scale] =
        (newScores[currentQuestion.scale] || 0) + answerValue;
      return newScores;
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
      setChosenAnswer(null);
      setIsDisabled(false);
    }, 500);
  };

  const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);
  // The bar moves as soon as an answer is picked, not after the 500 ms pause.
  const answeredCount = currentQuestionIndex + (chosenAnswer !== null ? 1 : 0);

  return (
    <section className={styles.test}>
      <div className={styles.test__header}>
        <h2 className={styles.test__name}>{test.name}</h2>
        {test.description && (
          <p className={styles.test__description}>{test.description}</p>
        )}
        <p className={styles.test__instruction}>{test.instruction}</p>
      </div>
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
        <>
          <ProgressBar
            current={currentQuestionIndex + 1}
            answered={answeredCount}
            total={questions.length}
          />
          <section className={styles.test__question}>
            <h3 className={styles.test__questionText}>
              {currentQuestion.question}
            </h3>

            <div className={styles.test__answers}>
              {Object.keys(currentQuestion.answers).map((answer, index) => (
                <button
                  type="button"
                  className={`${styles.test__answer} ${
                    answer === chosenAnswer ? styles.test__answer_chosen : ""
                  }`}
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={isDisabled}
                >
                  {answer}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
