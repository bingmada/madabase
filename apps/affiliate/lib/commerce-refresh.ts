import type { Guide, Product, Roundup } from "./types";

const checkedAt = "October 19, 2026";
const caldigitSource = { name: "CalDigit: TS5 Plus and generation comparison", url: "https://www.caldigit.com/thunderbolt-5-dock-ts5-plus/", note: "Manufacturer specifications; host capabilities still limit actual display and transfer support." };
const linkSource = { name: "Insta360: Link 2 Pro and Link 2C Pro", url: "https://www.insta360.com/product/insta360-link2-pro", note: "Current generation, sensor and tracking differences; manufacturer claims, not our test results." };
const carrierSource = { name: "Ergobaby US: Omni Deluxe", url: "https://ergobaby.com/en-us/products/omni-deluxe-baby-carrier", note: "Checked October 22, 2026: a separate current model, with fabric options, four built-in storage areas, a detachable pouch and strap markers. This does not establish that Breeze is discontinued or that the two manuals are interchangeable." };
const ts4Decision = { heading: "TS4 or a newer Thunderbolt 5 dock?", body: "Keep a working TS4 when its 2.5GbE connection, 98W host charging and display path already meet the job. For a new purchase, CalDigit also offers TS5 and TS5 Plus: compare Thunderbolt 5 host support and the actual port layout before paying more. TS5 Plus adds 10GbE and up to 140W host charging; those features need a compatible computer and network to be useful. A newer dock does not remove a Mac chip's display-count limit. The purchase button here remains the TS4, ASIN B09GK8LBWS, not either TS5 model." };
const linkDecision = { heading: "Link 2 versus Link 2 Pro: choose the camera movement first", body: "This listing is the graphite-black Link 2, CINSABNB / ASIN B0DDTH3HX8, with a two-axis tracking gimbal. Insta360 now also lists Link 2 Pro and Link 2C Pro with a larger 1/1.3-inch sensor; the Pro pans and tilts, while the 2C Pro uses fixed-camera framing. Consider the newer generation if low-light image quality or its documented audio features solve a real problem. For a seated call in good lighting, first check the conferencing app's resolution limits and whether you need tracking at all. The button below buys Link 2; it does not buy a Pro or 2C model." };
const carrierDecision = { heading: "Buying an Omni Breeze now", body: "The linked carrier is the single Omni Breeze in Onyx Black, ASIN B0931ZY7DK. Ergobaby also offers Omni Deluxe, with its own fabric options, four built-in storage areas, a detachable pouch and marked shoulder straps. Compare those features when buying new; do not assume the fit or instructions are the same. A newer option is not a reason to replace a correctly fitting Breeze. Confirm the exact model, condition, seller and return terms, then use that carrier's manual. Selecting a different marketplace colour or bundle can also change the carrier generation." };

export function refreshCommerceProduct(product: Product): Product {
  let section;
  let source;
  let label;
  if (product.site === "homeoffice" && product.slug === "caldigit-ts4-thunderbolt-dock") {
    section = ts4Decision; source = caldigitSource; label = "Check TS4 (B09GK8LBWS) on Amazon";
  } else if (product.site === "homeoffice" && product.slug === "insta360-link-2-webcam") {
    section = linkDecision; source = linkSource; label = "Check Link 2 — graphite black on Amazon";
  } else if (product.site === "baby" && product.slug === "ergobaby-omni-breeze-carrier") {
    section = carrierDecision; source = carrierSource; label = "Check Omni Breeze — Onyx Black on Amazon";
  } else if (product.site === "network" && ["tp-link-deco-be63-wifi-7-mesh", "tp-link-deco-be67-wifi-7-mesh"].includes(product.slug)) {
    const be63 = product.slug.includes("be63");
    const pack = be63 ? "3-pack" : "2-pack";
    return { ...product, updatedAt: checkedAt,
      specs: { ...product.specs, Pack: pack },
      offers: product.offers.map((offer) => ({ ...offer, label: `Check Deco ${be63 ? "BE63" : "BE67"} ${pack} on Amazon`, priceNote: `This link selects the ${pack}, ASIN ${product.asin ?? product.specs.ASIN}. Compare the same number of nodes, condition, seller, delivery and returns; changing a size option changes the purchase.` })),
    };
  } else return product;
  return { ...product, updatedAt: product.slug === "ergobaby-omni-breeze-carrier" ? "October 22, 2026" : checkedAt,
    editorialSections: [section, ...(product.editorialSections ?? [])],
    sources: [...(product.sources ?? []), source],
    offers: product.offers.map((offer) => ({ ...offer, label, priceNote: `Exact ASIN ${product.asin ?? product.specs.ASIN}. Confirm the named generation, selected variant, new or used condition, seller, delivery and returns. Availability can change.` })),
  };
}

