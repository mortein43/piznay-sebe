"use client";
import styles from "./QuestionEditor.module.scss";
import AdminButton from "../admin_button/AdminButton";
import { moveItem } from "../test_editor/testDraft";
import type { AnswerRow, FieldErrors, QuestionDraft } from "../test_editor/testDraft";

interface QuestionEditorProps {
  question: QuestionDraft;
  index: number;
  total: number;
  // Shown only after the first save attempt or an import.
  errors: FieldErrors;
  onChange: (question: QuestionDraft) => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
  newKey: () => string;
}

export default function QuestionEditor({
  question,
  index,
  total,
  errors,
  onChange,
  onMove,
  onRemove,
  newKey,
}: QuestionEditorProps) {
  const error = (field: string) => errors[`q:${question.key}${field}`];
  const setAnswers = (answers: AnswerRow[]) => onChange({ ...question, answers });
  const setAnswer = (rowIndex: number, change: Partial<AnswerRow>) =>
    setAnswers(question.answers.map((row, i) => (i === rowIndex ? { ...row, ...change } : row)));

  return (
    <fieldset className={styles.question}>
      <div className={styles.question__head}>
        <legend className={styles.question__number}>Питання {index + 1}</legend>
        <div className={styles.question__controls}>
          <AdminButton variant="small" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Перемістити питання вгору">
            ↑
          </AdminButton>
          <AdminButton variant="small" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Перемістити питання вниз">
            ↓
          </AdminButton>
          <AdminButton variant="small" onClick={onRemove}>
            Видалити питання
          </AdminButton>
        </div>
      </div>
      {error("") && <p className={styles.question__error}>{error("")}</p>}

      <label className={styles.question__field}>
        <span className={styles.question__label}>Текст питання</span>
        <textarea
          className={styles.question__input}
          rows={2}
          value={question.question}
          onChange={(event) => onChange({ ...question, question: event.target.value })}
        />
        {error(":question") && <span className={styles.question__error}>{error(":question")}</span>}
      </label>

      <label className={styles.question__field}>
        <span className={styles.question__label}>Шкала</span>
        <input
          className={styles.question__input}
          value={question.scale}
          onChange={(event) => onChange({ ...question, scale: event.target.value })}
        />
        {error(":scale") && <span className={styles.question__error}>{error(":scale")}</span>}
      </label>

      <div className={styles.question__answers}>
        <span className={styles.question__label}>Відповіді та бали</span>
        {question.answers.map((row, rowIndex) => (
          <div key={row.key} className={styles.question__answer}>
            <div className={styles.question__answerInputs}>
              <input
                className={`${styles.question__input} ${styles.question__answerLabel}`}
                value={row.label}
                placeholder="Відповідь"
                aria-label={`Відповідь ${rowIndex + 1}`}
                onChange={(event) => setAnswer(rowIndex, { label: event.target.value })}
              />
              <input
                className={`${styles.question__input} ${styles.question__answerScore}`}
                value={row.score}
                placeholder="Бал"
                inputMode="numeric"
                aria-label={`Бал за відповідь ${rowIndex + 1}`}
                onChange={(event) => setAnswer(rowIndex, { score: event.target.value })}
              />
              <AdminButton
                variant="small"
                onClick={() => setAnswers(moveItem(question.answers, rowIndex, -1))}
                disabled={rowIndex === 0}
                aria-label="Перемістити відповідь вгору"
              >
                ↑
              </AdminButton>
              <AdminButton
                variant="small"
                onClick={() => setAnswers(moveItem(question.answers, rowIndex, 1))}
                disabled={rowIndex === question.answers.length - 1}
                aria-label="Перемістити відповідь вниз"
              >
                ↓
              </AdminButton>
              <AdminButton
                variant="small"
                onClick={() => setAnswers(question.answers.filter((_, i) => i !== rowIndex))}
                aria-label="Видалити відповідь"
              >
                ✕
              </AdminButton>
            </div>
            {errors[`a:${row.key}:label`] && (
              <span className={styles.question__error}>{errors[`a:${row.key}:label`]}</span>
            )}
            {errors[`a:${row.key}:score`] && (
              <span className={styles.question__error}>{errors[`a:${row.key}:score`]}</span>
            )}
          </div>
        ))}
        {error(":answers") && <span className={styles.question__error}>{error(":answers")}</span>}
        <AdminButton
          variant="small"
          className={styles.question__addAnswer}
          onClick={() => setAnswers([...question.answers, { key: newKey(), label: "", score: "" }])}
        >
          + Додати відповідь
        </AdminButton>
      </div>
    </fieldset>
  );
}
