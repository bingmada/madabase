export const phaseOneSunsetToolSlugs = new Set([
  "word-counter",
  "character-counter",
  "case-converter",
  "text-cleaner",
  "line-sorter",
  "line-deduplicator",
  "empty-line-remover",
  "whitespace-normalizer",
  "email-extractor",
  "url-extractor",
  "number-extractor",
  "unicode-escape",
  "unicode-unescape",
  "hex-to-text",
  "text-to-hex",
  "binary-to-text",
  "text-to-binary",
  "reading-time",
  "lorem-ipsum",
  "list-randomizer",
]);

export function isPhaseOneSunsetTool(slug: string) {
  return phaseOneSunsetToolSlugs.has(slug);
}
