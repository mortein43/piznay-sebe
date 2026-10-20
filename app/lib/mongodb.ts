import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

// In development the client is kept on the global object so HMR reloads reuse one connection.
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Handlers await clientPromise and handle its errors. This stops an unhandled
// rejection when a request (for example a 405) never awaits it.
clientPromise.catch(() => {});

export default clientPromise;
