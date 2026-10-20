import { getAdminStatus } from "./adminSession";
import { isAdminDbConfigured, isAdminEnabled } from "./adminEnv";
import { issuePaths, testInputSchema } from "./testSchema";
import type { TestInput } from "./testSchema";

// Checks shared by the admin route handlers. Each returns a Response to send back when the request is refused.

const MAX_BODY_BYTES = 1024 * 1024;

const message = (status: number, text: string) => Response.json({ message: text }, { status });

export const notFound = () => message(404, "Not found");

export const serverError = (error: unknown) => {
  console.error(String(error));
  return message(500, "Internal server error");
};

// The flag first (404 in production), then the session and the allowlist.
export const refuseNonAdmin = async (): Promise<Response | null> => {
  if (!isAdminEnabled()) return notFound();
  const status = await getAdminStatus();
  if (status === "unauthenticated") return message(401, "Sign in required");
  if (status === "forbidden") return message(403, "Access denied");
  return null;
};

// Writes come only from the admin pages of this site: the Origin header must name this host.
const isSameOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

// Runs every check for a write and returns the validated test, or the response that refuses it.
// Only the parsed data is ever written: unknown keys are rejected by the schema.
export const readTestInput = async (
  req: Request
): Promise<{ input: TestInput } | { response: Response }> => {
  const refused = await refuseNonAdmin();
  if (refused) return { response: refused };

  if (!isSameOrigin(req)) return { response: message(403, "Cross-origin request refused") };

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return { response: message(415, "Content-Type must be application/json") };
  }

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return { response: message(413, "Request body is too large") };
  const body = await req.text();
  if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
    return { response: message(413, "Request body is too large") };
  }

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    return { response: message(400, "Request body is not valid JSON") };
  }

  const result = testInputSchema.safeParse(data);
  if (!result.success) {
    // Paths only: the editor shows its own Ukrainian messages for these fields.
    return {
      response: Response.json(
        { message: "Invalid test document", issues: issuePaths(result.error).map((path) => ({ path })) },
        { status: 400 }
      ),
    };
  }

  if (!isAdminDbConfigured()) {
    return {
      response: message(503, "Admin writes are allowed only when MONGODB_DB is piznay_sebe_staging"),
    };
  }

  return { input: result.data };
};
