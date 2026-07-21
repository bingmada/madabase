import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { Footer, Header } from "@/components/SiteChrome";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} | Independent buying research`, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  category: "consumer research",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* @ts-expect-error Impact verification requires its non-standard value attribute. */}
        <meta name="impact-site-verification" value="ba96bb1e-788f-4f05-80ec-38b7ceb8d31a" />
        <meta name="msvalidate.01" content="1925B816DE0B8EE2EF64514E52A1D382" />
        <meta name="p:domain_verify" content="b0c3e6f557905e271f2868a46ca16d75" />
      </head>
      <body>
        <Analytics projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "xlte5zsd33"} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
