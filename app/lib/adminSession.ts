import { auth } from "./auth";
import { isAllowedLogin } from "./adminEnv";

export type AdminStatus = "unauthenticated" | "forbidden" | { login: string };

// Checked on every admin request against the current allowlist,
// so removing a login from ADMIN_GITHUB_LOGINS takes effect at once.
export const getAdminStatus = async (): Promise<AdminStatus> => {
  const session = await auth();
  const login = session?.user?.login;
  if (typeof login !== "string" || login === "") return "unauthenticated";
  return isAllowedLogin(login) ? { login } : "forbidden";
};
