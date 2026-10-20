import type { ReactNode } from "react";
import { forbidden, unauthorized } from "next/navigation";
import { getAdminStatus } from "../../lib/adminSession";
import { isAdminDbConfigured } from "../../lib/adminEnv";
import AdminHeader from "../../components/admin/admin_header/AdminHeader";

// Every admin page except sign-in: 401 without a session, 403 for a login not on the allowlist.
export default async function ProtectedAdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const status = await getAdminStatus();
  if (status === "unauthenticated") unauthorized();
  if (status === "forbidden") forbidden();

  return (
    <>
      <AdminHeader login={status.login} canSave={isAdminDbConfigured()} />
      {children}
    </>
  );
}
