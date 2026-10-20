"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./TestEditor.module.scss";
import AdminButton from "../admin_button/AdminButton";
import QuestionEditor from "../question_editor/QuestionEditor";
import { checkDraft, draftFromDocument, emptyDraft, moveItem, serverErrors } from "./testDraft";
import type { FieldErrors, QuestionDraft, TestDraft } from "./testDraft";
import type { IssuePath } from "../../../lib/testSchema";

interface TestEditorProps {
  // The stored test being edited, or undefined for a new test.
  testId?: string;
  // The stored document without _id; it may not match the schema.
  initialDocument?: unknown;
  // False when the server refuses every save (MONGODB_DB is not piznay_sebe_staging).
  canSave: boolean;
}

// Ukrainian messages for the admin API's refusals; the API itself answers in English.
const saveErrorText: Record<number, string> = {
  400: "Сервер не прийняв тест. Поля з помилками позначено нижче.",
  401: "Сесія завершилась. Увійдіть знову на сторінці /admin/sign-in в іншій вкладці й натисніть «Зберегти» ще раз: зміни на цій сторінці не втрачено.",
  403: "Цей обліковий запис не має доступу до збереження тестів.",
  404: "Цього тесту вже немає в базі даних.",
  409: "Тест з такою назвою вже є. Змініть назву.",
  413: "Тест завеликий для збереження.",
  503: "Збереження вимкнено: сайт працює не з базою даних piznay_sebe_staging.",
};

const isIssueList = (value: unknown): value is { path: IssuePath }[] =>
  Array.isArray(value) &&
  value.every((issue) => typeof issue === "object" && issue !== null && Array.isArray(issue.path));

