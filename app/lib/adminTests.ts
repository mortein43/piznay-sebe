import { ObjectId } from "mongodb";
import type { Document } from "mongodb";
import clientPromise from "./mongodb";
import { ADMIN_DB } from "./adminEnv";
import type { TestInput } from "./testSchema";

// Tests in the staging database, for the admin panel. Insert and replace only: tests are never deleted.
// Stored documents are untrusted, so they are returned as plain documents and validated by the caller.

const tests = async () => (await clientPromise).db(ADMIN_DB).collection<Document>("tests");

export interface TestSummary {
  _id: string;
  name: string | null;
  questionCount: number;
}

export interface StoredTest {
  _id: string;
  // The document without _id, as stored.
  doc: Document;
}

// Only 24 hex characters are an id; anything else is not looked up.
export const parseObjectId = (id: string): ObjectId | null =>
  /^[0-9a-f]{24}$/i.test(id) ? new ObjectId(id) : null;

export const listTests = async (): Promise<TestSummary[]> => {
  const docs = await (await tests())
    .find({}, { projection: { name: 1, questions: 1 } })
    .toArray();
  return docs.map((doc) => ({
    _id: String(doc._id),
    name: typeof doc.name === "string" ? doc.name : null,
    questionCount: Array.isArray(doc.questions) ? doc.questions.length : 0,
  }));
};

export const getTest = async (id: ObjectId): Promise<StoredTest | null> => {
  const found = await (await tests()).findOne({ _id: id });
  if (!found) return null;
  const { _id, ...doc } = found;
  return { _id: String(_id), doc };
};

// Names stay unique: tests cannot be deleted, and the promotion script's --only matches by name.
export const insertTest = async (
  input: TestInput
): Promise<{ status: "created"; _id: string } | { status: "duplicate" }> => {
  const collection = await tests();
  if (await collection.findOne({ name: input.name }, { projection: { _id: 1 } })) {
    return { status: "duplicate" };
  }
  const result = await collection.insertOne({ ...input });
  return { status: "created", _id: String(result.insertedId) };
};

// Replaces by _id, so the test keeps its _id and the promotion script updates it in prod. Never upserts.
export const replaceTest = async (
  id: ObjectId,
  input: TestInput
): Promise<"replaced" | "not-found" | "duplicate"> => {
  const collection = await tests();
  if (
    await collection.findOne({ name: input.name, _id: { $ne: id } }, { projection: { _id: 1 } })
  ) {
    return "duplicate";
  }
  const result = await collection.replaceOne({ _id: id }, input);
  return result.matchedCount === 0 ? "not-found" : "replaced";
};
