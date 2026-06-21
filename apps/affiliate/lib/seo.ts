import type { Metadata } from "next";
import type { SiteConfig } from "./sites";

export function absoluteUrl(site: SiteConfig, path = "/") {
  return new URL(path, site.domain).toString();
}

export function pageMetadata(site: SiteConfig, path: string, title: string, description: string, image = site.heroImage): Metadata {
  const url = absoluteUrl(site, path);

  return {
    metadataBase: new URL(site.domain),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function organizationSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.domain,
  };
}

export function breadcrumbSchema(site: SiteConfig, items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(site, item.path),
    })),
  };
}