export default function TestEditor({ testId, initialDocument, canSave }: TestEditorProps) {
  const router = useRouter();
  const [{ draft: initialDraft, droppedFields }] = useState(() =>
    initialDocument === undefined
      ? { draft: emptyDraft(), droppedFields: [] }
      : draftFromDocument(initialDocument)
  );
  const [draft, setDraft] = useState<TestDraft>(initialDraft);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialDraft));
  // Errors show after the first save attempt, or at once for a stored test that does not match the schema.
  const [showErrors, setShowErrors] = useState(initialDocument !== undefined);
  const [serverFieldErrors, setServerFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const keyCounter = useRef(0);
  const newKey = () => `n${keyCounter.current++}`;

  const checked = useMemo(() => checkDraft(draft), [draft]);
  const errors: FieldErrors = showErrors ? { ...serverFieldErrors, ...(checked.errors ?? {}) } : {};
  const isDirty = JSON.stringify(draft) !== savedSnapshot;

  // Warns before leaving the page with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const update = (change: Partial<TestDraft>) => {
    setDraft((current) => ({ ...current, ...change }));
    setServerFieldErrors({});
    setStatus(null);
  };

  const setQuestion = (index: number, question: QuestionDraft) =>
    update({ questions: draft.questions.map((item, i) => (i === index ? question : item)) });

  const addQuestion = () => {
    // A new question repeats the previous one's scale and answers: most tests reuse them.
    const previous = draft.questions[draft.questions.length - 1];
    update({
      questions: [
        ...draft.questions,
        {
          key: newKey(),
          question: "",
          scale: previous?.scale ?? "",
          answers: (previous?.answers ?? [
            { key: "", label: "", score: "" },
            { key: "", label: "", score: "" },
          ]).map((row) => ({ key: newKey(), label: row.label, score: row.score })),
        },
      ],
    });
  };

  const save = async () => {
    setShowErrors(true);
    setStatus(null);
    if (!checked.input) {
      setStatus({ kind: "error", text: "Виправте помилки, позначені нижче." });
      return;
    }

    setSaving(true);
    let keepDisabled = false;
    try {
      const response = await fetch(testId ? `/api/admin/tests/${testId}` : "/api/admin/tests", {
        method: testId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.input),
      });
      const body: unknown = await response.json().catch(() => null);

      if (response.ok) {
        setSavedSnapshot(JSON.stringify(draft));
        const createdId =
          typeof body === "object" && body !== null && "_id" in body && typeof body._id === "string"
            ? body._id
            : null;
        if (!testId && createdId) {
          // Stays disabled until the edit page of the new test opens, so a second click cannot create a copy.
          keepDisabled = true;
          router.push(`/admin/${createdId}`);
          return;
        }
        setStatus({ kind: "ok", text: "Збережено." });
        return;
      }

      if (response.status === 400 && typeof body === "object" && body !== null && "issues" in body) {
        const issues = body.issues;
        if (isIssueList(issues)) setServerFieldErrors(serverErrors(draft, issues.map((issue) => issue.path)));
      }
      setStatus({
        kind: "error",
        text: saveErrorText[response.status] ?? "Не вдалося зберегти. Спробуйте ще раз.",
      });
    } catch {
      setStatus({ kind: "error", text: "Не вдалося зв’язатися із сервером. Спробуйте ще раз." });
    } finally {
      if (!keepDisabled) setSaving(false);
    }
  };

  const field = (name: "name" | "description" | "instruction" | "interpretation") =>
    errors[name] && <span className={styles.editor__error}>{errors[name]}</span>;

  return (
    <section className={styles.editor}>
      <h1 className={styles.editor__title}>{testId ? "Редагування тесту" : "Новий тест"}</h1>
      {testId && <p className={styles.editor__meta}>_id: {testId}</p>}
      {droppedFields.length > 0 && (
        <p className={styles.editor__notice}>
          Ці поля редактор не підтримує, тож їх не буде збережено: {droppedFields.join(", ")}
        </p>
      )}
      {errors.form && <p className={styles.editor__error}>{errors.form}</p>}

      <label className={styles.editor__field}>
        <span className={styles.editor__label}>Назва</span>
        <input
          className={styles.editor__input}
          value={draft.name}
          onChange={(event) => update({ name: event.target.value })}
        />
        {field("name")}
      </label>

      <label className={styles.editor__field}>
        <span className={styles.editor__label}>Опис (необов’язково)</span>
        <textarea
          className={styles.editor__input}
          rows={3}
          value={draft.description}
          onChange={(event) => update({ description: event.target.value })}
        />
        {field("description")}
      </label>

      <label className={styles.editor__field}>
        <span className={styles.editor__label}>Інструкція</span>
        <textarea
          className={styles.editor__input}
          rows={3}
          value={draft.instruction}
          onChange={(event) => update({ instruction: event.target.value })}
        />
        {field("instruction")}
      </label>

      <div className={styles.editor__questions}>
        <h2 className={styles.editor__subtitle}>Питання ({draft.questions.length})</h2>
        {errors.questions && <span className={styles.editor__error}>{errors.questions}</span>}
        {draft.questions.map((question, index) => (
          <QuestionEditor
            key={question.key}
            question={question}
            index={index}
            total={draft.questions.length}
            errors={errors}
            onChange={(changed) => setQuestion(index, changed)}
            onMove={(offset) => update({ questions: moveItem(draft.questions, index, offset) })}
            onRemove={() => update({ questions: draft.questions.filter((_, i) => i !== index) })}
            newKey={newKey}
          />
        ))}
        <AdminButton className={styles.editor__addQuestion} onClick={addQuestion}>
          + Додати питання
        </AdminButton>
      </div>

      <label className={styles.editor__field}>
        <span className={styles.editor__label}>Інтерпретація результатів</span>
        <span className={styles.editor__hint}>
          Два пробіли поспіль починають новий абзац, як на сайті.
        </span>
        <textarea
          className={styles.editor__input}
          rows={8}
          value={draft.interpretation}
          onChange={(event) => update({ interpretation: event.target.value })}
        />
        {field("interpretation")}
      </label>

      <div className={styles.editor__actions}>
        <AdminButton variant="primary" onClick={save} disabled={!canSave || saving}>
          {saving ? "Збереження…" : "Зберегти"}
        </AdminButton>
        {isDirty && !saving && <span className={styles.editor__hint}>Є незбережені зміни</span>}
      </div>
      {status && (
        <p className={status.kind === "ok" ? styles.editor__success : styles.editor__error}>
          {status.text}
        </p>
      )}
    </section>
  );
}
