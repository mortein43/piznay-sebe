import clientPromise from "../../app/lib/mongodb";
export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("piznay_sebe");
    const collection = db.collection("tests");

    if (req.method === "GET") {
      const tests = await collection.find({}).toArray();
      res.status(200).json(tests);
    } else if (req.method === "POST") {
      const newTest = req.body;
      await collection.insertOne(newTest);
      res.status(201).json({ message: "Тест доданий!" });
    } else {
      res.status(405).json({ message: "Метод не дозволений" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера" });
  }
}
