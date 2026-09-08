import { BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const site = {
  name: "Madabase Women's Edit",
  domain: "https://wellness.madabase.com",
  description:
    "A practical directory for women's lingerie, sleepwear, loungewear, and fit-led shopping decisions.",
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  minutes: string;
  sections: Array<{ title: string; body: string }>;
  checklist: string[];
};

// Legacy adult-wellness routes intentionally resolve to 404 while the site
// transitions to approved lingerie coverage. They are not linked or indexed.
export const guides: Guide[] = [];

export const principles = [
  {
    title: "Fit Before Trend",
    body: "We organize buying guidance around sizing, coverage, support, fabric, and the occasion a piece needs to serve.",
    icon: HeartHandshake,
  },
  {
    title: "Clear Evidence",
    body: "We distinguish retailer descriptions from editorial guidance and do not claim hands-on testing unless it happened.",
    icon: BadgeCheck,
  },
  {
    title: "Comfort And Care",
    body: "Material composition, care instructions, return terms, and wardrobe fit matter as much as the appearance of a piece.",
    icon: ShieldCheck,
  },
];

export type ProductPick = {
  name: string;
  merchant: string;
  category: string;
  categorySlug: string;
  status: string;
  bestFor: string;
  skipIf: string;
  editorialNote: string;
  specs: Array<{ label: string; value: string }>;
  art: string;
  price: string;
  affiliateUrl?: string;
};

export type WellnessCategory = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  decision: string;
  productNames: string[];
  availability: "active" | "expanding";
  shoppingFocus: string;
};

const avidloveProductLink = (destination: string) =>
  `https://www.jdoqocy.com/click-101832972-15722800?url=${encodeURIComponent(destination)}`;

