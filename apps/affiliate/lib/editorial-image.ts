import contextInventory from "../config/editorial-context-images.json";

const contextImages = new Set(contextInventory.contextImages);
const displayReplacements: Record<string, string> = contextInventory.displayReplacements;
const decisionDiagrams = new Set([
  "/images/affiliate/baby-baby-brezza-sterilizer-dryer-advanced.webp",
  "/images/affiliate/baby-ergobaby-omni-breeze-carrier.webp",
  "/images/affiliate/baby-momcozy-kleanpal-pro-baby-bottle-washer.webp",
]);

/** Replace retired draft worksheet artwork with the existing unbranded scene. */
export function editorialImageForDisplay(src: string): string {
  return displayReplacements[src.split(/[?#]/, 1)[0]] ?? src;
}

/** Context artwork and stock scenes must not identify the named retail model. */
export function editorialImageAlt(src: string, suppliedAlt: string): string {
  const path = src.split(/[?#]/, 1)[0];
  const documentedDiagram = (path.endsWith(".svg") || decisionDiagrams.has(path)) && suppliedAlt.startsWith("Editorial ");
  if (isEditorialCategoryImage(src) && !documentedDiagram) {
    return "Editorial context image; not a photograph of the named product";
  }
  return suppliedAlt;
}

export function isEditorialCategoryImage(src: string): boolean {
  const path = src.split(/[?#]/, 1)[0];
  return contextImages.has(path) || path.endsWith("-realistic.webp") || decisionDiagrams.has(path);
}

export const editorialCategoryImageCaption =
  "Editorial image for general context, not a photograph of this model. Confirm the exact appearance and configuration on the retailer page.";
