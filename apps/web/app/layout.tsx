import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Madabase",
  description: "An SEO-first platform for free developer tools and future AI products.",
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
