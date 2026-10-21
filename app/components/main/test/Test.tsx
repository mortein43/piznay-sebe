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

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScores({});
    setShowResult(false);
  }, [test]);

  if (!test) {
    return (
      <section className={`${styles.test} ${styles["test--empty"]}`}>
        <Image
          className={styles.test__logo}
          src="/logo.svg"
          width={200}
          height={200}
          alt=""
          priority={true}
        />
        <h2 className={styles.test__title}>
          Виберіть тест, щоб почати проходження
        </h2>
        <p className={styles.test__hint}>
          Знайдіть тихе місце, не поспішайте й відповідайте чесно — правильних
          чи неправильних відповідей тут немає.
        </p>
      </section>
    );
  }

  if (!Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <section className={styles.test}>
        <h2 className={styles.test__name}>{test.name}</h2>
        <p className={styles.test__hint}>У цьому тесті поки немає питань.</p>
      </section>
    );
  }

  // Narrowed by the check above; a local keeps the narrowing inside the callbacks below.
  const questions = test.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isDisabled) return;

    setIsDisabled(true);

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
      setIsDisabled(false);
    }, 500);
  };

  const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);

  return (
    <section className={styles.test}>
      <h2 className={styles.test__name}>{test.name}</h2>
      {test.description && (
        <p className={styles.test__description}>{test.description}</p>
      )}
      <p className={styles.test__instruction}>{test.instruction}</p>
      {showResult ? (
        <section className={styles.test__result}>
          <div className={styles.test__resultSummary}>
            <h3 className={styles.test__resultTitle}>Тест завершено!</h3>
            <p className={styles.test__resultTotal}>
              Ваш результат:{" "}
              <strong className={styles.test__resultScore}>{totalScore}</strong>
            </p>
          </div>
          {Object.keys(scores).length > 1 && (
            <div className={styles.test__scales}>
              <h4 className={styles.test__scalesTitle}>Результат по шкалах:</h4>
              <ul className={styles.test__scalesList}>
                {Object.entries(scores).map(([scale, score]) => (
                  <li key={scale} className={styles.test__scale}>
                    <span>{scale}</span>
                    <span className={styles.test__scaleScore}>{score}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.test__interpretation}>
            {test.interpretation
              .split("  ")
              // Triple or trailing double spaces leave empty pieces; they are not paragraphs.
              .filter((paragraph) => paragraph.trim() !== "")
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </section>
      ) : (
        <section className={styles.test__questionWrapper}>
          <ProgressBar
            current={currentQuestionIndex + 1}
            // isDisabled is set from the click until the next question shows, so the bar moves on the click itself.
            answered={currentQuestionIndex + (isDisabled ? 1 : 0)}
            total={questions.length}
          />
          <div className={styles.test__question}>
            <h3 className={styles.test__questionText}>
              {currentQuestion.question}
            </h3>

            <div className={styles.test__answers}>
              {Object.keys(currentQuestion.answers).map((answer, index) => (
                <button
                  type="button"
                  className={styles.test__button}
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={isDisabled}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
