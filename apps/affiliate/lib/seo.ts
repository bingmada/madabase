import type { Metadata } from "next";
import type { SiteConfig } from "./sites";
import type { Guide, Product, Roundup, Tool } from "./types";

const contentDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function metaDescription(description: string) {
  const clean = description.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;

  const boundary = clean.lastIndexOf(" ", 157);
  const end = boundary >= 120 ? boundary : 157;
  return `${clean.slice(0, end).trim()}...`;
}

function noteList(items: string[] | undefined) {
  const notes = items?.filter(Boolean).slice(0, 5) ?? [];
  if (notes.length === 0) return undefined;

  return {
    "@type": "ItemList",
    itemListElement: notes.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };
}

export function absoluteUrl(site: SiteConfig, path = "/") {
  return new URL(path, site.domain).toString();
}

export function contentDate(value: string | undefined) {
  if (!value) return undefined;
  const parsed = new Date(`${value} 00:00:00 UTC`);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return {
    date: parsed,
    isoDate: contentDateFormatter.format(parsed),
    isoDateTime: parsed.toISOString(),
  };
}

export function pageMetadata(site: SiteConfig, path: string, title: string, description: string, image = site.heroImage): Metadata {
  const url = absoluteUrl(site, path);
  const descriptionText = metaDescription(description);

  return {
    metadataBase: new URL(site.domain),
    // Article and comparison titles already carry their primary query. Keeping
    // them absolute avoids appending a second site-name suffix that pushes
    // model-specific titles beyond a useful search-result length.
    title: { absolute: title },
    description: descriptionText,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: descriptionText,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptionText,
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

export function roundupProductListSchema(site: SiteConfig, name: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: products.map((product, index) => {
      const displayName = product.amazonTitle ?? product.name;
      const displayImage = product.amazonImage ?? product.image;
      const url = absoluteUrl(site, `/reviews/${product.slug}`);

      return {
        "@type": "ListItem",
        position: index + 1,
        name: displayName,
        url,
        item: {
          "@type": "Product",
          "@id": `${url}#product`,
          name: displayName,
          alternateName: product.name !== displayName ? product.name : undefined,
          description: product.summary,
          image: absoluteUrl(site, displayImage),
          url,
          category: product.category,
          brand: {
            "@type": "Brand",
            name: product.brand,
          },
          sku: product.asin ?? product.slug,
          ...(product.asin ? { identifier: product.asin } : {}),
          additionalProperty: Object.entries(product.specs)
            .filter(([, value]) => Boolean(value))
            .slice(0, 8)
            .map(([propertyName, value]) => ({
              "@type": "PropertyValue",
              name: propertyName,
              value,
            })),
        },
      };
    }),
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
  const url = absoluteUrl(site, `/reviews/${product.slug}`);
  const productId = `${url}#product`;
  const updated = contentDate(product.updatedAt);
  const author = {
    "@type": "Organization",
    name: `${site.name} editorial desk`,
    url: absoluteUrl(site, "/about"),
  };
  const publisher = {
    "@type": "Organization",
    name: site.name,
    url: site.domain,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        name: headline,
        headline,
        url,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        description: product.summary,
        image: absoluteUrl(site, displayImage),
        articleSection: product.category,
        ...(updated ? { dateModified: updated.isoDateTime } : {}),
        about: {
          "@id": productId,
        },
        ...(product.sources?.length ? { citation: product.sources.map((source) => source.url) } : {}),
        author,
        publisher,
      },
      {
        "@type": "Product",
        "@id": productId,
        name: displayName,
        alternateName: product.name !== displayName ? product.name : undefined,
        description: product.summary,
        image: absoluteUrl(site, displayImage),
        url,
        category: product.category,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        sku: product.asin ?? product.slug,
        ...(product.asin ? { identifier: product.asin } : {}),
        additionalProperty: Object.entries(product.specs)
          .filter(([, value]) => Boolean(value))
          .slice(0, 12)
          .map(([name, value]) => ({
            "@type": "PropertyValue",
            name,
            value,
          })),
        review: {
          "@type": "Review",
          "@id": `${url}#editorial-review`,
          name: headline,
          headline,
          reviewBody: product.verdict ?? product.summary,
          itemReviewed: {
            "@id": productId,
          },
          positiveNotes: noteList(product.pros),
          negativeNotes: noteList(product.cons),
          ...(updated ? { dateModified: updated.isoDateTime } : {}),
          author,
          publisher,
        },
      },
    ],
  };
}

export function guideSchema(site: SiteConfig, guide: Guide) {
  const url = absoluteUrl(site, `/guides/${guide.slug}`);
  const updated = contentDate(guide.updatedAt);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.dek,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: guide.category,
    ...(updated ? { dateModified: updated.isoDateTime } : {}),
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
