export type SearchEntry = {
  site: string;
  kind: "guide" | "product" | "comparison" | "tool" | "topic";
  title: string;
  summary: string;
  href: string;
  category: string;
  aliases?: string[];
};

export function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/usb[\s-]*c/g, "usbc").replace(/display[\s-]*link/g, "displaylink")
    .replace(/wi[\s-]*fi/g, "wifi").replace(/(\d)[.,]([\d])/g, "$1p$2")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

const stopWords = new Set(["a", "an", "the", "for", "with", "on", "of", "and", "to", "is", "can", "my", "how", "do", "does", "will", "i"]);
export function searchContent(entries: SearchEntry[], query: string, filters: { site?: string; kind?: string; category?: string } = {}) {
  const normalized = normalizeSearch(query.slice(0, 120));
  const terms = normalized.split(" ").filter((word) => word && !stopWords.has(word));
  return entries.filter((entry) => (!filters.site || entry.site === filters.site) && (!filters.kind || entry.kind === filters.kind) && (!filters.category || entry.category === filters.category))
    .map((entry) => {
      if (!terms.length) return { entry, score: normalized ? 0 : 1 };
      const title = normalizeSearch(entry.title);
      const aliases = normalizeSearch((entry.aliases ?? []).join(" "));
      const body = normalizeSearch(`${entry.summary} ${entry.category}`);
      let score = 0;
      let matches = 0;
      for (const term of terms) {
        if (title.split(" ").includes(term)) { score += /\d/.test(term) ? 35 : 10; matches++; }
        else if (aliases.split(" ").includes(term)) { score += 18; matches++; }
        else if (title.includes(term) || aliases.includes(term)) { score += 5; matches++; }
        else if (body.includes(term)) { score += 2; matches++; }
      }
      // Never answer an exact-model request with another model that merely shares a generic word.
      const modelTerms = terms.filter((term) => /[a-z].*\d|\d.*[a-z]/.test(term));
      const corpus = `${title} ${aliases} ${body}`;
      if (modelTerms.some((term) => !corpus.includes(term))) score = 0;
      else if (matches < Math.ceil(terms.length * 0.6)) score = 0;
      else if (title.includes(normalized) || aliases.includes(normalized)) score += 60;
      return { entry, score };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map(({ entry }) => entry);
}
