// Keep the evidence record in the source catalog. Reader copy omits repeated
// process notices; model limits and attributed specifications remain intact.
export function conciseReaderCopy(value: string, processNote = false) {
  let copy = value;
  const exactEdits: Record<string, string> = {
    "Manufacturer claims are not a property survey or hands-on verification.": "Check the actual property layout and mounting conditions.",
    "It is not a long-term hands-on reliability test, and firmware, bridged device types, ecosystem features, and retailer bundles can change after publication.": "Firmware, bridged device types and ecosystem features depend on the installed version.",
    "Original text read; no diagram-based measurement or hands-on result.": "Original text read.",
    "no Pro listing or hands-on performance claim is inferred from them.": "Link 2 evidence does not establish Link 2 Pro specifications or an available Pro offer.",
    "this page is not a personal fit assessment or a hands-on test.": "Follow the supplied instructions and assess the individual child and wearer fit.",
    "; no new hands-on measurement or certification claim.": ".",
  };
  for (const [notice, replacement] of Object.entries(exactEdits)) copy = copy.replace(notice, replacement);
  if (processNote) copy = copy
    .replace(/\bNo (?=[^;.!?]{0,250}\b(?:tests?|testing|measurements?)(?: (?:was|were) (?:performed|conducted))?[.;])[^;.!?]*[.;]\s*/gi, "")
    .replace(/\bNo [^;.!?]{0,80}\b(?:was|were) [^;.!?]*\b(?:tested|performed|assembled|assessed)[.;]\s*/gi, "")
    .replace(/;\s*(?:this|it) is not (?:our own )?(?:physical )?product testing[.;]?\s*/gi, ". ")
    .replace(/\bA listing check is not product testing\.\s*/gi, "")
    .replace(/\bSuggested fit and acceptance checks are (?:reader instructions|instructions for the reader), not (?:measured results|measurements performed by this site)\./gi, "Suggested fit and acceptance checks for the reader.")
    .replace(/\bSuggested tasks are checks for the reader to perform; they are not reported as tests we completed\./gi, "Suggested checks for the reader’s setup.")
    .replace(/;\s*unperformed checks are not presented as test results\./gi, ".");
  return copy
    .replace(/\b(?:We|Madabase|This (?:guide|page|article|review|comparison|site)) (?:have not|has not|haven't|did not|do not|does not) (?=[^;.!?]{0,250}\b(?:test(?:ed|ing)?|measur(?:ed|e|ement)|bench-tested|install(?:ed)?))[^;.!?]*?(?=, (?:and|but) (?:a|an|the|this|that)\b|;|[.!?](?:\s|$)|$)[.;]?\s*/gi, "")
    .replace(/\bNo (?:hands-on|first-hand|physical|received-unit|bench|measured|independently measured)[^;.!?]*\b(?:tests?|testing|measurements?|results?|benchmarks?|rankings?)(?: was performed| were performed| was conducted| were conducted| is claimed| are claimed)?[.;]?\s*/gi, "")
    .replace(/;\s*no (?:hands-on|first-hand|physical|received-unit)[^;.!?]*[.;]?\s*/gi, ". ")
    .replace(/,?\s+(?:and )?not (?:a |an )?(?:hands-on|first-hand)[^;.!?]*(?=[.;!?]|$)/gi, "")
    .replace(/;\s*not our own physical test[.;]?\s*/gi, ". ")
    .replace(/\b(?:Stock and returns can change|Prices and availability can change|Prices and availability change quickly)[.;]?\s*/gi, "")
    .replace(/\b(?:Prices, availability, shipping, coupons, and seller details can change|Always confirm the current product listing and return policy before buying)\.\s*/gi, "")
    .replace(/^[,;]\s*/, "")
    .replace(/^and (a|an|the|this|that)\b/i, (_, word: string) => word[0].toUpperCase() + word.slice(1))
    .replace(/([.;])\s+and (a|an|the|this|that)\b/gi, (_, end: string, word: string) => `${end} ${word[0].toUpperCase()}${word.slice(1)}`)
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([.;])\s*[.;]/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/^[,;]\s*|\s*[,;]$/g, "")
    .trim();
}

const copyFields = new Set(["body", "summary", "verdict", "dek", "intro", "quickAnswer", "answer", "note", "researchNote", "purchaseCheck", "detail", "limits", "values"]);
const copyLists = new Set(["editorialMethod", "methodology", "pros", "cons", "evidence"]);
const preservedFields = new Set(["externalTests", "specs", "offers", "decisionPurchase", "governance", "communityEvidence"]);

export function withConciseReaderCopy<T>(value: T): T {
  function visit(item: unknown, field = ""): unknown {
    if (preservedFields.has(field)) return item;
    if (typeof item === "string") return copyFields.has(field) || copyLists.has(field)
      ? conciseReaderCopy(item, ["note", "researchNote", "editorialMethod", "methodology"].includes(field)) : item;
    if (Array.isArray(item)) {
      const children = item.map(child => visit(child, field));
      return copyLists.has(field) ? children.filter(child => child !== "") : children;
    }
    if (!item || typeof item !== "object") return item;
    return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, visit(child, key)]));
  }
  return visit(value) as T;
}

export function conciseOfferNote(value = "") {
  if (/^(?:Exact named selection; compare current condition, seller, delivered total and return eligibility\. No live price or stock guarantee\.|Confirm the exact model and package, current condition, seller, delivered total and return terms; read the model-specific fit check above\.|Check live price and availability on Amazon\.|Confirm ASIN [A-Z0-9]{10}, seller, live price, and availability\.)$/.test(value)) return "";
  return conciseReaderCopy(value).replace(/\s*No live price or stock guarantee\./gi, "").trim();
}
