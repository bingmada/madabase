import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SiteChrome } from "@/components/LayoutParts";
import { StyleChrome } from "@/components/StyleExperience";
import { ClarityAnalytics } from "@/components/ClarityAnalytics";
import { getMarketByRouteSlug } from "@/lib/markets";
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
    ...(site.previewNoIndex
      ? {
          robots: {
            index: false,
            follow: true,
            nocache: true,
            googleBot: { index: false, follow: true, noimageindex: true },
          },
        }
      : {}),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getCurrentSite();
  const headerList = await headers();
  const market = getMarketByRouteSlug(headerList.get("x-madabase-market"));
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "xlte5zsd33";

  return (
    <html lang={market?.languageTag ?? "en-US"}>
      <head>
        {/* @ts-expect-error Impact verification requires its non-standard meta value attribute. */}
        <meta name="impact-site-verification" value="ba96bb1e-788f-4f05-80ec-38b7ceb8d31a" />
        <meta name="msvalidate.01" content="1925B816DE0B8EE2EF64514E52A1D382" />
        <meta name="p:domain_verify" content="b0c3e6f557905e271f2868a46ca16d75" />
      </head>
      {site.key === "style" ? (
        <StyleChrome site={site}>
          <ClarityAnalytics projectId={clarityProjectId} site={site.key} />
          {children}
        </StyleChrome>
      ) : (
        <SiteChrome site={site}>
          <ClarityAnalytics projectId={clarityProjectId} site={site.key} />
          {children}
        </SiteChrome>
      )}
    </html>
  );
}
