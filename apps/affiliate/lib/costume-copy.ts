export const costumeMerchantPolicyUrl = "https://abracadabranyc.com/pages/helpful-info";
export const costumeMerchantPolicyNote = "Abracadabra NYC lists sales as final: no ordinary returns, refunds or exchanges. Confirm rent or buy, delivery and any rental deposit.";

// Keep complete merchant conditions in the body; only search snippets are capped.
export function cleanCostumeFeedText(value: string | null, limit?: number) {
  if (!value) return null;
  const clean = value
    .replace(/<\/(?:p|div|li|h[1-6])\s*>|<br\s*\/?>/gi, "\n\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (limit === undefined) return clean;
  const snippet = clean.replace(/\s+/g, " ");
  return snippet.length > limit ? `${snippet.slice(0, limit).trimEnd()}…` : snippet;
}
