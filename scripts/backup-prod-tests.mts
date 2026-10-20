// Backs up the prod tests collection to a JSON file outside the repository. Only reads the database.
// Run it before every promote-tests-to-prod.mts --apply.
//
// The file is canonical Extended JSON (ObjectId and number types are kept), so it can be restored
// with `mongoimport --jsonArray`. An existing file is never overwritten.
//
// Usage:
//   npx --no -- tsx --env-file=.env.local scripts/backup-prod-tests.mts ~/piznay-sebe-backups/tests-$(date +%Y-%m-%d-%H%M).json
import { MongoClient, BSON } from "mongodb";
import { access, mkdir, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_DB = "piznay_sebe";
const COLLECTION = "tests";

const [outputArg, ...extraArgs] = process.argv.slice(2);
if (!outputArg || outputArg.startsWith("--") || extraArgs.length > 0) {
  console.error("Usage: npx --no -- tsx --env-file=.env.local scripts/backup-prod-tests.mts <output file outside the repo>");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("Please add MONGODB_URI to .env.local");
  process.exit(1);
}

// Resolves symlinks in the part of the path that already exists.
const realpathOfExisting = async (target: string): Promise<string> => {
  let existing = target;
  const rest: string[] = [];
  while (true) {
    try {
      return path.join(await realpath(existing), ...rest);
    } catch {
      const parent = path.dirname(existing);
      if (parent === existing) return target;
      rest.unshift(path.basename(existing));
      existing = parent;
    }
  }
};

const isInside = (root: string, target: string) => {
  const relative = path.relative(root, target);
  return (
    relative === "" ||
    (relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
};

const repoRoot = await realpath(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
);
const outputPath = path.resolve(outputArg);
if (
  isInside(repoRoot, outputPath) ||
  isInside(repoRoot, await realpathOfExisting(outputPath))
) {
  console.error(`Refusing to write inside the repository: ${outputPath}`);
  process.exit(1);
}

const exists = await access(outputPath).then(
  () => true,
  () => false
);
if (exists) {
  console.error(`File already exists, choose a new name: ${outputPath}`);
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
  const docs = await client.db(SOURCE_DB).collection(COLLECTION).find({}).toArray();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${BSON.EJSON.stringify(docs, undefined, 2, { relaxed: false })}\n`,
    { flag: "wx" }
  );

  console.log(`Backed up ${docs.length} tests from ${SOURCE_DB}.${COLLECTION} to ${outputPath}`);
  if (docs.length === 0) {
    console.log("Warning: the collection is empty.");
  }
} catch (error) {
  console.error(
    "Error:",
    errorField(error, "codeName") ||
      errorField(error, "code") ||
      errorField(error, "name"),
    "-",
    errorField(error, "message")
  );
  process.exitCode = 1;
} finally {
  await client.close();
}
