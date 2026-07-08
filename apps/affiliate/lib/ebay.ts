import type { AffiliateOffer } from "./types";

type EbayItemDetails = {
  observedPrice?: string;
  seller?: string;
  sellerFeedback?: string;
  condition?: string;
};

type EbaySearchOptions = {
  condition?: "new" | "marketplace";
};

const conditionFilters = {
  new: "1000|1500",
  marketplace: "1000|1500|2000|2500|3000",
} as const;

function addTrackingParams(url: URL, customId: string) {
  const params = new URLSearchParams({
    mkcid: "1",
    mkrid: "711-53200-19255-0",
    siteid: "0",
    campid: "5339164427",
    customid: customId,
    toolid: "10001",
    mkevt: "1",
  });
  params.forEach((value, key) => url.searchParams.set(key, value));
  return url;
}

export function ebaySearchOffer(query: string, customId: string, options: EbaySearchOptions = {}): AffiliateOffer {
  const condition = options.condition ?? "marketplace";
  const url = new URL("https://www.ebay.com/sch/i.html");
  url.searchParams.set("_nkw", query);
  url.searchParams.set("LH_BIN", "1");
  url.searchParams.set("LH_ItemCondition", conditionFilters[condition]);
  url.searchParams.set("_sop", "12");
  addTrackingParams(url, customId);

  return {
    merchant: "eBay",
    url: url.toString(),
    label: "Compare live eBay listings",
    priceNote: `Filtered Buy It Now eBay results for ${query}. Confirm live price, stock, shipping, returns, seller rating, condition, and exact model before buying.`,
  };
}

export function ebayItemOffer(itemUrl: string, customId: string, details: EbayItemDetails = {}): AffiliateOffer {
  const url = new URL(itemUrl);
  addTrackingParams(url, customId);

  const detailParts = [
    details.observedPrice ? `observed at ${details.observedPrice} on July 8, 2026` : undefined,
    details.condition,
    details.seller ? `seller ${details.seller}${details.sellerFeedback ? ` (${details.sellerFeedback})` : ""}` : details.sellerFeedback,
  ].filter(Boolean);

  return {
    merchant: "eBay",
    url: url.toString(),
    label: "View exact item on eBay",
    priceNote: `Specific eBay item${detailParts.length ? `, ${detailParts.join(", ")}` : ""}. Confirm live price, shipping, returns, seller rating, condition, and exact model before buying.`,
  };
}
