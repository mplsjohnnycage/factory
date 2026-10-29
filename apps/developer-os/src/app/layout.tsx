import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Local OFL fonts — avoids flaky next/font/google network fetch in CI. */
const syne = localFont({
  src: [
    { path: "../fonts/Syne-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Syne-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Syne-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-syne",
  display: "swap",
});

const sourceSans = localFont({
  src: [
    { path: "../fonts/SourceSans3-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/SourceSans3-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/SourceSans3-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Factory — Developer OS",
  description:
    "Meta control shell for Factory: Code Atlas hero, Port sign-in, Rivet-native sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${sourceSans.variable}`}>{children}</body>
    </html>
  );
}
