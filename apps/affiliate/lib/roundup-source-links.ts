import type { Product, Roundup } from "./types";

export function roundupSourceLinks(products: Product[], pageSources: Roundup["sources"] = [], preservePageEvidence = false) {
  const combined = [...pageSources, ...products.flatMap((product) => product.sources ?? [])];
  if (!preservePageEvidence) return Array.from(new Map(combined.map((source) => [source.url, source])).values()).slice(0, 8);
  const firstByUrl = new Map<string, (typeof combined)[number]>();
  for (const source of combined) if (!firstByUrl.has(source.url)) firstByUrl.set(source.url, source);
  return Array.from(firstByUrl.values()).slice(0, Math.max(8, new Set(pageSources.map((source) => source.url)).size));
}
