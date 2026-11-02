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
  verifiedAt: "2026-11-01T09:56:28.574Z",
  expiresAt: "2026-11-08T09:56:28.574Z",
  condition: "Refurbished - Excellent; current selected seller Circuit-Tech; seller and condition can change",
  listingChecks: "November 1, 2026 US/New York 10001: exact i5-8500T/16GB/256GBNVMe Renewed listing showed an active offer shipped and sold by Circuit-Tech. Expanded holiday return summary: eligible purchases November 1–December 31, 2026 returnable until January 31, 2027; shipping fee may apply and not eligible for free return. No old seller or 90-day promise transferred.",
  limits: "This is a complete Renewed M720q Tiny i5-8500T/16GB/256GBNVMe configuration, not an upgrade kit. Current selected offer was shipped and sold by Circuit-Tech; its expanded holiday return summary said eligible November 1–December 31, 2026 purchases are returnable until January 31, 2027, with return shipping fees possibly applying. AX210, keyboard/mouse and Win11Pro are refurbisher listing claims, not original Lenovo factory specifications. Actual RAM population, storage health, BIOS locks, OS rights, supplied adapter identity and installation parts remain unverified. Compare the full delivered bill and keep a suitable existing computer.",
}];
export function activeUpgradeOffers(now = Date.now()) {
  return upgradeOfferRecords.filter((item) => now >= Date.parse(item.verifiedAt) && now < Date.parse(item.expiresAt));
}
export function upgradeAffiliateOffer(item: typeof upgradeOfferRecords[number]): AffiliateOffer {
  return { merchant: "Amazon US", url: amazonAsinAffiliateUrl(item.site, item.asin), label: "Check this exact refurbished configuration on Amazon", priceNote: "Recheck the configuration, seller, condition, delivery and returns. No live price or stock guarantee." };
}

export type UpgradeComponentOffer = {site:"homeoffice";part:"memory"|"drive"|"sata-kit";slug:string;asin:string;name:string;verifiedAt:string;expiresAt:string;limits:string;models:readonly string[];capacityGb?:number;partNumber?:string;memoryGeneration?:"DDR4"|"DDR5";requiredFrus?:{cable:string;carrier:string}};
export const upgradeComponentOffers: UpgradeComponentOffer[] = [
  {site:"homeoffice" as const,part:"memory",models:["m720q","m920q","m920x"],capacityGb:16,partNumber:"KCP426SD8/16",memoryGeneration:"DDR4",slug:"kingston-kcp426sd8-16-b07d2dz42b",asin:"B07D2DZ42B",name:"Kingston KCP426SD8/16 — one 16GB DDR4-2666 SO-DIMM",verifiedAt:"2026-11-01T09:08:34.133Z",expiresAt:"2026-11-08T09:08:34.133Z",limits:"One KCP426SD8/16 16GB DDR4-2666 SO-DIMM, not a 32GB kit. Kingston’s exact model selector marks this part discontinued; current retailer stock does not mean current manufacture. November 1 selected Buy New offer: LAVI GLOBAL, shipped by Amazon, expanded conditional 30-day return summary read. Confirm quantity, both installed modules, authenticity and warranty eligibility. Compare the delivered cost with an appropriate supported current module; keep working memory when the workload does not require replacement."},
  {site:"homeoffice" as const,part:"drive",models:["m720q","m920q","m920x"],partNumber:"CT1000MX500SSD1",slug:"crucial-mx500-1tb-b078211kbb",asin:"B078211KBB",name:"Crucial MX500 CT1000MX500SSD1 — 1TB 2.5-inch SATA SSD",verifiedAt:"2026-11-01T09:08:38.313Z",expiresAt:"2026-11-08T09:08:38.313Z",limits:"Drive only: CT1000MX500SSD1, one 1TB 2.5-inch 7mm SATA SSD. It does not include a Lenovo carrier/cable or resolve the PCIe-space conflict, and is not exact-drive Lenovo factory qualification. November 1 Buy New offer was shipped and sold by Active Deals; the 30-day return label was observed but expanded exceptions were not read. Micron announced the end of Crucial consumer-channel shipments after February 2026 with continued warranty service/support, subject to eligibility. Compare legacy-stock pricing with suitable current SATA alternatives; keep an adequate existing drive."},
  {site:"homeoffice",part:"sata-kit",models:["m720q","m920q","m920x"],slug:"deal4go-sata-kit-00xl211-01mn886-b0f2dygpdq",asin:"B0F2DYGPDQ",name:"Deal4GO replacement SATA cable + carrier kit — 00XL211 / 01MN886",requiredFrus:{cable:"00XL211",carrier:"01MN886"},verifiedAt:"2026-11-01T09:08:47.651Z",expiresAt:"2026-11-08T09:08:47.651Z",limits:"One aftermarket replacement cable 00XL211 plus carrier 01MN886, not an SSD or independently authenticated genuine Lenovo stock. Current offer: Deal4Go, shipped by Amazon, conditional 30-day return summary read November 1. The seller excludes Tiny6/7/8; do not substitute for 01EF683 or 5M11C16880. Match the exact machine’s Lenovo-supported FRUs and actual supplied parts. Do not buy both pieces if only one is missing. This record does not bypass the planner’s existing component/assembly gates."},
];
export function activeComponentOffers(now=Date.now()) { return upgradeComponentOffers.filter((item) => now >= Date.parse(item.verifiedAt) && now < Date.parse(item.expiresAt)); }
export function matchingComponentOffers(parts: PlanPart[], owned: boolean[], now=Date.now()) {
  return activeComponentOffers(now).filter((offer) => offer.part !== "sata-kit" && parts.some((part,index) => part.id === offer.part && !owned[index] && (part.purchaseCount ?? 0) > 0 && !!part.modelId && offer.models.includes(part.modelId) && (offer.part !== "memory" || (part.capacityGb === offer.capacityGb && part.memoryGeneration === offer.memoryGeneration && !!part.reference?.startsWith(offer.partNumber!)))));
}
export function componentAffiliateOffer(item: typeof upgradeComponentOffers[number]): AffiliateOffer { return {merchant:"Amazon US",url:amazonAsinAffiliateUrl(item.site,item.asin),label:"Check this exact component on Amazon",priceNote:"Recheck exact part number, quantity, seller, delivery and returns."}; }
