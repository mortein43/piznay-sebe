import type { NextApiRequest, NextApiResponse } from "next";
import type { WithId } from "mongodb";
import clientPromise from "../../app/lib/mongodb";
import type { Test } from "../../types/test";

// The stored document: the driver adds _id as an ObjectId, which the JSON response turns into the string in Test.
type TestDocument = Omit<Test, "_id">;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WithId<TestDocument>[] | { message: string }>
) {
  // Read-only: tests reach prod only through scripts/promote-tests-to-prod.mts.
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "piznay_sebe");
    const collection = db.collection<TestDocument>("tests");

    const tests = await collection.find({}).toArray();
    res.status(200).json(tests);
  } catch (error) {
    console.error(String(error));
    res.status(500).json({ message: "Internal server error" });
  }
}