const guideAdditions: Record<string, { heading: string; body: string }> = {
  "baby:toddler-learning-towers-buying-guide": { heading: "The linked Original Learning Tower is unavailable", body: "The Amazon US listing for the Natural Original Learning Tower LP01411 / ASIN B001ECHXVC was unavailable when checked on October 19, 2026 for New York 10001. Its purchase buttons are paused. Do not substitute a folding model by name alone: CPSC's Grow 'N Stow recall concerns LP01711 with date codes 202409–202501, a different model. Owners of an affected folding tower should follow the official stop-use and repair instructions. Before considering any replacement, verify its own model and lot code, recall status, platform locking, counter fit and supervision requirements. This guide's safety checks still apply even while no verified purchase option is available." },
  "baby:childproof-door-knob-covers-buying-guide": { heading: "Check the selected cover pack before buying", body: "The linked AILUOQI B0DK1KZ9RQ option selects one round-knob cover, not a multipack or lever lock. Count the doors you actually need to protect, compare the knob's diameter and projection with the maker's fit information, and confirm the selected pack in the cart. Try assembly and adult opening with the door open before relying on it. If an adult cannot open the door quickly, or the cover can be pulled apart, stop using that arrangement. Keep a separate emergency-exit plan; a child-resistant cover is not a substitute for supervision." },
  "network:pass-through-ethernet-crimping-tools-buying-guide": { heading: "What the linked Klein kit does and does not include", body: "The purchase option is the Klein VDV226-110 crimper, ASIN B076MGPQZQ. Check the package contents before ordering plugs or a tester: the tool title does not mean every connector type or test accessory is included. Buy compatible pass-through plugs for your cable's conductor type, gauge and outside diameter, and follow Klein's connector and cutter guidance. For a few patch leads, factory-terminated cables may cost less than a tool, compatible plugs and a suitable tester. A continuity pass alone does not establish Category performance." },
  "homeoffice:home-office-acoustic-panels-buying-guide": { heading: "The selected TONOR set is four large decorative panels", body: "ASIN B0G92CQ7KH selects the TONOR Walnut four-pack with listed panel dimensions of 47.2 × 23.6 inches each. Measure usable wall area, mounting clearance and the complete set before ordering; small foam-tile packs are a different purchase. The listing may feature a Prime offer, so check whether an ordinary purchase offer is available and compare the delivered total without assuming membership. We have not verified model-specific absorption or fire-test evidence for this set. Its decorative slats and felt do not establish sound isolation from neighbours or traffic. Skip it when blocking incoming noise is the main job, or when mounting and material requirements cannot be established." },
};

export function refreshCommerceGuide(guide: Guide): Guide {
  const addition = guideAdditions[`${guide.site}:${guide.slug}`];
  if (!addition) return guide.site === "network" && guide.slug === "deco-be63-vs-be67-vs-be85-buying-guide" ? { ...guide, updatedAt: checkedAt } : guide;
  return { ...guide, updatedAt: checkedAt, sections: [addition, ...guide.sections] };
}

export function refreshCommerceRoundup(roundup: Roundup): Roundup {
  if (roundup.site === "homeoffice" && roundup.slug === "logitech-mx-brio-vs-insta360-link-2") {
    return { ...roundup, updatedAt: checkedAt, sections: [linkDecision, ...(roundup.sections ?? [])], sources: [...(roundup.sources ?? []), linkSource] };
  }
  return roundup;
}

export const decoBuyingChoices = [
  { slug: "tp-link-deco-be63-wifi-7-mesh", label: "BE63 · linked 3-pack", fit: "Four 2.5GbE ports per node; choose when 2.5GbE is enough. Compare equal pack sizes before calling it better value." },
  { slug: "tp-link-deco-be67-wifi-7-mesh", label: "BE67 · linked 2-pack", fit: "One 10GbE, one 2.5GbE and one 1GbE port per node. Choose for a defined 10GbE path, then check whether two nodes fit the layout." },
  { slug: "tp-link-deco-be85-wifi-7-mesh", label: "BE85 · linked 2-pack paused", fit: "The exact B0C4W1L4B3 two-pack was unavailable at the October 19 check. Compare its specifications here; purchase links stay paused until a matching offer is verified." },
];
