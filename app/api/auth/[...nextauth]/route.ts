import type { NextRequest } from "next/server";
import { handlers } from "../../../lib/auth";
import { isAdminEnabled } from "../../../lib/adminEnv";

// Auth.js endpoints, used only by the admin panel; 404 wherever the admin panel is off (production).
const notFound = () => Response.json({ message: "Not found" }, { status: 404 });

export function GET(req: NextRequest) {
  return isAdminEnabled() ? handlers.GET(req) : notFound();
}

export function POST(req: NextRequest) {
  return isAdminEnabled() ? handlers.POST(req) : notFound();
}
