import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Madabase",
    template: "%s | Madabase",
  },
  description: "Madabase offers free online developer tools, SEO-friendly content pages, and a growing library of practical resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
        <Script id="madabase-performance-observer" strategy="afterInteractive">
          {`window.__MADABASE_SITE_URL__=${JSON.stringify(getSiteUrl())};`}
        </Script>
      </body>
    </html>
  );
}
