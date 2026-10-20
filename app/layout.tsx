import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/styles/globals.scss";
import SiteAnalytics from "./components/site_analytics/SiteAnalytics";
export const metadata: Metadata = {
  title: "Пізнай себе – Психологічні тести для самодіагностики",
  description:
    "Пройдіть безкоштовні психологічні тести, дізнайтеся більше про свої емоції, характер і особистість. Пізнайте себе краще!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="6A0SGqXlYwu_gQDr96O790GIZ6-j3DhJR3f5mUFhi7c"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="пізнай себе, психологічні тести, самодіагностика, саморозвиток"
        />
        <meta property="og:title" content="Пізнай себе" />
        <meta
          property="og:description"
          content="Сайт для проходження психологічних тестів для самодіагностики."
        />
        <meta
          property="og:image"
          content="https://piznay-sebe.pp.ua/logo.png"
        />
        <meta property="og:url" content="https://piznay-sebe.pp.ua/" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`antialiased`}>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
