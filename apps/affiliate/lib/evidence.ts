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

  return { label, mode, note };
}
