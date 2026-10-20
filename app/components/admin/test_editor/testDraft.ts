import { testInputSchema } from "../../../lib/testSchema";
import type { IssuePath, TestInput } from "../../../lib/testSchema";

// The editor's working copy of a test. Answers are rows, not a record, so they can be reordered and
// a blank or repeated label is caught on its row before it would collapse in a JS object.

export interface AnswerRow {
  key: string;
  label: string;
  // Kept as typed; converted to a number when the draft is checked.
  score: string;
}

export interface QuestionDraft {
  key: string;
  question: string;
  scale: string;
  answers: AnswerRow[];
  // Legacy field, kept unchanged and not shown.
  currentAnswer?: string;
}

export interface TestDraft {
  name: string;
  description: string;
  instruction: string;
  interpretation: string;
  questions: QuestionDraft[];
  // Legacy field, kept unchanged and not shown.
  title?: string | null;
}

// Field key -> Ukrainian message. Keys: "name", "description", "instruction", "interpretation", "questions",
// "form", "q:<question key>", "q:<question key>:question", "q:<question key>:scale",
// "q:<question key>:answers", "a:<row key>:label", "a:<row key>:score".
export type FieldErrors = Record<string, string>;

const KNOWN_FIELDS = ["name", "description", "instruction", "interpretation", "questions", "title"];
const KNOWN_QUESTION_FIELDS = ["question", "scale", "answers", "currentAnswer"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asText = (value: unknown) =>
  typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);

export const emptyDraft = (): TestDraft => ({
  name: "",
  description: "",
  instruction: "",
  interpretation: "",
  questions: [
    {
      key: "q0",
      question: "",
      scale: "",
      answers: [
        { key: "a0-0", label: "", score: "" },
        { key: "a0-1", label: "", score: "" },
      ],
    },
  ],
});

// Builds a draft from a stored or imported document, which may not match the schema.
// Returns the names of fields the editor cannot keep; they are dropped on save.
export const draftFromDocument = (doc: unknown): { draft: TestDraft; droppedFields: string[] } => {
  const source = isRecord(doc) ? doc : {};
  const droppedFields = Object.keys(source).filter(
    (field) => field !== "_id" && !KNOWN_FIELDS.includes(field)
  );
  const questions = Array.isArray(source.questions) ? source.questions : [];

  const draft: TestDraft = {
    name: asText(source.name),
    description: asText(source.description),
    instruction: asText(source.instruction),
    interpretation: asText(source.interpretation),
    questions: questions.map((item: unknown, index): QuestionDraft => {
      const question = isRecord(item) ? item : {};
      Object.keys(question)
        .filter((field) => !KNOWN_QUESTION_FIELDS.includes(field))
        .forEach((field) => droppedFields.push(`questions[${index + 1}].${field}`));
      const answers = isRecord(question.answers) ? Object.entries(question.answers) : [];
      return {
        key: `q${index}`,
        question: asText(question.question),
        scale: asText(question.scale),
        answers: answers.map(([label, score], answerIndex) => ({
          key: `a${index}-${answerIndex}`,
          label,
          score: typeof score === "number" ? String(score) : asText(score),
        })),
        ...(typeof question.currentAnswer === "string"
          ? { currentAnswer: question.currentAnswer }
          : {}),
      };
    }),
    ...("title" in source && (typeof source.title === "string" || source.title === null)
      ? { title: source.title }
      : {}),
  };
  return { draft, droppedFields };
};

// Swaps an item with its neighbour above (-1) or below (1).
export const moveItem = <T>(items: T[], index: number, offset: -1 | 1): T[] => {
  const target = index + offset;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

// A score as typed: whole numbers become numbers; anything else stays something the schema rejects.
const toScore = (score: string): number => {
  const trimmed = score.trim();
  return trimmed === "" ? Number.NaN : Number(trimmed);
};

// The document the draft would save. Labels are trimmed only for the duplicate check, never changed.
const toDocument = (draft: TestDraft): Record<string, unknown> => ({
  name: draft.name,
  ...(draft.description !== "" ? { description: draft.description } : {}),
  instruction: draft.instruction,
  interpretation: draft.interpretation,
  questions: draft.questions.map((question) => ({
    question: question.question,
    scale: question.scale,
    answers: Object.fromEntries(question.answers.map((row) => [row.label, toScore(row.score)])),
    ...(question.currentAnswer !== undefined ? { currentAnswer: question.currentAnswer } : {}),
  })),
  ...(draft.title !== undefined ? { title: draft.title } : {}),
});

// Maps a schema issue path to the field it belongs to.
const fieldKey = (draft: TestDraft, path: IssuePath, code?: string): string => {
  if (path.length === 0) return "form";
  const [top, index, field, label] = path;
  if (top !== "questions" || typeof index !== "number") return String(top);
  const question = draft.questions[index];
  if (!question) return "questions";
  if (field === undefined) return `q:${question.key}`;
  if (field !== "answers" || label === undefined) return `q:${question.key}:${String(field)}`;
  const rows = question.answers.filter((answer) => answer.label === String(label));
  if (rows.length === 0) return `q:${question.key}:answers`;
  // A custom issue on an answer is about its label (see testSchema.ts); the rest are about the score,
  // which comes from the last row with that label (the one the record keeps).
  return code === "custom" ? `a:${rows[0].key}:label` : `a:${rows[rows.length - 1].key}:score`;
};

// Checks the draft the same way the server does, plus per-row checks the record form cannot show.
export const checkDraft = (
  draft: TestDraft
): { input: TestInput; errors: null } | { input: null; errors: FieldErrors } => {
  const errors: FieldErrors = {};
  for (const question of draft.questions) {
    const seen = new Set<string>();
    for (const row of question.answers) {
      if (row.label.trim() === "") errors[`a:${row.key}:label`] = "Вкажіть текст відповіді";
      else if (seen.has(row.label)) errors[`a:${row.key}:label`] = "Така відповідь уже є в цьому питанні";
      seen.add(row.label);
      // Per row as well: rows with the same label share one key in the record the schema sees.
      const score = toScore(row.score);
      if (Number.isNaN(score)) errors[`a:${row.key}:score`] = "Бал має бути числом";
      else if (!Number.isInteger(score)) errors[`a:${row.key}:score`] = "Бал має бути цілим числом";
      else if (score < -1000 || score > 1000) errors[`a:${row.key}:score`] = "Бал від -1000 до 1000";
    }
  }

  const result = testInputSchema.safeParse(toDocument(draft));
  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path.map((part) => (typeof part === "number" ? part : String(part)));
      const key = fieldKey(draft, path, issue.code);
      errors[key] ??= issue.message;
    }
  }

  return Object.keys(errors).length === 0 && result.success
    ? { input: result.data, errors: null }
    : { input: null, errors };
};

// Marks the fields the server rejected (it returns paths only).
export const serverErrors = (draft: TestDraft, paths: IssuePath[]): FieldErrors =>
  Object.fromEntries(
    paths.map((path) => [fieldKey(draft, path), "Сервер не прийняв це поле, перевірте його"])
  );
