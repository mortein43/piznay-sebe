import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.scss";
import { Analytics } from "@vercel/analytics/react";
export const metadata = {
  title: "Пізнай себе",
  description: "Щоб пізнати себе краще",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="6A0SGqXlYwu_gQDr96O790GIZ6-j3DhJR3f5mUFhi7c"
        />
      </head>
      <body className={`antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
