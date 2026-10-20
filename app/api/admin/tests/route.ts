import { insertTest, listTests } from "../../../lib/adminTests";
import { readTestInput, refuseNonAdmin, serverError } from "../../../lib/adminRequest";

// Admin: list tests in piznay_sebe_staging, create a test. No other methods (Next.js answers 405).

export async function GET() {
  const refused = await refuseNonAdmin();
  if (refused) return refused;
  try {
    return Response.json(await listTests());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: Request) {
  const checked = await readTestInput(req);
  if ("response" in checked) return checked.response;
  try {
    const result = await insertTest(checked.input);
    if (result.status === "duplicate") {
      return Response.json({ message: "A test with this name already exists" }, { status: 409 });
    }
    return Response.json({ _id: result._id }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
