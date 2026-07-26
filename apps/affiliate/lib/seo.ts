import type { Metadata } from "next";
import type { SiteConfig } from "./sites";
import type { Guide, Product, Roundup, Tool } from "./types";

const contentDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function descriptionSuffix(path: string) {
  if (path.startsWith("/reviews/")) return " Compare fit, compatibility, recurring costs, and the exact model checks that matter before buying.";
  if (path.startsWith("/best/")) return " Compare the leading options by fit, trade-offs, and practical buying checks before deciding.";
  if (path.startsWith("/guides/")) return " Use the setup, compatibility, and decision checks to avoid an expensive wrong turn.";
  if (path.startsWith("/tools/")) return " Use the result as a planning starting point, then verify the room, setup, and product limits.";
  if (path.startsWith("/categories/")) return " Explore current comparisons, setup guides, and practical checks for a better shortlist.";
  return " Explore research notes, comparisons, and practical checks before choosing what to buy.";
}

export function metaDescription(description: string, path = "/") {
  const clean = description.replace(/\s+/g, " ").trim();
  const expanded = clean.length >= 120 ? clean : `${clean.replace(/[.?!]+$/, "")}.${descriptionSuffix(path)}`;
  if (expanded.length <= 160) return expanded;

  const boundary = expanded.lastIndexOf(" ", 157);
  const end = boundary >= 120 ? boundary : 157;
  return `${expanded.slice(0, end).trim()}...`;
}

export function productPageTitle(product: Product) {
  if (product.seoTitle) return product.seoTitle;

  const suffix = {
    pet: "Review: Fit, Cleaning & Buying Guide",
    homeoffice: "Review: Fit, Specs & Buying Guide",
    baby: "Review: Age, Fit & Buying Guide",
    network: "Review: Specs, Setup & Buying Guide",
    smarthome: "Review: Compatibility & Buying Guide",
    style: "Review: Size, Materials & Fit",
    costume: "Buying Guide: Fit, Use & Trade-offs",
  }[product.site];

  const detailedTitle = `${product.name} ${suffix}`;
  if (detailedTitle.length <= 72) return detailedTitle;

  const compactTitle = `${product.name} Review & Buying Guide`;
  return compactTitle.length <= 72 ? compactTitle : `${product.name} Review`;
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

function productOffersSchema(product: Product) {
  // Merchant listings require a current numeric price. Affiliate links here
  // intentionally point to live prices, so omit Offer markup until a verified
  // price is stored instead of publishing an invalid merchant listing.
  const offers = product.offers.filter((offer) => offer.url && typeof offer.price === "number" && Number.isFinite(offer.price) && offer.price > 0).slice(0, 3);
  if (offers.length === 0) return undefined;

  return offers.map((offer) => ({
    "@type": "Offer",
    url: offer.url,
    name: offer.label,
    price: offer.price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: offer.merchant,
    },
  }));
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
  const descriptionText = metaDescription(description, path);

  return {
    metadataBase: new URL(site.domain),
    // Article and comparison titles already carry their primary query. Keeping
    // them absolute avoids appending a second site-name suffix that pushes
    // model-specific titles beyond a useful search-result length.
    title: { absolute: title },
    description: descriptionText,
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
          offers: productOffersSchema(product),
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

export function roundupArticleSchema(site: SiteConfig, roundup: Roundup, products: Product[]) {
  const url = absoluteUrl(site, `/best/${roundup.slug}`);
  const updated = contentDate(roundup.updatedAt);
  const citations = [...new Set(products.flatMap((product) => product.sources?.map((source) => source.url) ?? []))];
  const firstImage = products[0]?.amazonImage ?? products[0]?.image;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: roundup.seoTitle ?? roundup.title,
    description: roundup.dek,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: roundup.category,
    ...(firstImage ? { image: absoluteUrl(site, firstImage) } : {}),
    ...(updated ? { dateModified: updated.isoDateTime } : {}),
    ...(citations.length ? { citation: citations } : {}),
    about: products.map((product) => ({
      "@type": "Product",
      name: product.amazonTitle ?? product.name,
      url: absoluteUrl(site, `/reviews/${product.slug}`),
    })),
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

export function productNotesSchema(site: SiteConfig, product: Product) {
  const displayName = product.amazonTitle ?? product.name;
  const displayImage = product.amazonImage ?? product.image;
  const headline = productPageTitle(product);
  const url = absoluteUrl(site, `/reviews/${product.slug}`);
  const productId = `${url}#product`;
  const updated = contentDate(product.updatedAt);
  const citations = [...new Set([
    ...(product.sources?.map((source) => source.url) ?? []),
    ...(product.externalTests?.map((test) => test.url) ?? []),
  ])];
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
  const editorialReview = product.evidenceMode === "hands-on"
    ? {
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
      }
    : undefined;

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
        ...(citations.length ? { citation: citations } : {}),
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
        offers: productOffersSchema(product),
        additionalProperty: Object.entries(product.specs)
          .filter(([, value]) => Boolean(value))
          .slice(0, 12)
          .map(([name, value]) => ({
            "@type": "PropertyValue",
            name,
            value,
          })),
        ...(editorialReview ? { review: editorialReview } : {}),
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
    ...(guide.image ? { image: absoluteUrl(site, guide.image) } : {}),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: guide.category,
    ...(updated ? { dateModified: updated.isoDateTime } : {}),
    ...(guide.sources?.length ? { citation: guide.sources.map((source) => source.url) } : {}),
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
  const updated = contentDate(tool.updatedAt);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.dek,
    url: absoluteUrl(site, `/tools/${tool.slug}`),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    ...(updated ? { dateModified: updated.isoDateTime } : {}),
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
  };
}
