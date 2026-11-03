import type { Product } from "./types";
import { conciseReaderCopy } from "./reader-copy";

export function productEvidencePresentation(product: Product) {
  const mode = product.evidenceMode ?? "official-spec";
  const note = product.researchNote ?? (
    mode === "hands-on"
      ? "This page includes first-hand use. Test conditions and measurements are stated beside the relevant findings."
      : mode === "research-synthesis"
        ? "This guide compares manufacturer documentation and attributed independent tests; results are not treated as directly comparable when hardware, firmware, clients, or environments differ."
        : "This guide uses current manufacturer documentation and listing checks to identify fit, compatibility, version, and purchase risks."
  );

  return { mode, note: conciseReaderCopy(note) };
}
