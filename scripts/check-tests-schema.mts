// Checks every test in the staging and prod databases against the admin panel's schema (app/lib/testSchema.ts).
// Only reads the databases. Exits with 1 if any document does not match.
//
// Usage:
//   npx --no -- tsx --env-file=.env.local scripts/check-tests-schema.mts
import { MongoClient } from "mongodb";
import { testInputSchema } from "../app/lib/testSchema";

const DATABASES = ["piznay_sebe_staging", "piznay_sebe"];
const COLLECTION = "tests";

if (!process.env.MONGODB_URI) {
  console.error("Please add MONGODB_URI to .env.local");
  process.exit(1);
}

// Reads a field of a caught value for the error line; anything can be thrown.
const errorField = (error: unknown, key: string): unknown =>
  error && typeof error === "object"
    ? (error as Record<string, unknown>)[key]
    : undefined;

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  let failed = 0;

  for (const dbName of DATABASES) {
    const docs = await client.db(dbName).collection(COLLECTION).find({}).toArray();
    console.log(`${dbName}.${COLLECTION}: ${docs.length} documents`);

    for (const { _id, ...doc } of docs) {
      // Some names contain line breaks; one line per document keeps the output readable.
      const label = `${String(doc.name ?? "(untitled)").replace(/\s+/g, " ").trim()} [${_id}]`;
      const result = testInputSchema.safeParse(doc);
      if (result.success) {
        console.log(`  ok ${label}`);
        continue;
      }
      failed++;
      console.log(`  FAIL ${label}`);
      for (const issue of result.error.issues) {
        console.log(`    ${issue.path.map(String).join(".") || "(document)"}: ${issue.code}`);
      }
    }
  }

  console.log(failed === 0 ? "All documents match the schema." : `Documents that do not match: ${failed}`);
  if (failed > 0) process.exitCode = 1;
} catch (error) {
  console.error(
    "Error:",
    errorField(error, "codeName") || errorField(error, "name"),
    "-",
    errorField(error, "message")
  );
  process.exitCode = 1;
} finally {
  await client.close();
}
