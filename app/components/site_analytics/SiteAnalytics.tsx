"use client";
import { Analytics } from "@vercel/analytics/react";
import type { BeforeSendEvent } from "@vercel/analytics/react";

// Vercel Analytics for the public site only: events from admin pages are dropped,
// every other event is sent unchanged. Renders no markup, so it has no styles.
const isAdminUrl = (url: string) => {
  const { pathname } = new URL(url, "http://localhost");
  return pathname === "/admin" || pathname.startsWith("/admin/");
};

const dropAdminEvents = (event: BeforeSendEvent) => (isAdminUrl(event.url) ? null : event);

export default function SiteAnalytics() {
  return <Analytics beforeSend={dropAdminEvents} />;
}
