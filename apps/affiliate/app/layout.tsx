import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/LayoutParts";
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
      <SiteChrome site={site}>{children}</SiteChrome>
    </html>
  );
}
