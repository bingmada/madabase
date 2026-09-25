// Checked against every size/color offer in the retailer's Product data.
const pausedOffers: Record<string, { checkedAt: string; reason: string }> = {
  "floral-embroidery-underwire-set": {
    checkedAt: "2026-09-25",
    reason: "All listed sizes and colors were sold out when checked on September 25, 2026. Purchase link paused until availability is verified again.",
  },
  "floral-sheer-lace-kimono": {
    checkedAt: "2026-09-25",
    reason: "All listed sizes and colors were sold out when checked on September 25, 2026. Purchase link paused until availability is verified again.",
  },
};

export function pausedOffer(productSlug: string) {
  return pausedOffers[productSlug];
}