export const productPicks: ProductPick[] = [
  {
    name: "Floral Embroidery Underwire Lingerie Set",
    merchant: "Avidlove",
    category: "Lingerie",
    categorySlug: "lingerie",
    status: "CJ product link",
    bestFor: "A coordinated, structured set when an underwire-led silhouette is the preference.",
    skipIf: "You are looking for low-structure everyday support or a sleep-first layer.",
    editorialNote: "Listed in the Avidlove CJ product catalog as an underwire lingerie set. Check the retailer page for the current color, sizing, and care details before ordering.",
    specs: [
      { label: "Retailer", value: "Avidlove via CJ" },
      { label: "Style", value: "Underwire set" },
      { label: "Catalog price", value: "$26.99" },
    ],
    art: "sila",
    price: "$26.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-womens-floral-embroidery-underwire-lingerie-set"),
  },
  {
    name: "Lace V-Neck Bra And Panty Set",
    merchant: "Avidlove",
    category: "Lingerie",
    categorySlug: "lingerie",
    status: "CJ product link",
    bestFor: "A simple two-piece option when you prefer a V-neck bra shape over a more layered set.",
    skipIf: "You need higher coverage or a more structured, everyday bra construction.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a two-piece lace V-neck bra and panty set. Current sizing, colors, and care information live on the retailer page.",
    specs: [
      { label: "Retailer", value: "Avidlove via CJ" },
      { label: "Style", value: "Two-piece set" },
      { label: "Catalog price", value: "$26.99" },
    ],
    art: "sona",
    price: "$26.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-lingerie-set-for-women-2-piece-lace-babydoll-sexy-v-neck-bra-and-panty-sets"),
  },
  {
    name: "Satin Pajamas Cami Shorts Set",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ product link",
    bestFor: "A lightweight two-piece sleep set when you prefer shorts and a matching cami.",
    skipIf: "You want a longer sleep layer or a relaxed short-sleeve top.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a satin cami and shorts sleepwear set. Check the retailer page for fabric composition and the current size range.",
    specs: [
      { label: "Retailer", value: "Avidlove via CJ" },
      { label: "Format", value: "Cami and shorts" },
      { label: "Catalog price", value: "$32.99" },
    ],
    art: "dot",
    price: "$32.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-satin-pajamas-set-sleepwear-womens-sexy-lingerie-cami-shorts-set-nightwear-s-xxl"),
  },
  {
    name: "Short Sleeve Pajama Set",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ product link",
    bestFor: "A familiar shorts-and-short-sleeve sleepwear format for warm evenings.",
    skipIf: "You prefer a cami shape, a dress-like sleep layer, or a robe for coverage.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a short-sleeve shorts pajama set. Confirm fabric, fit notes, and current availability with the retailer.",
    specs: [
      { label: "Retailer", value: "Avidlove via CJ" },
      { label: "Format", value: "Short sleeve and shorts" },
      { label: "Catalog price", value: "$32.99" },
    ],
    art: "tor",
    price: "$32.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-womens-shorts-pajama-set-short-sleeve-sleepwear-nightwear-pjs-s-xxl"),
  },
  {
    name: "Modal Cami Pajama Set",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ product link",
    bestFor: "Shoppers who want a cami-and-shorts set with modal called out in the retailer listing.",
    skipIf: "You prefer a satin feel or a loose short-sleeve silhouette.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a modal cami sleepwear set with lace trim. Verify fabric content and fit on the retailer page.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Modal cami and shorts" }, { label: "Catalog price", value: "$27.99" }],
    art: "sila",
    price: "$27.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-women-cami-pajama-set-modal-sleepwear-lace-trim-short-pj-set-with-shorts"),
  },
  {
    name: "Lace Pajamas Cami Set",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ product link",
    bestFor: "A matching cami PJ option when a lace-trim detail is part of the brief.",
    skipIf: "You are looking for a plain basics set or a long sleep dress.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace pajamas cami set. Consult the retailer for color, fabric, and care specifics.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Cami PJ set" }, { label: "Catalog price", value: "$32.99" }],
    art: "sona",
    price: "$32.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-sleepwear-lace-pajamas-cami-pjs-set-pajama-set-for-women"),
  },
  {
    name: "Satin Nightgown Mini Slip",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A shorter satin sleep layer when you prefer a one-piece over a two-piece set.",
    skipIf: "You need more coverage, a short-sleeve top, or a robe layer.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a satin nightgown and mini slip. Confirm length, fabric, and current sizes at the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "One-piece slip" }, { label: "Catalog price", value: "$24.99" }],
    art: "dot",
    price: "$24.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-women-sleepwear-satin-nightgown-mini-slip-chemise-short-nightwear"),
  },
  {
    name: "Lace V-Neck Full Slip Sleep Dress",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A dress-like sleep layer when a longer drape is more useful than a shorts set.",
    skipIf: "You prefer a two-piece PJ set or a structured lingerie silhouette.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace V-neck full-slip sleep dress. Check the retailer listing for the current material and size information.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Full-slip sleep dress" }, { label: "Catalog price", value: "$34.99" }],
    art: "tor",
    price: "$34.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-babydoll-nightgown-chemises-lace-modal-sleepwear-v-neck-full-slip-sleep-dress"),
  },
  {
    name: "Satin Lace Chemise Mini Full Slip",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A short satin chemise when you prefer lace detail with a one-piece slip silhouette.",
    skipIf: "You need a two-piece set, substantial coverage, or a casual lounge layer.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a satin sleepwear lace chemise mini full slip. Confirm fit, material, and colors on the retailer page.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Satin mini chemise" }, { label: "Catalog price", value: "$28.99" }],
    art: "sila",
    price: "$28.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-womens-nightwear-sexy-satin-sleepwear-lace-chemises-mini-full-slip"),
  },
  {
    name: "Satin Chemise Nightgown",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A satin, V-neck chemise option for an uncomplicated one-piece nightwear profile.",
    skipIf: "You prefer a relaxed T-shirt PJ set, a robe, or structured everyday support.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace babydoll satin chemise nightgown. Review retailer sizing and fabric information before ordering.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Satin chemise" }, { label: "Catalog price", value: "$26.98" }],
    art: "sona",
    price: "$26.98",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-womens-lace-babydoll-lingerie-satin-chemise-nightgown-v-neck-sleepwear-nightie"),
  },
  {
    name: "Satin Kimono Wedding Party Robe",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "A short satin robe for getting-ready routines or adding a light layer over sleepwear.",
    skipIf: "You want a long robe, a beach cover-up, or a stand-alone sleep dress.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a short satin kimono robe for wedding-party getting-ready. Check dimensions, fabric, and colors with the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Layer", value: "Short satin robe" }, { label: "Catalog price", value: "$26.49" }],
    art: "sila",
    price: "$26.49",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-womens-satin-kimono-robe-for-bridesmaid-and-bride-wedding-party-getting-ready-short-robe"),
  },
  {
    name: "Floral Sheer Lace Kimono Robe",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "A lightweight layer when you prefer sheer lace rather than satin weight.",
    skipIf: "You need opaque coverage or a robe designed for colder evenings.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a floral sheer lace kimono robe. The retailer page has the current fabric, length, and care details.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Layer", value: "Sheer kimono robe" }, { label: "Catalog price", value: "$27.98" }],
    art: "sona",
    price: "$27.98",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-women-kimono-robe-floral-lace-babydoll-lingerie-sheer-mesh-nightgown"),
  },
  {
    name: "Lace Kimono Robe Mesh Nightgown",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "A lace kimono-style layer when you are specifically comparing a robe-led silhouette.",
    skipIf: "You need an opaque lounge layer or a garment designed for outdoor cover-up use.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace kimono robe and mesh nightgown. Check the retailer page for current fit and material details.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Layer", value: "Lace kimono robe" }, { label: "Catalog price", value: "$34.99" }],
    art: "tor",
    price: "$34.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-womens-lace-kimono-robe-babydoll-lingerie-mesh-nightgown-s-5xl"),
  },
  {
    name: "V-Neck Beach Cover-Up Dress",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "An easy cover-up for beach or pool days where a loose layer is the main need.",
    skipIf: "You are shopping for a sleep-specific robe or a more structured dress.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a V-neck beach cover-up dress. Confirm fabric and fit details directly with the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Use", value: "Beach or pool cover-up" }, { label: "Catalog price", value: "$29.99" }],
    art: "dot",
    price: "$29.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-swimsuit-coverup-for-women-beach-cover-up-dress-v-neck-bathing-suit-cover-ups-casual-loose-bikini-tunic-top"),
  },
  {
    name: "High-Neck Lace Bralette",
    merchant: "Avidlove",
    category: "Bralettes and basics",
    categorySlug: "bralettes-basics",
    status: "CJ product link",
    bestFor: "A high-neck, racerback bralette shape for light layering and lower-structure support.",
    skipIf: "You need an underwire, strong support, or a classic bra construction.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a high-neck racerback lace bralette. Review current size guidance and material details at the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Shape", value: "High neck, racerback" }, { label: "Catalog price", value: "$26.99" }],
    art: "tor",
    price: "$26.99",
    affiliateUrl: avidloveProductLink("https://avidlove.com/products/avidlove-lace-bralette-for-women-high-neck-camisoles-racerback-double-layered-crop-top"),
  },
];

