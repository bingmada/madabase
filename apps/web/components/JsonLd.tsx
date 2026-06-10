import Script from "next/script";

export type BreadcrumbItem = {
  name: string;
  item: string;
};

export function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return <Script id={id} type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildSoftwareApplicationSchema({
  name,
  description,
  url,
  category,
  locale,
}: {
  name: string;
  description: string;
  url: string;
  category: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    inLanguage: locale,
  };
}

export function buildArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  locale,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: locale,
    author: {
      "@type": "Organization",
      name: "Madabase",
    },
    publisher: {
      "@type": "Organization",
      name: "Madabase",
    },
  };
}
