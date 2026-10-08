import type { Product } from "./types";

export function productEvidencePresentation(product: Product) {
  const mode = product.evidenceMode ?? "official-spec";
  const label = mode === "hands-on"
    ? "Hands-on review"
    : mode === "research-synthesis"
      ? "Research synthesis · not hands-on"
      : "Official-spec guide · not hands-on";
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

export function roundupEvidencePresentation(products: Product[]) {
  const hasIndependentTests = products.some((product) => product.evidenceMode === "research-synthesis" && product.externalTests?.length);

  return {
    label: hasIndependentTests
      ? "Research-based comparison · not hands-on"
      : "Official-spec comparison · not hands-on",
    summary: hasIndependentTests
      ? "The shortlist combines current manufacturer documentation, exact-listing checks, and attributed independent tests. Different test setups are not merged into a synthetic score."
      : "The shortlist compares current manufacturer documentation, exact models, fit, compatibility, ownership costs, and checkout risks. It is not a hands-on ranking.",
  };
}
