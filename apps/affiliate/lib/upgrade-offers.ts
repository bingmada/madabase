import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { AffiliateOffer } from "./types";

// Exact, manually verified complete systems. Components and merchant choice are separate decisions.
export const upgradeOfferRecords = [{
  site: "homeoffice" as const,
  model: "m720q",
  guide: "thinkcentre-m720q-upgrade-compatibility-guide",
  slug: "thinkcentre-m720q-tiny-b0b14ftvtv",
  asin: "B0B14FTVTV",
  name: "ThinkCentre M720q Tiny — i5-8500T, 16GB DDR4, 256GB NVMe (Renewed)",
  verifiedAt: "2026-10-19T08:25:00Z",
  expiresAt: "2026-10-26T08:25:00Z",
  condition: "Renewed / refurbished; the selected seller and condition can change",
  listingChecks: "The untagged exact-ASIN page showed In Stock in a temporary US 10001 delivery preview. The offer selected during verification was Refurbished - Excellent, Quickship Technologies LLC, with a 90-day refund/replacement statement. Recheck all terms for your destination.",
  limits: "The listing describes AX210 Wi-Fi and a wireless keyboard/mouse bundle. These are refurbisher listing claims, not factory PSREF specifications. RAM slot population, SATA carrier/cable, PCIe riser and original Lenovo adapter identity were not established. This is a complete-system option, not an upgrade kit or a tested configuration.",
}];
export function activeUpgradeOffers(now = Date.now()) {
  return upgradeOfferRecords.filter((item) => now >= Date.parse(item.verifiedAt) && now < Date.parse(item.expiresAt));
}
export function upgradeAffiliateOffer(item: typeof upgradeOfferRecords[number]): AffiliateOffer {
  return { merchant: "Amazon US", url: amazonAsinAffiliateUrl(item.site, item.asin), label: "Check this exact refurbished configuration on Amazon", priceNote: "Recheck the configuration, seller, condition, delivery and returns. No live price or stock guarantee." };
}
