import type { Guide, Product } from "./types";

/** Only the guide's declared exact model may supply this table-adjacent link. */
export function guideDecisionPurchaseOption(guide: Guide, products: Product[]) {
  const decision = guide.decisionPurchase;
  if (!decision || guide.purchaseFlow === "task-links" || !/^[A-Z0-9]{10}$/.test(decision.asin)) return;
  const matches = products.filter((product) =>
    product.site === guide.site
    && product.publicationStatus !== "draft"
    && guide.relatedProducts?.includes(product.slug)
    && (product.asin ?? product.specs.ASIN) === decision.asin,
  );
  if (matches.length !== 1) return;
  const product = matches[0];
  const offer = product.offers.find((candidate) => {
    try {
      const url = new URL(candidate.url);
      return candidate.merchant === "Amazon US"
        && url.protocol === "https:"
        && ["amazon.com", "www.amazon.com"].includes(url.hostname)
        && !url.username && !url.password && !url.port
        && url.pathname === `/dp/${decision.asin}`;
    } catch { return false; }
  });
  if (offer) return { product, offer };
}
