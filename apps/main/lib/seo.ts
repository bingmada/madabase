import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://madabase.com").replace(/\/$/, "");
export const siteName = "Madabase";
export const siteDescription = "Independent buying research for connected homes, better workspaces, family care, pet care, and personal style.";

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  const canonical = `${siteUrl}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      images: [{ url: `${siteUrl}/images/madabase-home-hero.webp`, width: 1536, height: 1024, alt: "A connected home workspace with family and pet gear" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/images/madabase-home-hero.webp`] },
  };
}