export const wellnessCategories: WellnessCategory[] = [
  {
    slug: "lingerie",
    title: "Lingerie",
    eyebrow: "Shop by silhouette",
    description: "Compare shape, coverage, fabric, and the level of structure you want from a piece.",
    decision: "Choose this path when the main decision is between different lingerie silhouettes and fit expectations.",
    productNames: ["Floral Embroidery Underwire Lingerie Set", "Lace V-Neck Bra And Panty Set"],
    availability: "active",
    shoppingFocus: "Silhouette, coverage, support",
  },
  {
    slug: "nightwear",
    title: "Nightwear",
    eyebrow: "Shop by routine",
    description: "Sleep layers compared by temperature, fabric feel, coverage, and care requirements.",
    decision: "Start here for comfort-first nightwear and lighter sleep layers.",
    productNames: ["Satin Pajamas Cami Shorts Set", "Short Sleeve Pajama Set", "Modal Cami Pajama Set", "Lace Pajamas Cami Set"],
    availability: "active",
    shoppingFocus: "Temperature, fabric, care",
  },
  {
    slug: "babydolls-chemises",
    title: "Babydolls And Chemises",
    eyebrow: "Shop by silhouette",
    description: "Draped, lightweight styles where length, adjustability, fabric, and coverage lead the decision.",
    decision: "Use this path when you want a one-piece, lighter silhouette and need expectations set around fit.",
    productNames: ["Satin Nightgown Mini Slip", "Lace V-Neck Full Slip Sleep Dress", "Satin Lace Chemise Mini Full Slip", "Satin Chemise Nightgown"],
    availability: "active",
    shoppingFocus: "Length, adjustability, fit",
  },
  {
    slug: "robes-cover-ups",
    title: "Robes And Cover-Ups",
    eyebrow: "Shop by layer",
    description: "Companion layers compared by length, sleeves, fabric weight, and how they work with sleepwear.",
    decision: "Start here when a layer, coverage, and fabric weight matter more than a single-piece sleep style.",
    productNames: ["Satin Kimono Wedding Party Robe", "Floral Sheer Lace Kimono Robe", "Lace Kimono Robe Mesh Nightgown", "V-Neck Beach Cover-Up Dress"],
    availability: "active",
    shoppingFocus: "Layers, weight, wash care",
  },
  {
    slug: "bralettes-basics",
    title: "Bralettes And Basics",
    eyebrow: "Shop by support",
    description: "A fit-led starting point for lighter-support bralettes and foundational layers.",
    decision: "Use this section when straps, coverage, neckline, and the level of daily support are the main decisions.",
    productNames: ["High-Neck Lace Bralette"],
    availability: "active",
    shoppingFocus: "Band, straps, daily support",
  },
  {
    slug: "loungewear",
    title: "Loungewear",
    eyebrow: "Coverage expanding",
    description: "Relaxed pieces for home routines, travel days, and layering between sleep and daytime.",
    decision: "Start here when ease of movement, fabric weight, and repeat wear matter more than sleep-specific design.",
    productNames: [],
    availability: "expanding",
    shoppingFocus: "Movement, weight, repeat wear",
  },
  {
    slug: "shapewear-base-layers",
    title: "Shapewear And Base Layers",
    eyebrow: "Coverage expanding",
    description: "A future practical guide to smoothing, layering, and comfort under occasion outfits.",
    decision: "Use this section when your key decision is level of compression, garment length, and outfit compatibility.",
    productNames: [],
    availability: "expanding",
    shoppingFocus: "Compression, length, occasion",
  },
  {
    slug: "hosiery",
    title: "Hosiery",
    eyebrow: "Coverage expanding",
    description: "A future directory for tights, socks, and hosiery chosen by opacity, warmth, and durability.",
    decision: "Start here when denier, rise, warmth, and wear life are the decisions that matter.",
    productNames: [],
    availability: "expanding",
    shoppingFocus: "Opacity, warmth, durability",
  },
];

export const approvedPartners = ["Avidlove"];
