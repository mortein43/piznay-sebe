import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isAdminEnabled } from "../lib/adminEnv";

// Wraps every admin page, including sign-in: 404 wherever the admin panel is off (production),
// even if middleware.ts did not run.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Адмін-панель – Пізнай себе",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  if (!isAdminEnabled()) notFound();
  return children;
}
