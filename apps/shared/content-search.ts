export type SearchEntry = {
  site: string;
  kind: "guide" | "product" | "comparison" | "tool" | "topic";
  title: string;
  summary: string;
  href: string;
  category: string;
  aliases?: string[];
  modelIds?: string[];
  searchText?: string;
  familySlug?: string;
};

export function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/(\d)\s*[×x]\s*(\d)/g, "$1 $2")
    .replace(/(\d)\s+(gb|tb|mhz|hz|w|mm|kg|gbps|gbe)\b/g, "$1$2")
    .replace(/\busb[\s-]*c\b/g, "usbc").replace(/\bdisplay[\s-]*link\b/g, "displaylink")
    .replace(/\bwi[\s-]*fi\b/g, "wifi").replace(/(\d)[.,]([\d])/g, "$1p$2")
    .replace(/([a-z0-9])\+/g, "$1 plus")
    .replace(/\b(?:gen|generation)\s*(\d+)\b/g, "gen$1")
    .replace(/\bmemory\b/g, "ram").replace(/\bmonitors?\b/g, "display").replace(/\bdisplays\b/g, "display")
    .replace(/\b(?:two|dual)\b/g, "2")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

const stopWords = new Set(["a", "an", "the", "for", "with", "on", "of", "and", "to", "is", "can", "my", "how", "do", "does", "will", "i", "from", "have", "has", "need", "want", "add", "use", "it", "at"]);
// Capacity, resolution and rate describe a question; they are not exact device identities.
const measurement = (term: string) => /^\d+(?:p\d+)?(?:gb|tb|mhz|hz|w|mm|kg|gbps|gbe|k)$/.test(term) || /^\d+[kp]\d*$/.test(term) || /^\d+$/.test(term);
export function searchContent(entries: SearchEntry[], query: string, filters: { site?: string; kind?: string; category?: string } = {}) {
  const normalized = normalizeSearch(query.slice(0, 120));
  const terms = normalized.split(" ").filter((word) => word && !stopWords.has(word));
  // A short hyphenated name such as NT-USB must stay adjacent. Otherwise NT
  // can match an unrelated NT-25GA adapter merely because it also uses USB.
  // Do not capture just the alphabetic prefix of a longer model such as
  // GP-AEOHUBV4US: that partial token would reject the exact complete model.
  const compoundNames = (query.match(/\b[a-z]{1,3}-[a-z]{3,}\+?(?![a-z0-9])/gi) ?? []).map(normalizeSearch).filter((name) => name.includes(" "));
  return entries.filter((entry) => (!filters.site || entry.site === filters.site) && (!filters.kind || entry.kind === filters.kind) && (!filters.category || entry.category === filters.category))
    .map((entry) => {
      if (!terms.length) return { entry, score: query.trim() ? 0 : 1 };
      const title = normalizeSearch(entry.title);
      const aliases = normalizeSearch((entry.aliases ?? []).join(" "));
      const body = normalizeSearch(`${entry.summary} ${entry.category} ${entry.searchText ?? ""}`);
      const titleWords = title.split(" "), aliasWords = aliases.split(" "), bodyWords = body.split(" ");
      let score = 0;
      let matches = 0;
      const coreTerms = terms.filter((term) => !measurement(term));
      for (const term of terms) {
        let matched = false;
        if (titleWords.includes(term)) { score += /\d/.test(term) ? 35 : 10; matched = true; }
        else if (aliasWords.includes(term)) { score += 18; matched = true; }
        else if (term.length > 2 && (title.includes(term) || aliases.includes(term))) { score += 5; matched = true; }
        else if (bodyWords.includes(term) || (term.length > 2 && body.includes(term))) { score += 2; matched = true; }
        if (matched && (!coreTerms.length || !measurement(term))) matches++;
      }
      // Never answer an exact-model request with another model that merely shares a generic word.
      const modelTerms = coreTerms.filter((term) => /[a-z].*\d|\d.*[a-z]/.test(term));
      const corpus = `${title} ${aliases} ${body}`;
      const ownedModelMismatch = entry.modelIds && modelTerms.some((term) => /^m\d{2,3}[qx]$/.test(term) && !entry.modelIds!.some((id) => normalizeSearch(id).split(" ").includes(term)));
      if (ownedModelMismatch || modelTerms.some((term) => !corpus.includes(term)) || compoundNames.some((name) => !` ${corpus} `.includes(` ${name} `))) score = 0;
      else if (matches < Math.ceil((coreTerms.length || terms.length) * 0.6)) score = 0;
      else if (title.includes(normalized) || aliases.includes(normalized)) score += 60;
      else if (` ${body} `.includes(` ${normalized} `)) score += 20;
      return { entry, score };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map(({ entry }) => entry);
}
