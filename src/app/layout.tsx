// src/app/layout.tsx
"use client";

// import type { Metadata } from "next";

import "./globals.css";
import { Prompt, Inter, Kanit } from "next/font/google";

import LayoutWrapper from "../components/LayoutWrapper";

// Google Fonts สำหรับภาษาไทย-อังกฤษ
const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${prompt.variable} ${kanit.variable} ${inter.variable}`}
    >
      <body className={`${prompt.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
