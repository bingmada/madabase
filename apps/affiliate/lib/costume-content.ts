import type { Guide } from "./types";

export type CostumeProductCandidate = {
  slug: string;
  name: string;
  category: "costumes" | "props-animatronics" | "masks-prosthetics" | "wigs-makeup" | "accessories-party-effects";
  typeLabel: string;
  observedPrice?: string;
  premium?: boolean;
  professional?: boolean;
  summary: string;
  buyerJob: string;
  checks: string[];
  sourceIdentity: string;
};

// This is a bounded editorial launch manifest, not the production catalog.
// Prices and identities remain visibly provisional until the CJ feed confirms
// the exact product/variant, inventory, destination, image rights, PID and AID.
export const costumeProductCandidates: CostumeProductCandidate[] = [
  {
    slug: "game-of-thrones-jon-snow-premium-adult-costume",
    name: "Game of Thrones Jon Snow Premium Adult Costume",
    category: "costumes",
    typeLabel: "Premium licensed costume",
    observedPrice: "$1,100",
    premium: true,
    professional: true,
    summary: "A flagship high-ticket costume candidate for buyers comparing a display-level licensed look with ordinary one-night costumes.",
    buyerJob: "Decide whether the construction, included pieces, sizing path, and repeat-use value justify a four-figure costume.",
    checks: ["Exact licensed product and included pieces", "Garment measurements and alteration room", "Weight, care, and storage", "Return and delivery terms"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact variant pending CJ feed verification.",
  },
  {
    slug: "red-and-black-dominion-jacket",
    name: "Red and Black Dominion Jacket",
    category: "costumes",
    typeLabel: "Professional costume jacket",
    observedPrice: "$650",
    professional: true,
    summary: "A professional-looking statement jacket candidate where material, construction, sizing, and reuse matter more than a character label.",
    buyerJob: "Compare a substantial costume jacket with cheaper uniform-style pieces for stage, event, or repeat wear.",
    checks: ["Fabric and lining", "Chest, shoulder, sleeve, and length measurements", "Closures and trim durability", "Care and alteration options"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact variant pending CJ feed verification.",
  },
  {
    slug: "armadillo-professional-prop",
    name: "Armadillo Prop",
    category: "props-animatronics",
    typeLabel: "Professional prop",
    observedPrice: "$410.95",
    professional: true,
    summary: "A specialty prop candidate that makes dimensions, material, stability, finish, and shipping risk central to the decision.",
    buyerJob: "Verify whether a large specialty prop fits the intended set, display, storage, and transport path.",
    checks: ["Exact dimensions and weight", "Material and finish", "Indoor or outdoor limitations", "Oversize shipping and storage"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact SKU pending CJ feed verification.",
  },
  {
    slug: "irish-colleen-adult-costume",
    name: "Irish Colleen Adult Costume",
    category: "costumes",
    typeLabel: "Premium adult costume",
    observedPrice: "$400",
    premium: true,
    summary: "A premium occasion costume candidate for comparing full-outfit construction, included components, and sizing instead of choosing from photography alone.",
    buyerJob: "Confirm what the outfit includes and whether the size chart supports the wearer's measurements and event needs.",
    checks: ["Included garments and accessories", "Garment versus body measurements", "Fabric, closures, and care", "Return limits for seasonal merchandise"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact variant pending CJ feed verification.",
  },
  {
    slug: "transformer-one-optimus-prime-child-costume",
    name: "Transformer One Classic Optimus Prime Child Costume",
    category: "costumes",
    typeLabel: "Licensed kids costume",
    observedPrice: "$52.95",
    summary: "A mainstream licensed costume candidate where size range, visibility, mobility, included parts, and delivery timing drive the choice.",
    buyerJob: "Choose the correct child size and confirm the costume can be worn and seen through comfortably for the planned event.",
    checks: ["Current licensed model", "Child size chart and garment measurements", "Mask visibility and mobility", "Included pieces and footwear exclusions"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact variant pending CJ feed verification.",
  },
  {
    slug: "handmade-spooky-art-frames",
    name: "Handmade Spooky Art Frames",
    category: "accessories-party-effects",
    typeLabel: "Seasonal decor",
    observedPrice: "$32.95",
    summary: "A lower-price decor candidate useful for testing whether shoppers want atmosphere pieces alongside costumes and props.",
    buyerJob: "Check the exact frame count, dimensions, hanging method, and finish before using the set in a room or event display.",
    checks: ["Quantity and exact dimensions", "Frame and artwork materials", "Hanging or tabletop method", "Handmade variation and return terms"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact SKU pending CJ feed verification.",
  },
  {
    slug: "foam-medieval-woodcutters-axe",
    name: "Hero's Edge Foam Medieval Woodcutter's Axe",
    category: "props-animatronics",
    typeLabel: "Foam costume prop",
    observedPrice: "$51.95",
    summary: "A carryable foam prop candidate where venue rules, length, material, balance, and transport matter more than visual detail alone.",
    buyerJob: "Decide whether the prop is safe and practical for the intended convention, stage, party, or photo use.",
    checks: ["Total length and weight", "Foam density and core construction", "Venue or convention prop policy", "Packing and transport"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact SKU pending CJ feed verification.",
  },
  {
    slug: "fish-foam-latex-prosthetic",
    name: "Fish Foam Latex Prosthetic",
    category: "masks-prosthetics",
    typeLabel: "Foam latex prosthetic",
    observedPrice: "$69.95",
    professional: true,
    summary: "A prosthetic candidate that requires clear material, adhesive, removal, paint, skin-sensitivity, and single-use or reuse expectations.",
    buyerJob: "Confirm that the wearer has the compatible materials, application skill, removal plan, and time for a prosthetic makeup workflow.",
    checks: ["Latex and adhesive sensitivity", "Adhesive, paint, and remover requirements", "Fit and edge-blending area", "Single-use or reuse guidance"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact SKU pending CJ feed verification.",
  },
  {
    slug: "mythical-centaur-inflatable-costume",
    name: "Mythical Centaur Inflatable Costume",
    category: "costumes",
    typeLabel: "Inflatable adult costume",
    observedPrice: "$95",
    summary: "An inflatable candidate where fan power, battery access, wearer height, movement, noise, and emergency exit matter as much as the visual effect.",
    buyerJob: "Check whether the costume can stay inflated and move safely through the intended indoor or outdoor venue.",
    checks: ["Supported wearer height", "Fan and battery requirements", "Doorway, seating, and stair clearance", "Visibility and quick removal"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact variant pending CJ feed verification.",
  },
  {
    slug: "top-gun-fighter-pilot-flight-suit",
    name: "Top Gun Men's Fighter Pilot Flight Suit",
    category: "costumes",
    typeLabel: "Licensed adult costume",
    observedPrice: "$137.95",
    summary: "A licensed flight-suit candidate where exact branding, patches, included accessories, inseam, torso length, and layering determine fit.",
    buyerJob: "Choose the exact licensed version and size without assuming a normal clothing size maps cleanly to a one-piece suit.",
    checks: ["Exact licensed version and patches", "Chest, waist, inseam, and torso length", "Included glasses or accessories", "Layering and footwear plan"],
    sourceIdentity: "Abracadabra product identity observed before feed activation; exact variant pending CJ feed verification.",
  },
];

export const costumeGuides: Guide[] = [
  {
    site: "costume",
    slug: "costume-sizing-measurements-and-returns",
    title: "Costume Sizing, Measurements, and Return-Risk Guide",
    dek: "How to use body and garment measurements, leave movement room, and check seasonal return limits before ordering.",
    category: "costumes",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Measure the body, then read the product chart", body: "Chest, waist, hip, inseam, height, and torso length can matter in different costumes. Do not convert from everyday clothing size unless the exact product chart tells you to." },
      { heading: "Plan for movement and layers", body: "Sitting, stairs, dancing, outerwear, and underlayers change the fit. A close visual silhouette may still need practical room at the shoulders, seat, and knees." },
      { heading: "Treat returns as part of the fit decision", body: "Seasonal, intimate, opened, altered, makeup, wig, and special-order items can have different return rules. Confirm the exact product's current terms before checkout." },
    ],
  },
  {
    site: "costume",
    slug: "professional-costume-vs-standard-costume",
    title: "Professional Costume vs. Standard Costume",
    dek: "What a higher price can buy in construction, materials, finish, repairability, and repeat use—and what it does not guarantee.",
    category: "costumes",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Start with number of uses", body: "A one-night party and a stage run place different demands on seams, closures, trim, cleaning, movement, and repair. Cost per wear is more useful than price alone." },
      { heading: "Ask where the money went", body: "Useful upgrades include lined construction, stronger closures, more accurate materials, replaceable parts, and sizing support. A license or elaborate photograph alone is not proof of durability." },
      { heading: "Keep alteration and storage in the budget", body: "Premium garments may still need tailoring, specialized cleaning, structured storage, or repair. Include those costs before treating the purchase as an investment." },
    ],
  },
  {
    site: "costume",
    slug: "large-prop-animatronic-space-and-power-checklist",
    title: "Large Prop and Animatronic Space, Power, and Safety Checklist",
    dek: "Measure the route, display area, power path, weather exposure, sound, storage, and supervision needs before buying a large effect.",
    category: "props-animatronics",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Measure every part of the route", body: "Box dimensions, doors, lifts, stairs, turns, ceilings, and final footprint can all block an otherwise suitable prop. Record the narrowest point before ordering." },
      { heading: "Separate power from placement", body: "Confirm voltage, adapter, cord length, extension-cord limits, battery needs, and whether the effect needs continuous power. Keep cables away from guest paths." },
      { heading: "Confirm environment and supervision", body: "Indoor-only materials, moving parts, sound, tipping risk, rain, wind, heat, pets, and children change the safe setup. Follow the exact product manual and local venue rules." },
    ],
  },
  {
    site: "costume",
    slug: "mask-and-prosthetic-fit-materials-guide",
    title: "Mask and Prosthetic Fit, Materials, and Removal Guide",
    dek: "Compare visibility, breathing, materials, adhesives, makeup, removal, and wear time before building the look around a mask or prosthetic.",
    category: "masks-prosthetics",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Visibility and breathing are fit features", body: "Check eye opening, peripheral view, ventilation, hearing, glasses compatibility, head measurement, and how quickly the piece can be removed." },
      { heading: "Identify every material that touches skin", body: "Latex, silicone, foam, adhesives, paints, removers, and cleaning products have different requirements. Follow manufacturer instructions and do not use a material when its identity is unclear." },
      { heading: "Budget time for application and removal", body: "A convincing prosthetic can require edge work, color matching, curing, removal, and skin cleanup. A simpler mask may be the better choice when setup time is limited." },
    ],
  },
  {
    site: "costume",
    slug: "wig-facial-hair-and-makeup-planning-guide",
    title: "Wig, Facial Hair, and Costume Makeup Planning Guide",
    dek: "Coordinate color, cap fit, adhesives, heat limits, wear time, touch-ups, removal, and storage as one system.",
    category: "wigs-makeup",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Choose the silhouette before the shade", body: "Length, volume, hairline, part, facial-hair shape, and head fit determine the look before small color differences do." },
      { heading: "Check heat and product compatibility", body: "Synthetic fibers, lace, adhesives, paint, powder, and styling tools can have strict limits. Use only methods supported by the exact product instructions." },
      { heading: "Plan touch-ups and removal", body: "Carry only compatible touch-up products, protect clothing, allow removal time, and store wigs and reusable pieces in a way that preserves shape and hygiene." },
    ],
  },
  {
    site: "costume",
    slug: "costume-rental-vs-buying-guide",
    title: "Costume Rental vs. Buying: A Practical Decision Guide",
    dek: "Compare one-event cost, deposits, alteration limits, cleaning, shipping, repeat use, and damage risk before choosing rental or purchase.",
    category: "costumes",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Count the full event cost", body: "Rental price, deposit, pickup or shipping, cleaning, late fees, accessories, and alteration restrictions belong in the same comparison as purchase price." },
      { heading: "Buy when reuse and customization are real", body: "Buying becomes more attractive when the piece will be worn repeatedly, altered, repaired, photographed, performed in, or combined with several future looks." },
      { heading: "Rental availability must be verified locally", body: "Feed and storefront listings may not represent local rental inventory or pickup terms. Treat rental as available only when the exact item, dates, size, and return process are confirmed." },
    ],
  },
  {
    site: "costume",
    slug: "when-to-order-a-halloween-costume",
    title: "When to Order a Halloween Costume",
    dek: "Work backward from October 31 for delivery, fitting, exchanges, alterations, prop testing, makeup practice, and stock risk.",
    category: "accessories-party-effects",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Order around the number of unknowns", body: "A simple accessory needs less lead time than an uncertain size, licensed set, large prop, special order, rental, or professional garment. Add time for every unresolved dependency." },
      { heading: "Protect the fitting and test window", body: "Leave enough time to walk, sit, see, breathe, power the effect, practice makeup, and exchange an incorrect variant before the final week." },
      { heading: "Late October is an availability problem", body: "Near Halloween, prioritize confirmed stock, realistic delivery, and a complete wearable plan over a more ambitious product that may arrive late or need unplanned parts." },
    ],
  },
  {
    site: "costume",
    slug: "costume-prop-care-and-storage-guide",
    title: "Costume and Prop Care and Storage Guide",
    dek: "Plan cleaning, drying, shape support, repairs, batteries, labels, and storage space so reusable pieces survive the next event.",
    category: "props-animatronics",
    updatedAt: "July 22, 2026",
    relatedRoundups: [],
    sections: [
      { heading: "Follow the exact material instructions", body: "Foam, latex, silicone, synthetic hair, fabric, paint, electronics, metal, and adhesives require different cleaning and storage. Do not assume one method works across the costume." },
      { heading: "Dry completely and support the shape", body: "Moisture, folding, pressure, heat, and sunlight can damage finishes and structure. Use breathable storage and forms or padding where the product instructions allow." },
      { heading: "Create a next-use inventory", body: "Label boxes, remove batteries when appropriate, record missing parts, keep repair materials separate, and note what must be replaced before the next event." },
    ],
  },
];

export function findCostumeProduct(slug: string) {
  return costumeProductCandidates.find((product) => product.slug === slug);
}

export function costumeProductsForCategory(category: CostumeProductCandidate["category"]) {
  return costumeProductCandidates.filter((product) => product.category === category);
}

export function premiumCostumeProducts() {
  return costumeProductCandidates.filter((product) => product.premium || product.professional);
}
