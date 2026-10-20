// The GitHub login that app/lib/auth.ts puts on the session user.
import "next-auth";

declare module "next-auth" {
  interface User {
    login?: string;
  }
}
