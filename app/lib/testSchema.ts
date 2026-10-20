import { z } from "zod";

// The test document as the admin panel writes it (without _id), shared by the editor, the JSON import,
// the admin API and scripts/check-tests-schema.mts. Messages are UI text, so they are in Ukrainian.
// Unknown keys are rejected, so nothing but these fields can reach the database.

const objectError = (issue: { code: string }) =>
  issue.code === "unrecognized_keys" ? "Невідоме поле" : "Має бути об’єктом";

const notBlank = (value: string) => value.trim().length > 0;

const text = (max: number, required: string) =>
  z
    .string({ error: "Має бути текстом" })
    .max(max, `Не більше ${max} символів`)
    .refine(notBlank, required);

// Checked per key in the record's superRefine, so each message points at its own answer.
const labelProblem = (label: string): string | null => {
  if (!notBlank(label)) return "Вкажіть текст відповіді";
  if (label.length > 200) return "Не більше 200 символів";
  if (label.startsWith("$")) return "Відповідь не може починатися з «$»";
  return null;
};

const answerScore = z
  .number({ error: "Бал має бути числом" })
  .int("Бал має бути цілим числом")
  .min(-1000, "Бал не менше -1000")
  .max(1000, "Бал не більше 1000");

export const questionSchema = z.strictObject(
  {
    question: text(1000, "Вкажіть текст питання"),
    scale: text(200, "Вкажіть шкалу"),
    // Answer label -> score; key order is the order shown to users.
    answers: z
      .record(z.string(), answerScore, { error: "Додайте відповіді" })
      .superRefine((answers, ctx) => {
        const labels = Object.keys(answers);
        if (labels.length < 2) ctx.addIssue({ code: "custom", message: "Потрібно щонайменше 2 відповіді" });
        if (labels.length > 20) ctx.addIssue({ code: "custom", message: "Не більше 20 відповідей" });
        for (const label of labels) {
          const problem = labelProblem(label);
          if (problem) ctx.addIssue({ code: "custom", message: problem, path: [label] });
        }
      }),
    // Legacy field on some stored questions; kept as is, not shown.
    currentAnswer: z.string().max(200).optional(),
  },
  { error: objectError }
);

export const testInputSchema = z.strictObject(
  {
    name: text(200, "Вкажіть назву тесту"),
    description: z
      .string({ error: "Має бути текстом" })
      .max(10000, "Не більше 10000 символів")
      .optional(),
    instruction: text(10000, "Вкажіть інструкцію"),
    // Not trimmed: double spaces mark paragraph breaks.
    interpretation: text(30000, "Вкажіть інтерпретацію"),
    questions: z
      .array(questionSchema, { error: "Додайте питання" })
      .min(1, "Потрібно щонайменше 1 питання")
      .max(300, "Не більше 300 питань"),
    // Legacy field on some stored tests (a string or null); kept as is, not shown.
    title: z.string().max(200).nullable().optional(),
  },
  { error: objectError }
);

export type TestInput = z.infer<typeof testInputSchema>;

export type IssuePath = (string | number)[];

// The path of each issue (["questions", 0, "answers", "Так"]); the admin API returns only these, not the messages.
// Arrays, not dotted strings: answer labels may contain dots.
export const issuePaths = (error: z.ZodError): IssuePath[] =>
  error.issues.map((issue) =>
    issue.path.map((part) => (typeof part === "number" ? part : String(part)))
  );
