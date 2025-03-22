import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("Будь ласка, додайте MONGODB_URI в .env.local");
}

console.log("Підключення до MongoDB за адресою:", uri);

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    console.log("Створення нового підключення до MongoDB...");
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  console.log("Створення підключення до MongoDB...");
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

export default clientPromise;
