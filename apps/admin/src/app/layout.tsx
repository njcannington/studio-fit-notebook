import type { Metadata } from "next";
import { fontVariableClassNames } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Fit Notebook — Admin",
  description: "Admin tools for the Studio Fit Notebook trainer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontVariableClassNames} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
