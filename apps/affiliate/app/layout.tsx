import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/LayoutParts";
import { StyleChrome } from "@/components/StyleExperience";
import { getCurrentSite } from "@/lib/sites";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();

  return {
    metadataBase: new URL(site.domain),
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.description,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getCurrentSite();

  return (
    <html lang="en">
      <head>
        {/* @ts-expect-error Impact verification requires its non-standard meta value attribute. */}
        <meta name="impact-site-verification" value="4c2eb61e-515e-47e0-b623-7a198fb35667" />
      </head>
      {site.key === "style" ? <StyleChrome site={site}>{children}</StyleChrome> : <SiteChrome site={site}>{children}</SiteChrome>}
    </html>
  );
}
