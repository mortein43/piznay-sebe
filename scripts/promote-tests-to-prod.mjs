// Promotes tests from the staging database to prod: inserts new ones and updates changed ones (by _id).
// Never deletes anything in prod. Without --apply it only prints the plan.
//
// Usage:
//   node --env-file=.env.local scripts/promote-tests-to-prod.mjs                  # print the plan
//   node --env-file=.env.local scripts/promote-tests-to-prod.mjs --apply          # write to prod
//   node --env-file=.env.local scripts/promote-tests-to-prod.mjs --only="Test name,67d9820a825587c7cc6d534d"
import { MongoClient, BSON } from "mongodb";

const SOURCE_DB = "piznay_sebe_staging";
const TARGET_DB = "piznay_sebe";
const COLLECTION = "tests";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const onlyArg = args.find((arg) => arg.startsWith("--only="));
const only = onlyArg
  ? onlyArg
      .slice("--only=".length)
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  : null;

if (!process.env.MONGODB_URI) {
  console.error("Please add MONGODB_URI to .env.local");
  process.exit(1);
}

// Compares documents regardless of field order.
const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])])
    );
  }
  return value;
};
const fingerprint = (doc) =>
  JSON.stringify(canonical(BSON.EJSON.serialize(doc, { relaxed: false })));

const label = (doc) => `${doc.name ?? "(untitled)"} [${doc._id}]`;

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  const source = client.db(SOURCE_DB).collection(COLLECTION);
  const target = client.db(TARGET_DB).collection(COLLECTION);

  const allStagingDocs = await source.find({}).toArray();
  let stagingDocs = allStagingDocs;
  const prodDocs = await target.find({}).toArray();
  const prodById = new Map(prodDocs.map((doc) => [String(doc._id), doc]));

  if (only) {
    stagingDocs = stagingDocs.filter(
      (doc) => only.includes(String(doc._id)) || only.includes(doc.name)
    );
    const matched = new Set(
      stagingDocs.flatMap((doc) => [String(doc._id), doc.name])
    );
    const missing = only.filter((value) => !matched.has(value));
    if (missing.length > 0) {
      console.error(`Not found in staging: ${missing.join(", ")}`);
      process.exitCode = 1;
    }
  }

  const toInsert = [];
  const toUpdate = [];
  let unchanged = 0;
  for (const doc of stagingDocs) {
    const prodDoc = prodById.get(String(doc._id));
    if (!prodDoc) toInsert.push(doc);
    else if (fingerprint(prodDoc) !== fingerprint(doc)) toUpdate.push(doc);
    else unchanged++;
  }

  const stagingIds = new Set(allStagingDocs.map((doc) => String(doc._id)));
  const prodOnly = prodDocs.filter((doc) => !stagingIds.has(String(doc._id)));

  console.log(`${SOURCE_DB} → ${TARGET_DB}`);
  console.log(`New (will be inserted): ${toInsert.length}`);
  toInsert.forEach((doc) => console.log(`  + ${label(doc)}`));
  console.log(`Changed (will be updated): ${toUpdate.length}`);
  toUpdate.forEach((doc) => console.log(`  ~ ${label(doc)}`));
  console.log(`Unchanged: ${unchanged}`);
  if (prodOnly.length > 0) {
    console.log(`Only in prod (left untouched): ${prodOnly.length}`);
    prodOnly.forEach((doc) => console.log(`  = ${label(doc)}`));
  }

  if (toInsert.length === 0 && toUpdate.length === 0) {
    console.log("Nothing to promote.");
  } else if (!apply) {
    console.log("This is only a plan. Run with --apply to write the changes to prod.");
  } else {
    await target.bulkWrite(
      [...toInsert, ...toUpdate].map((doc) => ({
        replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true },
      }))
    );
    console.log(
      `Done: inserted ${toInsert.length}, updated ${toUpdate.length}.`
    );
  }
} catch (error) {
  console.error("Error:", error.codeName || error.name, "-", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
