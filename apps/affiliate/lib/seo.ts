import type { Metadata } from "next";
import type { SiteConfig } from "./sites";
import type { Guide, Product, Roundup, Tool } from "./types";

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
    description: site.description,
  };
}

export function websiteSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.domain,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
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

export function itemListSchema(site: SiteConfig, name: string, items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(site, item.path),
    })),
  };
}

export function faqPageSchema(faqs: Roundup["faqs"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function productNotesSchema(site: SiteConfig, product: Product) {
  const displayName = product.amazonTitle ?? product.name;
  const displayImage = product.amazonImage ?? product.image;
  const headline = product.seoTitle ?? `${displayName} Buying Notes`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    name: headline,
    headline,
    url: absoluteUrl(site, `/reviews/${product.slug}`),
    description: product.summary,
    image: absoluteUrl(site, displayImage),
    ...(product.updatedAt ? { dateModified: new Date(product.updatedAt).toISOString() } : {}),
    about: {
      "@type": "Thing",
      name: displayName,
      description: product.summary,
    },
    author: {
      "@type": "Organization",
      name: site.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
  };
}

export function guideSchema(site: SiteConfig, guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.dek,
    url: absoluteUrl(site, `/guides/${guide.slug}`),
    articleSection: guide.category,
    ...(guide.updatedAt ? { dateModified: new Date(guide.updatedAt).toISOString() } : {}),
    author: {
      "@type": "Organization",
      name: `${site.name} editorial desk`,
      url: absoluteUrl(site, "/about"),
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
  };
}

export function toolSchema(site: SiteConfig, tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.dek,
    url: absoluteUrl(site, `/tools/${tool.slug}`),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
  };
}
