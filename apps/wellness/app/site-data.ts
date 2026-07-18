import {
  BadgeCheck,
  Droplets,
  EyeOff,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const site = {
  name: "Madabase Wellness",
  domain: "https://wellness.madabase.com",
  description:
    "Evidence-led intimacy product guides focused on materials, hygiene, privacy, and beginner-friendly buying decisions.",
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  minutes: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  checklist: string[];
};

export const guides: Guide[] = [
  {
    slug: "/guides/body-safe-materials",
    title: "Body-Safe Materials Guide",
    eyebrow: "Materials",
    description:
      "How to read product pages for silicone, ABS, glass, stainless steel, and porous material risks before buying.",
    icon: ShieldCheck,
    minutes: "6 min",
    sections: [
      {
        title: "Start With Non-Porous Materials",
        body:
          "Medical-grade silicone, borosilicate glass, stainless steel, and hard ABS are easier to clean and less likely to retain residue when cared for correctly.",
      },
      {
        title: "Treat Vague Claims As A Risk",
        body:
          "Phrases like body safe without a named material are not enough. A good listing should state the surface material, whether it is phthalate-free, and any coating used.",
      },
      {
        title: "Match Lubricant To Material",
        body:
          "Water-based lubricant is the lowest-friction default for silicone devices. Silicone-based lubricant can damage some silicone surfaces unless the manufacturer says otherwise.",
      },
    ],
    checklist: [
      "Named surface material",
      "Non-porous or clearly disposable",
      "Compatible lubricant guidance",
      "No unexplained coating",
    ],
  },
  {
    slug: "/guides/cleaning-and-storage",
    title: "Cleaning And Storage Guide",
    eyebrow: "Care",
    description:
      "A practical routine for cleaning, drying, charging, and storing personal wellness products without damaging them.",
    icon: Droplets,
    minutes: "5 min",
    sections: [
      {
        title: "Clean Before And After Use",
        body:
          "Follow the device manual first. Mild unscented soap and warm water are suitable for many waterproof products, while splash-resistant products need more careful wipe-downs.",
      },
      {
        title: "Dry Before Storage",
        body:
          "Moisture inside pouches and drawers encourages odor and residue. Air-dry fully before placing the product in a lint-free pouch or separate container.",
      },
      {
        title: "Protect Charging Contacts",
        body:
          "Magnetic contacts and ports last longer when they are dry and free of cleanser residue. Store charging cables separately so they do not scratch softer surfaces.",
      },
    ],
    checklist: [
      "Waterproof rating checked",
      "Unscented cleaner selected",
      "Fully dry before storage",
      "Separate lint-free pouch",
    ],
  },
  {
    slug: "/guides/discreet-shipping",
    title: "Discreet Shipping Checklist",
    eyebrow: "Privacy",
    description:
      "What to verify before checkout when plain packaging, billing labels, return policies, and delivery timing matter.",
    icon: EyeOff,
    minutes: "4 min",
    sections: [
      {
        title: "Check Packaging And Billing",
        body:
          "Look for a retailer page that states the outside shipping label and billing descriptor. If the wording is vague, assume the order may not be private enough.",
      },
      {
        title: "Know The Return Window",
        body:
          "Intimacy products often have stricter return rules than general retail goods. Confirm whether unopened items, defective items, and satisfaction guarantees are handled differently.",
      },
      {
        title: "Separate Privacy From Speed",
        body:
          "Fast shipping is not the same as discreet shipping. A good checkout path should make both delivery timing and privacy expectations visible.",
      },
    ],
    checklist: [
      "Plain outer package stated",
      "Billing descriptor stated",
      "Return policy reviewed",
      "Delivery timing confirmed",
    ],
  },
  {
    slug: "/guides/beginner-friendly-products",
    title: "Beginner-Friendly Product Criteria",
    eyebrow: "Buying",
    description:
      "A calmer way to choose first intimacy products by size, controls, noise, cleaning needs, and support policy.",
    icon: Sparkles,
    minutes: "7 min",
    sections: [
      {
        title: "Choose Simple Controls",
        body:
          "A clear power button, a small number of modes, and visible charging status reduce friction more than a long feature list.",
      },
      {
        title: "Prefer Lower Maintenance",
        body:
          "Water-resistant or waterproof surfaces, smooth edges, and included storage make a first purchase easier to live with.",
      },
      {
        title: "Keep The Skip Reasons Visible",
        body:
          "Every recommendation should explain who should avoid it: size concerns, app dependence, strong vibration, noise, price, or cleaning complexity.",
      },
    ],
    checklist: [
      "Simple controls",
      "Manageable size",
      "Low cleaning burden",
      "Clear skip reason",
    ],
  },
];

export const principles = [
  {
    title: "Health-Led Tone",
    body: "We keep language clinical, calm, and useful. No explicit imagery, no sensational claims, and no content for minors.",
    icon: HeartHandshake,
  },
  {
    title: "Evidence Mode",
    body: "Pages distinguish official specifications from editorial synthesis. We do not imply hands-on testing unless it actually happened.",
    icon: BadgeCheck,
  },
  {
    title: "Privacy First",
    body: "Retailer coverage prioritizes discreet shipping, billing descriptors, return terms, and data-sensitive checkout expectations.",
    icon: EyeOff,
  },
];

export type ProductPick = {
  name: string;
  merchant: "LELO" | "Lovehoney" | "We-Vibe" | "Bellesa" | "Multi-merchant";
  category: string;
  categorySlug: string;
  officialPath: string;
  status: string;
  bestFor: string;
  skipIf: string;
  editorialNote: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
  art: string;
};

export type WellnessCategory = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  decision: string;
  productNames: string[];
};

