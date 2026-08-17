import type { Product } from "./types";

export function productEvidencePresentation(product: Product) {
  const mode = product.evidenceMode ?? "official-spec";
  const label = mode === "hands-on"
    ? "Hands-on review"
    : "Buying assessment";
  const note = product.researchNote ?? (
    mode === "hands-on"
      ? "This page includes first-hand use. Test conditions and measurements are stated beside the relevant findings."
      : mode === "research-synthesis"
        ? "We have not tested this product ourselves. This guide compares manufacturer documentation and attributed independent tests; results are not treated as directly comparable when hardware, firmware, clients, or environments differ."
        : "We have not tested this product ourselves. This guide uses current manufacturer documentation and listing checks to identify fit, compatibility, version, and purchase risks."
  );

  const summary = mode === "hands-on"
    ? "The decision below is based on direct use, with the setup and measurement limits stated beside each finding."
    : "Use the decision points below to compare fit, compatibility, ownership trade-offs, and the exact current listing.";

  return { label, mode, note, summary };
}
