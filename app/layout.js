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
      <body className={`antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
