import clientPromise from "../../app/lib/mongodb";
export default async function handler(req, res) {
  // Read-only: tests reach prod only through scripts/promote-tests-to-prod.mjs.
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "piznay_sebe");
    const collection = db.collection("tests");

    const tests = await collection.find({}).toArray();
    res.status(200).json(tests);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
