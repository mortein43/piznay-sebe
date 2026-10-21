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
  // The answer just chosen, highlighted during the pause before the next question.
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScores({});
    setShowResult(false);
  }, [test]);

  if (!test) {
    return (
      <section className={`${styles.test} ${styles["test--welcome"]}`}>
        <Image
          className={styles.test__logo}
          src="/logo.svg"
          width={240}
          height={240}
          alt=""
          priority={true}
        />
        <h2 className={styles.test__welcomeTitle}>
          Виберіть тест, щоб почати проходження
        </h2>
        <p className={styles.test__welcomeText}>
          Тут немає правильних чи неправильних відповідей — лише нагода краще
          зрозуміти себе.
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
    setSelectedAnswer(answer);

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
      setSelectedAnswer(null);
      setIsDisabled(false);
    }, 500);
  };

  const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);

  // The bar moves as soon as an answer is chosen, during the pause before the next question.
  const answeredCount = showResult
    ? questions.length
    : currentQuestionIndex + (isDisabled ? 1 : 0);

  // Double spaces mark paragraph breaks; runs of them would leave empty paragraphs, so those are skipped.
  const interpretationParagraphs = test.interpretation
    .split("  ")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <section className={styles.test}>
      <h2 className={styles.test__name}>{test.name}</h2>
      {test.description && (
        <p className={styles.test__description}>{test.description}</p>
      )}
      <p className={styles.test__instruction}>{test.instruction}</p>
      <div className={styles.test__progress}>
        <ProgressBar
          answered={answeredCount}
          total={questions.length}
          current={Math.min(currentQuestionIndex + 1, questions.length)}
        />
      </div>
      {showResult ? (
        <section className={styles.test__result}>
          <div className={styles.test__resultSummary}>
            <div className={styles.test__score} aria-hidden="true">
              {totalScore}
            </div>
            <div>
              <h3 className={styles.test__resultTitle}>Тест завершено!</h3>
              <p className={styles.test__resultTotal}>
                Ваш результат: {totalScore}
              </p>
            </div>
          </div>
          {Object.keys(scores).length > 1 && (
            <div className={styles.test__scales}>
              <h4 className={styles.test__scalesTitle}>Результат по шкалах:</h4>
              <ul className={styles.test__scaleList}>
                {Object.entries(scores).map(([scale, score]) => (
                  <li key={scale} className={styles.test__scale}>
                    <span>{scale}</span>
                    <strong className={styles.test__scaleScore}>{score}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.test__interpretation}>
            {interpretationParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.test__question}>
          <h3 className={styles.test__questionText}>
            {currentQuestion.question}
          </h3>

          <div className={styles.test__answers}>
            {Object.keys(currentQuestion.answers).map((answer, index) => (
              <button
                type="button"
                className={`${styles.test__answer} ${
                  selectedAnswer === answer
                    ? styles["test__answer--selected"]
                    : ""
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
      )}
    </section>
  );
}
