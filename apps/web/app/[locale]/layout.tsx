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
  description: "Madabase offers browser-based developer tools, practical guides, and useful resources for everyday work.",
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    title: "Madabase",
    description: "Madabase offers browser-based developer tools, practical guides, and useful resources for everyday work.",
    url: getSiteUrl(),
    siteName: "Madabase",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madabase",
    description: "Madabase offers browser-based developer tools, practical guides, and useful resources for everyday work.",
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
        {/* @ts-expect-error Impact verification requires its non-standard meta value attribute. */}
        <meta name="impact-site-verification" value="ba96bb1e-788f-4f05-80ec-38b7ceb8d31a" />
        <meta name="msvalidate.01" content="1925B816DE0B8EE2EF64514E52A1D382" />
        <meta name="p:domain_verify" content="b0c3e6f557905e271f2868a46ca16d75" />
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
