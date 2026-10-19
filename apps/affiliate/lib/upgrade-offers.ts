import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { AffiliateOffer } from "./types";
import type { PlanPart } from "./upgrade-parts";

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

export type UpgradeComponentOffer = {site:"homeoffice";part:"memory"|"drive"|"sata-kit";slug:string;asin:string;name:string;verifiedAt:string;expiresAt:string;limits:string;models:readonly string[];capacityGb?:number;partNumber?:string;memoryGeneration?:"DDR4"|"DDR5";requiredFrus?:{cable:string;carrier:string}};
export const upgradeComponentOffers: UpgradeComponentOffer[] = [
  {site:"homeoffice" as const,part:"memory",models:["m720q","m920q","m920x"],capacityGb:16,partNumber:"KCP426SD8/16",memoryGeneration:"DDR4",slug:"kingston-kcp426sd8-16-b07d2dz42b",asin:"B07D2DZ42B",name:"Kingston KCP426SD8/16 — one 16GB DDR4-2666 SO-DIMM",verifiedAt:"2026-10-19T09:20:00Z",expiresAt:"2026-10-26T09:20:00Z",limits:"One module, not a 32GB kit. The manufacturer lists this discontinued part in its model selector; seller stock is separate from manufacturing status. Confirm both installed modules, quantity, seller and warranty before ordering."},
  {site:"homeoffice" as const,part:"drive",models:["m720q","m920q","m920x"],partNumber:"CT1000MX500SSD1",slug:"crucial-mx500-1tb-b078211kbb",asin:"B078211KBB",name:"Crucial MX500 CT1000MX500SSD1 — 1TB 2.5-inch SATA SSD",verifiedAt:"2026-10-19T09:20:00Z",expiresAt:"2026-10-26T09:20:00Z",limits:"Drive only; this does not include the Lenovo carrier/cable and does not resolve the PCIe space conflict. Retail drive form factor is documented; this is not an exact-drive Lenovo factory qualification."},
  {site:"homeoffice",part:"sata-kit",models:["m720q","m920q","m920x"],slug:"deal4go-sata-kit-00xl211-01mn886-b0f2dygpdq",asin:"B0F2DYGPDQ",name:"Deal4GO replacement SATA cable + carrier kit — 00XL211 / 01MN886",requiredFrus:{cable:"00XL211",carrier:"01MN886"},verifiedAt:"2026-10-19T13:34:18.745314+00:00",expiresAt:"2026-10-26T13:34:18.745314+00:00",limits:"One replacement cable plus one carrier, not an SSD. This is an aftermarket listing, not independently verified genuine Lenovo stock. The seller excludes Tiny6/7/8. Do not substitute this carrier for 01EF683 or 5M11C16880, or buy a whole kit when only one part is missing. Match the exact unit’s Lenovo-supported FRUs and actual seller photos first."},
];
export function activeComponentOffers(now=Date.now()) { return upgradeComponentOffers.filter((item) => now >= Date.parse(item.verifiedAt) && now < Date.parse(item.expiresAt)); }
export function matchingComponentOffers(parts: PlanPart[], owned: boolean[], now=Date.now()) {
  return activeComponentOffers(now).filter((offer) => offer.part !== "sata-kit" && parts.some((part,index) => part.id === offer.part && !owned[index] && (part.purchaseCount ?? 0) > 0 && !!part.modelId && offer.models.includes(part.modelId) && (offer.part !== "memory" || (part.capacityGb === offer.capacityGb && part.memoryGeneration === offer.memoryGeneration && !!part.reference?.startsWith(offer.partNumber!)))));
}
export function componentAffiliateOffer(item: typeof upgradeComponentOffers[number]): AffiliateOffer { return {merchant:"Amazon US",url:amazonAsinAffiliateUrl(item.site,item.asin),label:"Check this exact component on Amazon",priceNote:"Recheck exact part number, quantity, seller, delivery and returns."}; }
