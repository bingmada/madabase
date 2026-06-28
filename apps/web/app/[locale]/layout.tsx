import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Madabase",
    template: "%s | Madabase",
  },
  description: "Madabase offers online developer tools, SEO-friendly content pages, and a growing library of practical resources.",
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    title: "Madabase",
    description: "Madabase offers online developer tools, SEO-friendly content pages, and a growing library of practical resources.",
    url: getSiteUrl(),
    siteName: "Madabase",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madabase",
    description: "Madabase offers online developer tools, SEO-friendly content pages, and a growing library of practical resources.",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale === "zh" ? "zh" : "en"} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4491218467179399" />
        <meta name="baidu-site-verification" content="codeva-c4utHf4AR0" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4491218467179399"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Script id="madabase-performance-observer" strategy="afterInteractive">
          {`window.__MADABASE_SITE_URL__=${JSON.stringify(getSiteUrl())};`}
        </Script>
      </body>
    </html>
  );
}