export const productPicks: ProductPick[] = [
  {
    name: "SILA Cruise",
    merchant: "LELO",
    category: "Beginner sonic massager",
    categorySlug: "sonic-massagers",
    officialPath: "/sila-cruise",
    status: "Link pending",
    bestFor:
      "A gentler first premium pick with a wide contact area, 8 modes, and straightforward controls.",
    skipIf:
      "You want the most compact travel shape or do not want a sonic-style product.",
    editorialNote:
      "Chosen as the first beginner-oriented LELO candidate because the official page emphasizes gentle sonic waves, body-safe silicone, waterproofing, and ISO 3533 safety assurance.",
    specs: [
      { label: "Materials", value: "Body-safe silicone, ABS plastic" },
      { label: "Size", value: "80 x 75 x 35 mm" },
      { label: "Use time", value: "Up to 2 h" },
      { label: "Charge", value: "2 h" },
    ],
    art: "sila",
  },
  {
    name: "SONA 2 Cruise",
    merchant: "LELO",
    category: "Compact sonic massager",
    categorySlug: "sonic-massagers",
    officialPath: "/sona-2-cruise",
    status: "Link pending",
    bestFor:
      "Readers comparing compact premium sonic options with more modes and a smaller footprint.",
    skipIf:
      "You are noise-sensitive, because the official max noise level is listed at 60 dB.",
    editorialNote:
      "Useful for a comparison page because LELO publishes dimensions, battery, 12 modes, automatic shutoff, and max noise level.",
    specs: [
      { label: "Materials", value: "Body-safe silicone, ABS plastic" },
      { label: "Size", value: "112 x 55 x 51 mm" },
      { label: "Modes", value: "12" },
      { label: "Noise", value: "60 dB max" },
    ],
    art: "sona",
  },
  {
    name: "LELO DOT",
    merchant: "LELO",
    category: "Pinpoint external vibrator",
    categorySlug: "external-vibrators",
    officialPath: "/lelo-dot",
    status: "Link pending",
    bestFor:
      "A narrow-tip, precise option where control interface and manageable weight matter.",
    skipIf:
      "You prefer broad contact instead of a focused tip or want the simplest possible shape.",
    editorialNote:
      "A good editorial pick for explaining why precise products are not automatically beginner products; fit depends on sensitivity and control preference.",
    specs: [
      { label: "Materials", value: "Body-safe silicone, ABS plastic" },
      { label: "Size", value: "60 x 46 x 165 mm" },
      { label: "Weight", value: "98 g" },
      { label: "Noise", value: "60 dB max" },
    ],
    art: "dot",
  },
  {
    name: "TOR 3",
    merchant: "LELO",
    category: "Couples ring",
    categorySlug: "couples",
    officialPath: "/tor-3",
    status: "Link pending",
    bestFor:
      "Couples comparing flexible ring-style products with app connectivity and waterproofing.",
    skipIf:
      "You do not want an app-connected device or need a non-ring product category.",
    editorialNote:
      "Included because it opens a couples-focused cluster while still letting the page stay practical: diameter, controls, waterproofing, battery, and fit are the buying variables.",
    specs: [
      { label: "Materials", value: "Body-safe silicone, ABS plastic" },
      { label: "Diameter", value: "29 mm" },
      { label: "Use time", value: "Up to 2 h" },
      { label: "Interface", value: "2 buttons" },
    ],
    art: "tor",
  },
  {
    name: "ENIGMA Wave",
    merchant: "LELO",
    category: "Advanced dual-stimulation device",
    categorySlug: "luxury",
    officialPath: "/enigma-wave",
    status: "Link pending",
    bestFor:
      "Experienced buyers comparing premium, higher-complexity devices with longer spec sheets.",
    skipIf:
      "You want a simple first product, lower price band, or lower-maintenance shape.",
    editorialNote:
      "Best held as an advanced pick, not a beginner default, because the product is larger, more complex, and more expensive than simpler options.",
    specs: [
      { label: "Materials", value: "Body-safe silicone, ABS plastic" },
      { label: "Size", value: "106 x 50 x 182 mm" },
      { label: "Weight", value: "201 g" },
      { label: "Use time", value: "Up to 2 h" },
    ],
    art: "enigma",
  },
  {
    name: "SORAYA 2",
    merchant: "LELO",
    category: "Luxury rabbit vibrator",
    categorySlug: "luxury",
    officialPath: "/soraya-2",
    status: "Link pending",
    bestFor:
      "Readers comparing premium dual-stimulation shapes with a classic rabbit-style layout.",
    skipIf:
      "You want a compact first product or prefer external-only products.",
    editorialNote:
      "Useful as a luxury benchmark because it gives the site a recognizable premium category without making beginner claims.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Advanced" },
      { label: "Care", value: "Check waterproof rating" },
      { label: "Link", value: "Disabled" },
    ],
    art: "enigma",
  },
  {
    name: "INA Wave 2",
    merchant: "LELO",
    category: "Wave-motion rabbit vibrator",
    categorySlug: "luxury",
    officialPath: "/ina-wave-2",
    status: "Link pending",
    bestFor:
      "Experienced buyers comparing movement-based dual-stimulation options.",
    skipIf:
      "You need the simplest controls or a smaller product for travel.",
    editorialNote:
      "Included to support a future wave-motion comparison, where movement style and cleaning complexity should be discussed separately.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Experienced" },
      { label: "Decision", value: "Motion style" },
      { label: "Link", value: "Disabled" },
    ],
    art: "enigma",
  },
  {
    name: "GIGI 3",
    merchant: "LELO",
    category: "G-spot vibrator",
    categorySlug: "internal-vibrators",
    officialPath: "/gigi-3",
    status: "Link pending",
    bestFor:
      "A focused internal-vibrator comparison where shape, firmness, and handle angle matter.",
    skipIf:
      "You are only looking for external products or broad-contact massagers.",
    editorialNote:
      "A clean fit for an internal-vibrator category page because the purchase decision is about shape and control, not hype.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Internal" },
      { label: "Decision", value: "Shape and angle" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "MIA 3",
    merchant: "LELO",
    category: "Travel bullet vibrator",
    categorySlug: "external-vibrators",
    officialPath: "/mia-3",
    status: "Link pending",
    bestFor:
      "Travel-focused readers who care about compact storage and simple charging.",
    skipIf:
      "You want broad contact, app control, or a couples format.",
    editorialNote:
      "Good for a discreet travel cluster because size, charging, and storage are the real buying criteria.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Travel" },
      { label: "Decision", value: "Compactness" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "LYLA 2",
    merchant: "LELO",
    category: "Remote bullet vibrator",
    categorySlug: "external-vibrators",
    officialPath: "/lyla-2",
    status: "Link pending",
    bestFor:
      "Readers comparing remote-control options without needing app connectivity.",
    skipIf:
      "You dislike small removable controllers or prefer rechargeable-only systems.",
    editorialNote:
      "Useful as a contrast against app-connected devices because remote control and app control create different privacy and reliability tradeoffs.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Remote control" },
      { label: "Decision", value: "Controller style" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "Tiani Duo",
    merchant: "LELO",
    category: "Couples wearable vibrator",
    categorySlug: "couples",
    officialPath: "/tiani-duo",
    status: "Link pending",
    bestFor:
      "Couples comparing wearable options where fit, remote use, and charging are more important than mode count.",
    skipIf:
      "You want a ring-style product or do not want a wearable format.",
    editorialNote:
      "A natural companion to TOR 3 because it broadens the couples category beyond ring products.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Couples wearable" },
      { label: "Decision", value: "Wearable comfort" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "IDA Wave",
    merchant: "LELO",
    category: "Hands-free couples massager",
    categorySlug: "couples",
    officialPath: "/ida-wave",
    status: "Link pending",
    bestFor:
      "Couples comparing hands-free options where motion and body fit should be evaluated carefully.",
    skipIf:
      "You want a simple external product or a non-wearable couples toy.",
    editorialNote:
      "Included for category completeness but marked as a more fit-sensitive purchase than ring-style products.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Hands-free" },
      { label: "Decision", value: "Body fit" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "F1S V3",
    merchant: "LELO",
    category: "App-connected male masturbator",
    categorySlug: "men",
    officialPath: "/f1s-v3",
    status: "Link pending",
    bestFor:
      "Readers comparing high-tech male products where app features, cleaning, and storage matter.",
    skipIf:
      "You want a low-maintenance product or do not want app-connected features.",
    editorialNote:
      "A good men-focused anchor because it has clear technology, hygiene, and privacy questions to answer.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Men" },
      { label: "Decision", value: "App + cleaning" },
      { label: "Link", value: "Disabled" },
    ],
    art: "tor",
  },
  {
    name: "HUGO 2 Remote",
    merchant: "LELO",
    category: "Remote prostate massager",
    categorySlug: "men",
    officialPath: "/hugo-2-remote",
    status: "Link pending",
    bestFor:
      "Experienced buyers comparing remote-controlled prostate massagers.",
    skipIf:
      "You are looking for beginner external products or want app-only controls.",
    editorialNote:
      "Included as an advanced men-focused pick with explicit fit and experience caveats.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Advanced" },
      { label: "Decision", value: "Remote control" },
      { label: "Link", value: "Disabled" },
    ],
    art: "tor",
  },
  {
    name: "LOKI Wave 2",
    merchant: "LELO",
    category: "Wave-motion prostate massager",
    categorySlug: "men",
    officialPath: "/loki-wave-2",
    status: "Link pending",
    bestFor:
      "Experienced buyers comparing movement-based prostate products.",
    skipIf:
      "You prefer a simpler shape or are not ready for an advanced internal product.",
    editorialNote:
      "Useful for building a men-focused advanced comparison without implying beginner suitability.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Advanced" },
      { label: "Decision", value: "Motion style" },
      { label: "Link", value: "Disabled" },
    ],
    art: "tor",
  },
  {
    name: "BILLY 2",
    merchant: "LELO",
    category: "Slim prostate massager",
    categorySlug: "men",
    officialPath: "/billy-2",
    status: "Link pending",
    bestFor:
      "Readers comparing narrower internal products with simpler controls.",
    skipIf:
      "You want app connectivity or a more complex motion product.",
    editorialNote:
      "A useful lower-complexity contrast for the men category, pending official spec refresh before linking.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Men" },
      { label: "Decision", value: "Shape simplicity" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "LELO Beads",
    merchant: "LELO",
    category: "Pelvic floor beads",
    categorySlug: "accessories-care",
    officialPath: "/lelo-beads",
    status: "Link pending",
    bestFor:
      "Readers comparing non-electronic wellness accessories by size, weight, and care routine.",
    skipIf:
      "You want a vibration-based product or a beginner device with buttons and charging.",
    editorialNote:
      "Adds a care/wellness accessory branch without needing explicit content or hype-heavy claims.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Accessory" },
      { label: "Decision", value: "Weight and care" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "SORAYA Beads",
    merchant: "LELO",
    category: "Vibrating beads",
    categorySlug: "accessories-care",
    officialPath: "/soraya-beads",
    status: "Link pending",
    bestFor:
      "Experienced buyers comparing bead-style products with electronic features.",
    skipIf:
      "You want non-electronic beads or a simpler care routine.",
    editorialNote:
      "A good accessory-category comparison point because it raises cleaning, storage, and charging questions.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Accessory" },
      { label: "Decision", value: "Electronic beads" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "LELO Toy Cleaning Spray",
    merchant: "LELO",
    category: "Cleaning spray",
    categorySlug: "accessories-care",
    officialPath: "/lelo-toy-cleaning-spray",
    status: "Link pending",
    bestFor:
      "Readers who want to buy care products alongside devices and need a simple cleaning workflow.",
    skipIf:
      "You only want device comparisons or prefer soap-and-water care where the manual allows it.",
    editorialNote:
      "Important for a complete site because care products support safer product ownership and internal linking to cleaning guides.",
    specs: [
      { label: "Evidence", value: "Official product page" },
      { label: "Fit", value: "Care" },
      { label: "Decision", value: "Cleaner vs soap" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "Personal Moisturizer",
    merchant: "LELO",
    category: "Intimate care",
    categorySlug: "accessories-care",
    officialPath: "/personal-moisturizer",
    status: "Link pending",
    bestFor:
      "Readers comparing care-adjacent products where ingredients and sensitivity matter.",
    skipIf:
      "You are looking only for devices or need medical advice for discomfort.",
    editorialNote:
      "Included as a future care-content branch, with clear non-medical disclaimers required before any affiliate link goes live.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Care" },
      { label: "Decision", value: "Ingredients" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "F1L Lubricant",
    merchant: "LELO",
    category: "Water-based lubricant",
    categorySlug: "lubricants",
    officialPath: "/f1l-lubricant",
    status: "Link pending",
    bestFor:
      "Readers matching lubricant compatibility with silicone devices and care routines.",
    skipIf:
      "You need condition-specific medical guidance or ingredient allergy advice.",
    editorialNote:
      "A practical low-friction cross-sell only after the site adds a robust lubricant compatibility guide.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Lubricant" },
      { label: "Decision", value: "Compatibility" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "HEX Original",
    merchant: "LELO",
    category: "Condoms",
    categorySlug: "safer-sex",
    officialPath: "/hex-original",
    status: "Link pending",
    bestFor:
      "Readers comparing safer-sex products where size, material, and sensitivity need clear explanation.",
    skipIf:
      "You need medical contraception advice or STI guidance beyond product selection.",
    editorialNote:
      "Adds category depth but should stay conservative and information-led because safer-sex pages can drift into medical territory.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Safer sex" },
      { label: "Decision", value: "Material and fit" },
      { label: "Link", value: "Disabled" },
    ],
    art: "tor",
  },
  {
    name: "HEX Respect XL",
    merchant: "LELO",
    category: "Condoms",
    categorySlug: "safer-sex",
    officialPath: "/hex-respect-xl",
    status: "Link pending",
    bestFor:
      "Readers comparing larger-fit safer-sex products and packaging clarity.",
    skipIf:
      "You need medical advice or are unsure about sizing requirements.",
    editorialNote:
      "Complements HEX Original as a fit-focused comparison item rather than a standalone medical recommendation.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Safer sex" },
      { label: "Decision", value: "Sizing" },
      { label: "Link", value: "Disabled" },
    ],
    art: "tor",
  },
  {
    name: "LELO Smart Wand 2",
    merchant: "LELO",
    category: "Body wand massager",
    categorySlug: "external-vibrators",
    officialPath: "/lelo-smart-wand-2",
    status: "Link pending",
    bestFor:
      "Readers who want broad-contact body massage rather than pinpoint external stimulation.",
    skipIf:
      "You need a compact travel device or a discreet drawer footprint.",
    editorialNote:
      "A useful external-vibrator contrast because wand products have different storage, noise, and weight tradeoffs.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Broad contact" },
      { label: "Decision", value: "Size and storage" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "LILY 3",
    merchant: "LELO",
    category: "Compact personal massager",
    categorySlug: "external-vibrators",
    officialPath: "/lily-3",
    status: "Link pending",
    bestFor:
      "Readers comparing compact, discreet personal massagers with simple storage needs.",
    skipIf:
      "You want sonic stimulation, app control, or a couples product.",
    editorialNote:
      "Useful as a compact-premium option for the beginner and travel taxonomy.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Compact" },
      { label: "Decision", value: "Storage" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "NEA 3",
    merchant: "LELO",
    category: "Compact personal massager",
    categorySlug: "external-vibrators",
    officialPath: "/nea-3",
    status: "Link pending",
    bestFor:
      "Readers comparing very compact external products for simple, discreet ownership.",
    skipIf:
      "You want a broad-contact or advanced internal product.",
    editorialNote:
      "Rounds out the compact category so the site does not over-index on advanced devices.",
    specs: [
      { label: "Evidence", value: "Official-spec placeholder" },
      { label: "Fit", value: "Compact" },
      { label: "Decision", value: "Simplicity" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "Lovehoney Beginner Bullet Placeholder",
    merchant: "Lovehoney",
    category: "Beginner bullet vibrator",
    categorySlug: "external-vibrators",
    officialPath: "/merchant-pending/lovehoney-beginner-bullet",
    status: "Merchant review pending",
    bestFor:
      "A future budget-to-midrange comparison slot once Lovehoney approval and product assets are available.",
    skipIf:
      "You want a verified product record today; this slot needs merchant approval before publication with outbound links.",
    editorialNote:
      "Reserved to avoid overfitting the site to one premium brand. Replace with a specific Lovehoney product after affiliate access confirms availability and permitted assets.",
    specs: [
      { label: "Merchant", value: "Lovehoney" },
      { label: "Evidence", value: "Awaiting affiliate access" },
      { label: "Fit", value: "Beginner" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
  {
    name: "We-Vibe Couples Wearable Placeholder",
    merchant: "We-Vibe",
    category: "App-connected couples wearable",
    categorySlug: "couples",
    officialPath: "/merchant-pending/we-vibe-couples-wearable",
    status: "Merchant review pending",
    bestFor:
      "A future couples comparison slot for app-connected wearable products after We-Vibe program access is approved.",
    skipIf:
      "You need a final recommendation today; this slot is intentionally not linked yet.",
    editorialNote:
      "Reserved because We-Vibe is a natural merchant for couples and app-connected product coverage.",
    specs: [
      { label: "Merchant", value: "We-Vibe" },
      { label: "Evidence", value: "Awaiting affiliate access" },
      { label: "Fit", value: "Couples" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sila",
  },
  {
    name: "Bellesa Boutique Beginner Kit Placeholder",
    merchant: "Bellesa",
    category: "Beginner kit",
    categorySlug: "bundles-kits",
    officialPath: "/merchant-pending/bellesa-beginner-kit",
    status: "Merchant review pending",
    bestFor:
      "A future kit-oriented page where value, packaging, and starter fit can be compared without explicit content.",
    skipIf:
      "You want a single-device comparison instead of a bundle or kit path.",
    editorialNote:
      "Reserved for a later Bellesa/BBoutique affiliate review once product access and terms are confirmed.",
    specs: [
      { label: "Merchant", value: "Bellesa" },
      { label: "Evidence", value: "Awaiting affiliate access" },
      { label: "Fit", value: "Starter kit" },
      { label: "Link", value: "Disabled" },
    ],
    art: "sona",
  },
  {
    name: "Body-Safe Cleaner Comparison Placeholder",
    merchant: "Multi-merchant",
    category: "Cleaning and care",
    categorySlug: "accessories-care",
    officialPath: "/merchant-pending/body-safe-cleaner-comparison",
    status: "Merchant review pending",
    bestFor:
      "A future cross-merchant care comparison that can support cleaner, pouch, and storage content.",
    skipIf:
      "You only want one-brand product coverage.",
    editorialNote:
      "Reserved to make the catalog architecture merchant-neutral from the start.",
    specs: [
      { label: "Merchant", value: "Multi-merchant" },
      { label: "Evidence", value: "Awaiting partner access" },
      { label: "Fit", value: "Care" },
      { label: "Link", value: "Disabled" },
    ],
    art: "dot",
  },
];

export const wellnessCategories: WellnessCategory[] = [
  {
    slug: "external-vibrators",
    title: "External Vibrators",
    eyebrow: "Category",
    description:
      "Compact, broad-contact, travel, and precision options compared by contact area, controls, noise, and storage.",
    decision:
      "Start here when the main decision is external contact style rather than app connectivity or internal fit.",
    productNames: ["LELO DOT", "MIA 3", "LYLA 2", "LELO Smart Wand 2", "LILY 3", "NEA 3"],
  },
  {
    slug: "sonic-massagers",
    title: "Sonic Massagers",
    eyebrow: "Category",
    description:
      "Sonic-wave products compared by contact area, intensity range, button simplicity, and noise expectations.",
    decision:
      "Best for readers deciding between broad gentle contact and compact focused sonic designs.",
    productNames: ["SILA Cruise", "SONA 2 Cruise"],
  },
  {
    slug: "internal-vibrators",
    title: "Internal Vibrators",
    eyebrow: "Category",
    description:
      "Shape-led internal products where angle, size, handle design, and cleaning routine drive the decision.",
    decision:
      "Use this category when product fit and geometry matter more than mode count.",
    productNames: ["GIGI 3", "SORAYA 2", "INA Wave 2", "ENIGMA Wave"],
  },
  {
    slug: "couples",
    title: "Couples Products",
    eyebrow: "Category",
    description:
      "Ring, wearable, and hands-free products compared by fit sensitivity, remote use, charging, and partner-control tradeoffs.",
    decision:
      "Best for couples deciding between ring-style, wearable, and app or remote-controlled formats.",
    productNames: ["TOR 3", "Tiani Duo", "IDA Wave"],
  },
  {
    slug: "men",
    title: "Men's Wellness",
    eyebrow: "Category",
    description:
      "Male-focused devices compared by app features, remote control, internal fit, cleaning burden, and storage.",
    decision:
      "Use this path when hygiene, privacy, and app-control tradeoffs are as important as product format.",
    productNames: ["F1S V3", "HUGO 2 Remote", "LOKI Wave 2", "BILLY 2"],
  },
  {
    slug: "accessories-care",
    title: "Accessories And Care",
    eyebrow: "Category",
    description:
      "Cleaning, storage, beads, and care-adjacent products that support safer ownership and better maintenance habits.",
    decision:
      "A good companion category for buyers who already chose a device and need care, storage, or non-electronic accessories.",
    productNames: [
      "LELO Beads",
      "SORAYA Beads",
      "LELO Toy Cleaning Spray",
      "Personal Moisturizer",
      "Body-Safe Cleaner Comparison Placeholder",
    ],
  },
  {
    slug: "bundles-kits",
    title: "Bundles And Starter Kits",
    eyebrow: "Category",
    description:
      "Multi-product kits organized by beginner fit, care needs, return policy, packaging privacy, and value clarity.",
    decision:
      "Use this path when a reader wants a curated set rather than a single device.",
    productNames: ["Bellesa Boutique Beginner Kit Placeholder"],
  },
  {
    slug: "lubricants",
    title: "Lubricants",
    eyebrow: "Category",
    description:
      "Lubricant picks organized around material compatibility, ingredients, cleanup, and device-surface safety.",
    decision:
      "Use this category only after checking material compatibility and sensitivity needs.",
    productNames: ["F1L Lubricant"],
  },
  {
    slug: "safer-sex",
    title: "Safer-Sex Products",
    eyebrow: "Category",
    description:
      "Condom and safer-sex product coverage kept practical, fit-focused, and clearly non-medical.",
    decision:
      "This category should stay product-selection focused and avoid medical promises.",
    productNames: ["HEX Original", "HEX Respect XL"],
  },
  {
    slug: "luxury",
    title: "Luxury And Advanced",
    eyebrow: "Category",
    description:
      "Premium, more complex LELO devices for experienced buyers comparing fit, features, size, and maintenance.",
    decision:
      "Best for readers who already know the product format they want and need tradeoffs made visible.",
    productNames: ["ENIGMA Wave", "SORAYA 2", "INA Wave 2", "LELO DOT"],
  },
];

export const pendingPartners = [
  "LELO",
  "Lovehoney",
  "We-Vibe",
  "BBoutique",
];
