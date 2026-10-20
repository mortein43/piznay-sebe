import { getTest, parseObjectId, replaceTest } from "../../../../lib/adminTests";
import { readTestInput, refuseNonAdmin, serverError } from "../../../../lib/adminRequest";

// Admin: read one test, replace it (keeping its _id). No DELETE: tests are never deleted (Next.js answers 405).

interface RouteContext {
  params: Promise<{ id: string }>;
}

const invalidId = () => Response.json({ message: "Invalid test id" }, { status: 400 });
const notFoundTest = () => Response.json({ message: "Test not found" }, { status: 404 });

export async function GET(_req: Request, { params }: RouteContext) {
  const refused = await refuseNonAdmin();
  if (refused) return refused;
  const id = parseObjectId((await params).id);
  if (!id) return invalidId();
  try {
    const test = await getTest(id);
    return test ? Response.json({ _id: test._id, ...test.doc }) : notFoundTest();
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  const checked = await readTestInput(req);
  if ("response" in checked) return checked.response;
  const id = parseObjectId((await params).id);
  if (!id) return invalidId();
  try {
    const result = await replaceTest(id, checked.input);
    if (result === "not-found") return notFoundTest();
    if (result === "duplicate") {
      return Response.json({ message: "A test with this name already exists" }, { status: 409 });
    }
    return Response.json({ _id: id.toHexString() });
  } catch (error) {
    return serverError(error);
  }
}
