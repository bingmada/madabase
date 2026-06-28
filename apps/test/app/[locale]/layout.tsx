import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Madabase Tests",
    template: "%s | Madabase Tests",
  },
  description: "Interactive personality, career, relationship, and self-discovery tests from Madabase.",
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    title: "Madabase Tests",
    description: "Interactive personality, career, relationship, and self-discovery tests from Madabase.",
    url: getSiteUrl(),
    siteName: "Madabase Tests",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madabase Tests",
    description: "Interactive personality, career, relationship, and self-discovery tests from Madabase.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Madabase Tests",
              url: getSiteUrl(),
            }).replace(/</g, "\\u003c"),
          }}
        />
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
