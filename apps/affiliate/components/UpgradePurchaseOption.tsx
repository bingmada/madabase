import { AffiliateButton } from "./AffiliateButton";
import { activeUpgradeOffers, upgradeAffiliateOffer } from "@/lib/upgrade-offers";
export function UpgradePurchaseOption({ guide }: { guide: string }) {
  const offer = activeUpgradeOffers().find((item) => item.guide === guide);
  if (!offer) return null;
  return <section className="discovery-card mt-8" aria-labelledby="complete-tiny-option"><p className="eyebrow">For readers considering a complete computer</p><h2 id="complete-tiny-option">Buying a complete unit instead?</h2><p>If you already own this Tiny, use the upgrade checks above first. Compare the full missing-parts bill with a complete system only when replacement is useful.</p><h3>{offer.name}</h3><p>{offer.condition}. Exact ASIN: {offer.asin}. Listing identity checked {new Date(offer.verifiedAt).toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" })}.</p><p>{offer.limits}</p><AffiliateButton site={offer.site} product={{slug:offer.slug,name:offer.name,asin:offer.asin,specs:{ASIN:offer.asin}}} offer={upgradeAffiliateOffer(offer)} position="tiny-guide-complete-system-option" resolveCreatorsListing={false} /></section>;
}
