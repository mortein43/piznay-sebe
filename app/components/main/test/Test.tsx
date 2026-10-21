"use client";
import styles from "./Test.module.scss";
import { useState, useEffect } from "react";
import Logo from "../../logo/Logo";
import type { ScaleScores, Test as TestDocument } from "../../../../types/test";

// Per-scale result cards cycle through the pastel tints in this order.
const SCALE_TINTS = [
  "test__scale--lavender",
  "test__scale--peach",
  "test__scale--sage",
] as const;

export default function Test({ test }: { test: TestDocument | null }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<ScaleScores>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScores({});
    setShowResult(false);
    setSelectedAnswer(null);
  }, [test]);

  if (!test) {
    return (
      <section className={`${styles.test} ${styles["test--centered"]}`}>
        <Logo className={styles.test__logo} />
        <h2 className={styles.test__name}>
          Виберіть тест, щоб почати проходження
        </h2>
        <p className={styles.test__lead}>
          Відповідайте чесно — правильних чи неправильних відповідей немає.
        </p>
      </section>
    );
  }

  if (!Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <section className={`${styles.test} ${styles["test--centered"]}`}>
        <h2 className={styles.test__name}>{test.name}</h2>
        <p className={styles.test__notice}>У цьому тесті поки немає питань.</p>
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

  // A chosen answer counts as answered at once, so the bar moves on the click, not after the 500 ms pause.
  const totalQuestions = questions.length;
  const answeredCount = showResult
    ? totalQuestions
    : currentQuestionIndex + (isDisabled ? 1 : 0);
  const questionNumber = showResult ? totalQuestions : currentQuestionIndex + 1;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Double spaces mark paragraph breaks; blank pieces from extra spaces are skipped.
  const interpretationParagraphs = test.interpretation
    .split("  ")
    .filter((paragraph) => paragraph.trim() !== "");

  return (
    <section className={styles.test}>
      <div className={styles.test__header}>
        <h2 className={styles.test__name}>{test.name}</h2>
        {test.description && (
          <p className={styles.test__description}>{test.description}</p>
        )}
      </div>
      {!showResult && test.instruction && (
        <p className={styles.test__instruction}>{test.instruction}</p>
      )}

      <div className={styles.test__progress}>
        <div className={styles.test__progressLabel}>
          <span>
            Питання {questionNumber} з {totalQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <progress
          className={styles.test__progressBar}
          value={answeredCount}
          max={totalQuestions}
          aria-label="Прогрес проходження тесту"
        />
      </div>

      {showResult ? (
        <div className={styles.test__result}>
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
              <ul className={styles.test__scaleList}>
                {Object.entries(scores).map(([scale, score], index) => (
                  <li
                    key={scale}
                    className={`${styles.test__scale} ${styles[SCALE_TINTS[index % SCALE_TINTS.length]]}`}
                  >
                    <span className={styles.test__scaleName}>{scale}</span>
                    <strong className={styles.test__scaleScore}>{score}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.test__interpretation}>
            {interpretationParagraphs.map((paragraph, index) => (
              <p key={index} className={styles.test__paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.test__question}>
          <h3 className={styles.test__questionText}>
            {currentQuestion.question}
          </h3>

          <div className={styles.test__answers}>
            {Object.keys(currentQuestion.answers).map((answer, index) => (
              <button
                type="button"
                className={`${styles.test__answer} ${selectedAnswer === answer ? styles["test__answer--chosen"] : ""}`}
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isDisabled}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
