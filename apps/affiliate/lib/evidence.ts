import type { Product } from "./types";

export function productEvidencePresentation(product: Product) {
  const mode = product.evidenceMode ?? "official-spec";
  const label = mode === "hands-on"
    ? "Hands-on review"
    : mode === "research-synthesis"
      ? "Independent evidence synthesis"
      : "Official-spec research guide";
  const note = product.researchNote ?? (
    mode === "hands-on"
      ? "This page includes first-hand use. Test conditions and measurements are stated beside the relevant findings."
      : mode === "research-synthesis"
        ? "We have not tested this product ourselves. This guide compares manufacturer documentation and attributed independent tests; results are not treated as directly comparable when hardware, firmware, clients, or environments differ."
        : "We have not tested this product ourselves. This guide uses current manufacturer documentation and listing checks to identify fit, compatibility, version, and purchase risks."
  );

  const summary = mode === "hands-on"
    ? "The decision below is based on direct use, with the setup and measurement limits stated beside each finding."
    : mode === "research-synthesis"
      ? "The decision below combines current manufacturer documentation with attributed independent tests while keeping every result in its original setup."
      : "The decision below uses current manufacturer documentation, official support material, and exact retailer-listing checks.";

  return { label, mode, note, summary };
}
