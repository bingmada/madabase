import { findProduct, siteGuides, siteProducts, siteRoundups } from "./content";
import type { SiteConfig } from "./sites";

export type DistributionItem = {
  kind: "best" | "guides" | "reviews";
  slug: string;
  path: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  kicker: string;
  decisionLabel: string;
  decisionDetail: string;
  riskLabel: string;
  riskDetail: string;
};

function roundupItems(site: SiteConfig): DistributionItem[] {
  return siteRoundups(site.key)
    .filter((roundup) => roundup.productSlugs.length >= 2)
    .map((roundup) => {
      const products = roundup.productSlugs
        .map((slug) => findProduct(site.key, slug))
        .filter((product): product is NonNullable<typeof product> => Boolean(product));
      const firstDecision = roundup.decisionGuide?.[0];

      return {
        kind: "best" as const,
        slug: roundup.slug,
        path: `/best/${roundup.slug}`,
        title: roundup.title,
        summary: roundup.dek,
        category: roundup.category,
        image: products[0]?.image ?? site.heroImage,
        kicker: "BUYING COMPARISON",
        decisionLabel: firstDecision?.label ?? "Shortlist",
        decisionDetail: firstDecision?.detail ?? `Compare ${products.length} options by fit, constraints, and total cost.`,
        riskLabel: "Check before buying",
        riskDetail: roundup.methodology[0] ?? "Confirm the exact model, version, and return terms.",
      };
    })
    .reverse();
}

function guideItems(site: SiteConfig): DistributionItem[] {
  return siteGuides(site.key)
    .map((guide) => {
      const product = (guide.relatedProducts ?? [])
        .map((slug) => findProduct(site.key, slug))
        .find(Boolean);

      return {
        kind: "guides" as const,
        slug: guide.slug,
        path: `/guides/${guide.slug}`,
        title: guide.title,
        summary: guide.dek,
        category: guide.category,
        image: product?.image ?? site.heroImage,
        kicker: "BUYING CHECKLIST",
        decisionLabel: guide.sections[0]?.heading ?? "Start here",
        decisionDetail: guide.sections[0]?.body ?? guide.dek,
        riskLabel: guide.sections[1]?.heading ?? "Common mistake",
        riskDetail: guide.sections[1]?.body ?? "Confirm compatibility and real-world fit before choosing.",
      };
    })
    .reverse();
}

function reviewItems(site: SiteConfig): DistributionItem[] {
  return siteProducts(site.key)
    .map((product) => ({
      kind: "reviews" as const,
      slug: product.slug,
      path: `/reviews/${product.slug}`,
      title: product.seoTitle ?? `${product.name} Review and Buying Notes`,
      summary: product.summary,
      category: product.category,
      image: product.image,
      kicker: "MODEL REVIEW",
      decisionLabel: "Best for",
      decisionDetail: product.bestFor,
      riskLabel: "Skip or verify",
      riskDetail: product.cons[0] ?? product.evidence[0] ?? "Confirm the exact model and version before checkout.",
    }))
    .reverse();
}

export function distributionItems(site: SiteConfig, limit = 50) {
  const buckets = [roundupItems(site), guideItems(site), reviewItems(site)];
  const items: DistributionItem[] = [];
  let index = 0;

  while (items.length < limit && buckets.some((bucket) => index < bucket.length)) {
    for (const bucket of buckets) {
      if (bucket[index] && items.length < limit) items.push(bucket[index]);
    }
    index += 1;
  }

  return items;
}

export function findDistributionItem(site: SiteConfig, kind: string, slug: string) {
  return distributionItems(site, Number.MAX_SAFE_INTEGER)
    .find((item) => item.kind === kind && item.slug === slug);
}
