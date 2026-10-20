import { NextResponse } from "next/server";
import { isAdminEnabled } from "./app/lib/adminEnv";

// Hides the admin panel and its sign-in endpoints wherever ADMIN_ENABLED is not "true" (production).
// The pages and route handlers check the flag, the session and the allowlist again themselves.
export function middleware() {
  if (!isAdminEnabled()) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
