import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { Product } from "./types";

export const merchant21Alternatives: Array<{ family: string; product: Product; keep: string }> = [
  {
    family: "smart-light-strips",
    product: {
      site: "smarthome", slug: "tapo-l930-5-rgbw-light-strip-alternative", asin: "B0B2KY8X4M",
      name: "Tapo L930-5 — 16.4 ft RGBIC + White LEDs", brand: "Tapo", category: "lighting",
      updatedAt: "October 31, 2026", publicationStatus: "draft", sitemapExcluded: true,
      discoveryExcluded: true, evidenceMode: "official-spec", image: "", rating: 0, scores: [], priceBand: "$$",
      summary: "A separately identified 5 m Wi-Fi strip with white LEDs and zonal colors, rather than the AXMOTUT 3 m warm-white COB strip.",
      verdict: "Compare it when the 16.4 ft format, intended appearance and 2.4 GHz network suit the room. Plan a dry indoor power/controller location, use the supplied power system and match the received hardware instructions before mounting or cutting. The maker says cut-off pieces cannot be reused.",
      bestFor: "Indoor white and colored accent lighting with a suitable Wi-Fi and power route",
      pros: ["Manufacturer identifies separate white LEDs and color-zone control"],
      cons: ["Not a continuous warm-white COB strip, an exact 2700K appearance match or a guaranteed brightness improvement. Coated LEDs do not make the power adapter or controller waterproof."],
      specs: { ASIN: "B0B2KY8X4M", Selection: "L930-5; 16.4 ft; RGBIC + White LEDs", "Return check": "Free 30-day refund/replacement observed; recheck current eligibility." },
      evidence: ["Selected New Amazon.com offer and expanded free-return terms observed for US 10001 on October 31, 2026; no installation or lighting measurement."],
      sources: [
        { name: "TP-Link L930-5 product specifications", url: "https://www.tp-link.com/us/home-networking/smart-bulb/tapo-l930-5/", note: "Manufacturer 5 m, 2.4 GHz and supplied-power specifications; white LEDs and HomeKit support. No native Matter or AXMOTUT component compatibility inferred." },
        { name: "Tapo L930-5 current product and cut-length limit", url: "https://www.tapo.com/us/product/tapo-l930-5-light-strip/", note: "Current model page separates hardware versions and says excess cut pieces cannot be used. No full operating manual or physical lighting test claimed." },
        { name: "Selected L930-5 Amazon offer", url: "https://www.amazon.com/dp/B0B2KY8X4M", note: "16.4 ft RGBIC + White LEDs selected; New Amazon.com offer and expanded returns observed October 31, 2026. Used stock is a separate offer." },
      ],
      offers: [{ merchant: "Amazon US", url: amazonAsinAffiliateUrl("smarthome", "B0B2KY8X4M"), label: "Check Tapo L930-5 on Amazon", priceNote: "Confirm L930-5, 16.4 ft, supplied power/controls, selected New condition, seller, delivery and returns. Not the AXMOTUT strip or an interchangeable power supply." }],
    },
    keep: "Keep lighting that already meets the room's needs. For a specific warm-white COB appearance, compare that requirement separately before choosing this longer multicolor strip.",
  },
  {
    family: "smart-irrigation-controllers",
    product: {
      site: "smarthome", slug: "orbit-62061-single-outlet-dial-timer-alternative", asin: "B004INGS8S",
      name: "Orbit 62061 — one-outlet dial timer", brand: "Orbit", category: "climate",
      updatedAt: "October 31, 2026", publicationStatus: "draft", sitemapExcluded: true,
      discoveryExcluded: true, evidenceMode: "official-spec", image: "", rating: 0, scores: [], priceBand: "$",
      summary: "A basic local watering timer when one hose outlet and a fixed schedule meet the job without an app or gateway.",
      verdict: "Choose this simpler route only if a single outlet is enough. The attached Orbit instructions specify cold-water outdoor irrigation, 25–100 psi, two AA alkaline batteries, an intact filter washer and protection from freezing. Match the received instructions, faucet connection and required backflow protection; verify shutoff and inspect for leaks while present.",
      bestFor: "One hose outlet on a local schedule without remote control",
      pros: ["Local dial scheduling, manual watering and a user-set rain delay"],
      cons: ["Not the Soildrops two-zone gateway system. No remote alerts, automatic weather-based adjustment or water-saving guarantee. Debris, freezing or a damaged washer can prevent proper closure."],
      specs: { ASIN: "B004INGS8S", Selection: "One timer; one outlet; Green; 62061 listing", "Return check": "Free 30-day refund/replacement observed; recheck current eligibility." },
      evidence: ["Exact one-outlet New Amazon.com offer and expanded free returns observed for US 10001 on October 31, 2026", "Complete English sheet and diagrams in the attached Orbit guide visually read; received revision and actual plumbing are not certified."],
      sources: [
        { name: "Orbit one-outlet original guide attached to this listing", url: "https://m.media-amazon.com/images/I/81CmBrnOeML.pdf", note: "English physical page 1, including every diagram, read. Dial scheduling, cold-water use, filter/closure, batteries, pressure and freezing limits. The generic sheet does not certify a received individual unit." },
        { name: "Selected Orbit 62061 one-outlet Amazon offer", url: "https://www.amazon.com/dp/B004INGS8S", note: "One timer, one outlet, New Amazon.com offer and expanded returns observed October 31, 2026. Two-packs, B-hyve app models and used offers are separate selections." },
      ],
      offers: [{ merchant: "Amazon US", url: amazonAsinAffiliateUrl("smarthome", "B004INGS8S"), label: "Check Orbit 62061 single-outlet timer on Amazon", priceNote: "One local dial timer, not a two-zone Wi-Fi kit. Confirm supplied model, pressure/site fit, New condition, seller, delivery and returns." }],
    },
    keep: "Keep an adequate timer or supervised hand watering. If two independent outlets or remote control are essential, this single local timer does not meet that requirement.",
  },
];

export function merchant21FamilyForGuide(slug: string) {
  return ["buying-guide", "vs-alternatives", "compatibility-and-fit-guide"].map(role => slug.endsWith(`-${role}`) ? slug.slice(0, -role.length - 1) : null).find(Boolean);
}
