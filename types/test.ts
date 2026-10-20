// A test document from the `tests` collection, as GET /api/test returns it.
// Fields some existing documents lack are optional.

// Summed score per scale name.
export type ScaleScores = Record<string, number>;

export interface Question {
  question: string;
  scale: string;
  // Answer label -> score.
  answers: Record<string, number>;
  // Present on some documents, not rendered.
  currentAnswer?: string;
}

export interface Test {
  // The ObjectId, serialised to a string in the JSON response.
  _id: string;
  name: string;
  // Missing on most documents.
  description?: string;
  instruction: string;
  // Double spaces ("  ") mark paragraph breaks.
  interpretation: string;
  // The UI shows a message when questions are missing or empty.
  questions?: Question[];
  // Present on some documents (a string or null), not rendered.
  title?: string | null;
}
