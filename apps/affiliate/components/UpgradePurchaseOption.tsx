import { AffiliateButton } from "./AffiliateButton";
import { activeUpgradeOffers, upgradeAffiliateOffer } from "@/lib/upgrade-offers";
export function UpgradePurchaseOption({ guide }: { guide: string }) {
  const offer = activeUpgradeOffers().find((item) => item.guide === guide);
  if (!offer) return null;
  return <section className="discovery-card mt-8" aria-labelledby="complete-tiny-option"><p className="eyebrow">For readers considering a complete computer</p><h2 id="complete-tiny-option">Buying a complete unit instead?</h2><p>If you already own this Tiny, use the upgrade checks above first. Compare the full missing-parts bill with a complete system only when replacement is useful.</p><h3>{offer.name}</h3><p>{offer.condition}. Exact ASIN: {offer.asin}. Listing identity checked October 19, 2026; availability and seller can change.</p><p>{offer.limits}</p><p className="evidence-note">Paid link: as an Amazon Associate we earn from qualifying purchases. We have not tested this unit. Confirm the exact ASIN, seller, included adapter, configuration, delivered total and return terms before ordering.</p><AffiliateButton site={offer.site} product={{slug:offer.slug,name:offer.name,asin:offer.asin,specs:{ASIN:offer.asin}}} offer={upgradeAffiliateOffer(offer)} position="tiny-guide-complete-system-option" resolveCreatorsListing={false} /></section>;
}
