import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Atlas · Factory",
  description:
    "Factory Developer OS — Cockpit home, Code Atlas, Rivet sessions. Port Context Lake entry; no Sandbox from the browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
