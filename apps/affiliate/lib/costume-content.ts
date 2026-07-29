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
    title: "Halloween Costume Wig, Facial Hair, and Makeup Guide",
    dek: "Choose a costume wig by silhouette, cap construction, fiber and heat limits, then coordinate facial hair, adhesives, makeup, wear time, removal, cleaning, and storage.",
    category: "wigs-makeup",
    updatedAt: "July 29, 2026",
    relatedRoundups: [],
    relatedGuides: [
      "mask-and-prosthetic-fit-materials-guide",
      "costume-sizing-measurements-and-returns",
      "costume-prop-care-and-storage-guide",
    ],
    comparisonTable: {
      title: "Costume wig construction and styling checks",
      columns: ["What it changes", "Confirm before buying", "Common mistake"],
      rows: [
        {
          label: "Silhouette",
          values: [
            "The character's outline in photos and at a distance",
            "Length, volume, part, fringe, hairline, and room under hats or masks",
            "Choosing an exact shade while ignoring the wrong shape",
          ],
        },
        {
          label: "Cap and hairline",
          values: [
            "Fit, comfort, ventilation, and how natural the front appears",
            "Head-size guidance, adjusters, cap type, lace dimensions, and application instructions",
            "Assuming every adult wig cap or lace front fits and applies the same way",
          ],
        },
        {
          label: "Fiber and heat",
          values: [
            "Texture, shine, tangling, styling methods, and care",
            "Exact fiber description, stated heat tolerance, and compatible tools or products",
            "Using a hot tool because another synthetic wig tolerated it",
          ],
        },
        {
          label: "Facial hair or adhesive",
          values: [
            "Skin contact, edge security, removal time, and cleanup",
            "Materials, supplied adhesive, compatible remover, patch-test directions, and wear limits",
            "Using an unidentified glue or pulling a piece off without the correct remover",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "Choose the character silhouette before the color",
        body: "Start with the shape visible from across a room: overall length, crown height, side volume, fringe, part, hairline, and facial-hair outline. A gray swept-back wig can support a mad scientist, vampire elder, or haunted ringmaster depending on its silhouette and the clothing around it. Compare the listing dimensions and product photographs with the hat, mask, collar, or prosthetic you plan to wear; a close color match cannot rescue a wig that collapses the character's outline.",
      },
      {
        heading: "Measure the head and identify the cap construction",
        body: "Follow the exact product's head-measurement guidance rather than assuming one adult size is universal. Look for stated circumference, adjustment tabs, cap construction, ventilation, ear-tab position, lace dimensions, and whether a wig cap is included. Long events, warm indoor rooms, glasses, hearing devices, masks, and hats all change comfort. Put the complete combination on during a test run and make sure it can be removed quickly without catching another piece.",
      },
      {
        heading: "Read fiber and heat claims literally",
        body: "Synthetic, heat-friendly synthetic, human hair, and blended fibers require different styling and care. Use heat only when the exact product instructions provide a supported temperature or method; do not copy a temperature from another wig. Test any compatible detangler, spray, powder, or paint on a hidden area first when the instructions allow it. Avoid cutting until cap fit, part placement, and the return terms are settled.",
      },
      {
        heading: "Decide whether the hairline needs to look natural",
        body: "A hat, crown, hood, heavy fringe, or theatrical lighting can hide a simple costume-wig front. A visible forehead, close photography, or repeat performance may justify a more involved lace or styled hairline, but that can add trimming, adhesive, remover, application practice, and skin cleanup. Choose the simplest construction that produces the required view at the real event distance.",
      },
      {
        heading: "Coordinate masks, facial hair, and makeup before event day",
        body: "Map every overlap: wig edge, eyebrows, beard or moustache backing, prosthetic edge, mask strap, hat band, and costume collar. Confirm the identity and instructions for every skin-contact material, adhesive, paint, and remover. Follow manufacturer patch-test and use directions, keep products away from eyes and airways, and do not improvise with household glue. When several edges compete for the same skin area, simplify the look.",
      },
      {
        heading: "Run a full wear test, not a mirror test",
        body: "Wear the wig with the costume, footwear, mask or makeup, and expected base layers. Walk, sit, turn the head, use stairs, look down, take photos with and without flash, and spend enough time in the expected temperature to find pressure or heat problems. Check peripheral view and hearing after adding volume around the ears. If the wig shifts during normal movement, use only the securing method supported by its instructions.",
      },
      {
        heading: "Pack a small compatible touch-up kit",
        body: "Bring only the comb, pins, cap, adhesive, remover, powder, or other products confirmed for the exact wig and skin pieces. Keep a clean bag for removed items and protect the costume from makeup transfer. Schedule a mid-event comfort check and agree on a quick removal plan; staying in character is never more important than vision, breathing, skin comfort, or safe movement.",
      },
      {
        heading: "Remove, clean, dry, and store by material",
        body: "Remove adhesive pieces with the specified remover and method rather than pulling. Follow the exact wig's washing, drying, brushing, and storage instructions; methods vary by fiber and construction. Let reusable pieces dry completely, support the intended shape, protect them from heat and crushing, label the container, and record missing supplies before the next event. Confirm seasonal or intimate-item return restrictions before opening, trimming, styling, or wearing the product.",
      },
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
