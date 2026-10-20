// Admin panel settings read from env. No imports, so middleware.ts (edge runtime) can use it.

// The only database the admin panel reads and writes. A constant, never taken from env:
// tests reach prod (piznay_sebe) only through scripts/promote-tests-to-prod.mts.
export const ADMIN_DB = "piznay_sebe_staging";

// Set to "true" only for the staging deployment; anything else hides the admin panel (404).
export const isAdminEnabled = () => process.env.ADMIN_ENABLED === "true";

// Writes are allowed only when the site itself reads the staging database,
// so a saved test is what the public test list on this deployment shows.
export const isAdminDbConfigured = () => process.env.MONGODB_DB === ADMIN_DB;

// GitHub logins from ADMIN_GITHUB_LOGINS (comma-separated, case-insensitive). Empty or unset: nobody.
export const isAllowedLogin = (login: string) => {
  const allowed = (process.env.ADMIN_GITHUB_LOGINS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return login.trim() !== "" && allowed.includes(login.trim().toLowerCase());
};
