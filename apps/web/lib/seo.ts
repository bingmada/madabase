export function buildToolMetadata({
  title,
  description,
  keywords,
  canonical,
}: {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}) {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
  };
}

export function buildLocaleCanonical(locale: string, path: string) {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://madabase.com";
}
