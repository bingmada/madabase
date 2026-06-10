import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { defaultLocale, locales } from "./i18n";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://madabase.com";
}

export function buildLocaleCanonical(locale: string, path: string) {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildAbsoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function buildHreflangAlternates(path: string, canonicalLocale: Locale = defaultLocale) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const languages = Object.fromEntries(locales.map((locale) => [locale, buildAbsoluteUrl(`/${locale}${normalizedPath}`)])) as Record<Locale, string>;

  return {
    canonical: buildAbsoluteUrl(`/${canonicalLocale}${normalizedPath}`),
    languages: {
      ...languages,
      "x-default": buildAbsoluteUrl(`/${canonicalLocale}${normalizedPath}`),
    },
  };
}

function buildOpenGraphImage(title: string) {
  return {
    url: buildAbsoluteUrl(`/og?title=${encodeURIComponent(title)}`),
    width: 1200,
    height: 630,
    alt: title,
  };
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path,
  keywords = [],
  type = "website",
}: {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = buildAbsoluteUrl(`/${locale}${normalizedPath}`);
  const alternates = buildHreflangAlternates(normalizedPath, locale);
  const image = buildOpenGraphImage(title);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Madabase",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function buildToolMetadata({
  title,
  description,
  keywords,
  locale,
  path,
}: {
  title: string;
  description: string;
  keywords: string[];
  locale: Locale;
  path: string;
}) {
  return buildPageMetadata({
    title,
    description,
    locale,
    path,
    keywords,
    type: "website",
  });
}
