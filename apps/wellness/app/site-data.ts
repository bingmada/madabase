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
  slug: string;
  name: string;
  merchant: string;
  category: string;
  categorySlug: string;
  status: string;
  bestFor: string;
  skipIf: string;
  editorialNote: string;
  specs: Array<{ label: string; value: string }>;
  imageUrl: string;
  price: string;
  destinationUrl: string;
  affiliateUrl: string;
};

export type WellnessCategory = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  decision: string;
  productNames: string[];
  availability: "active" | "hidden";
  shoppingFocus: string;
};

export const avidloveCj = {
  advertiserCid: "6917385",
  pid: "101832972",
  aid: "15722800",
  allowedDestinationHosts: ["avidlove.com", "www.avidlove.com"],
} as const;

export const avidloveProductLink = (destination: string) =>
  `https://www.jdoqocy.com/click-101832972-15722800?url=${encodeURIComponent(destination)}`;

const affiliatePath = (slug: string) => `/go/cj/${slug}`;

export const productPicks: ProductPick[] = [
  {
    slug: "floral-embroidery-underwire-set",
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
    imageUrl: "https://avidlove.com/cdn/shop/files/AML010033_PAT2-2.jpg?v=1743596749&width=1200",
    price: "$26.99",
    destinationUrl: "https://avidlove.com/products/avidlove-womens-floral-embroidery-underwire-lingerie-set",
    affiliateUrl: affiliatePath("floral-embroidery-underwire-set"),
  },
  {
    slug: "lace-v-neck-bra-panty-set",
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
    imageUrl: "https://avidlove.com/cdn/shop/files/AML008522_B-1.jpg?v=1750395405&width=1200",
    price: "$26.99",
    destinationUrl: "https://avidlove.com/products/avidlove-lingerie-set-for-women-2-piece-lace-babydoll-sexy-v-neck-bra-and-panty-sets",
    affiliateUrl: affiliatePath("lace-v-neck-bra-panty-set"),
  },
  {
    slug: "satin-pajamas-cami-shorts",
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
    imageUrl: "https://avidlove.com/cdn/shop/files/AML009495_SD141-1.jpg?v=1761291726&width=1200",
    price: "$32.99",
    destinationUrl: "https://avidlove.com/products/avidlove-satin-pajamas-set-sleepwear-womens-sexy-lingerie-cami-shorts-set-nightwear-s-xxl",
    affiliateUrl: affiliatePath("satin-pajamas-cami-shorts"),
  },
  {
    slug: "short-sleeve-pajama-set",
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
    imageUrl: "https://avidlove.com/cdn/shop/files/AMK006067_DR-4.jpg?v=1750315734&width=1200",
    price: "$32.99",
    destinationUrl: "https://avidlove.com/products/avidlove-womens-shorts-pajama-set-short-sleeve-sleepwear-nightwear-pjs-s-xxl",
    affiliateUrl: affiliatePath("short-sleeve-pajama-set"),
  },
  {
    slug: "modal-cami-pajama-set",
    name: "Modal Cami Pajama Set",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ product link",
    bestFor: "Shoppers who want a cami-and-shorts set with modal called out in the retailer listing.",
    skipIf: "You prefer a satin feel or a loose short-sleeve silhouette.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a modal cami sleepwear set with lace trim. Verify fabric content and fit on the retailer page.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Modal cami and shorts" }, { label: "Catalog price", value: "$27.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML008629_PAT17-2.jpg?v=1750315671&width=1200",
    price: "$27.99",
    destinationUrl: "https://avidlove.com/products/avidlove-women-cami-pajama-set-modal-sleepwear-lace-trim-short-pj-set-with-shorts",
    affiliateUrl: affiliatePath("modal-cami-pajama-set"),
  },
  {
    slug: "lace-pajamas-cami-set",
    name: "Lace Pajamas Cami Set",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ product link",
    bestFor: "A matching cami PJ option when a lace-trim detail is part of the brief.",
    skipIf: "You are looking for a plain basics set or a long sleep dress.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace pajamas cami set. Consult the retailer for color, fabric, and care specifics.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Cami PJ set" }, { label: "Catalog price", value: "$32.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML007942_SD141-7.jpg?v=1750393841&width=1200",
    price: "$32.99",
    destinationUrl: "https://avidlove.com/products/avidlove-sleepwear-lace-pajamas-cami-pjs-set-pajama-set-for-women",
    affiliateUrl: affiliatePath("lace-pajamas-cami-set"),
  },
  {
    slug: "satin-nightgown-mini-slip",
    name: "Satin Nightgown Mini Slip",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A shorter satin sleep layer when you prefer a one-piece over a two-piece set.",
    skipIf: "You need more coverage, a short-sleeve top, or a robe layer.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a satin nightgown and mini slip. Confirm length, fabric, and current sizes at the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "One-piece slip" }, { label: "Catalog price", value: "$24.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML009073_R-3_e06c64f8-e05b-4c3a-86c6-eed224f3db6a.jpg?v=1750391090&width=1200",
    price: "$24.99",
    destinationUrl: "https://avidlove.com/products/avidlove-women-sleepwear-satin-nightgown-mini-slip-chemise-short-nightwear",
    affiliateUrl: affiliatePath("satin-nightgown-mini-slip"),
  },
  {
    slug: "lace-v-neck-full-slip",
    name: "Lace V-Neck Full Slip Sleep Dress",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A dress-like sleep layer when a longer drape is more useful than a shorts set.",
    skipIf: "You prefer a two-piece PJ set or a structured lingerie silhouette.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace V-neck full-slip sleep dress. Check the retailer listing for the current material and size information.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Full-slip sleep dress" }, { label: "Catalog price", value: "$34.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML008606_AX31-1.jpg?v=1750397228&width=1200",
    price: "$34.99",
    destinationUrl: "https://avidlove.com/products/avidlove-babydoll-nightgown-chemises-lace-modal-sleepwear-v-neck-full-slip-sleep-dress",
    affiliateUrl: affiliatePath("lace-v-neck-full-slip"),
  },
  {
    slug: "satin-lace-chemise-mini-slip",
    name: "Satin Lace Chemise Mini Full Slip",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ product link",
    bestFor: "A short satin chemise when you prefer lace detail with a one-piece slip silhouette.",
    skipIf: "You need a two-piece set, substantial coverage, or a casual lounge layer.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a satin sleepwear lace chemise mini full slip. Confirm fit, material, and colors on the retailer page.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Format", value: "Satin mini chemise" }, { label: "Catalog price", value: "$28.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML006253_DH331-1_925e2bfb-bac6-4eb6-956d-13578ba0fa5b.jpg?v=1750389009&width=1200",
    price: "$28.99",
    destinationUrl: "https://avidlove.com/products/avidlove-womens-nightwear-sexy-satin-sleepwear-lace-chemises-mini-full-slip",
    affiliateUrl: affiliatePath("satin-lace-chemise-mini-slip"),
  },
  {
    slug: "satin-kimono-wedding-robe",
    name: "Satin Kimono Wedding Party Robe",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "A short satin robe for getting-ready routines or adding a light layer over sleepwear.",
    skipIf: "You want a long robe, a beach cover-up, or a stand-alone sleep dress.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a short satin kimono robe for wedding-party getting-ready. Check dimensions, fabric, and colors with the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Layer", value: "Short satin robe" }, { label: "Catalog price", value: "$26.49" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AMY005937_B-1.jpg?v=1750316218&width=1200",
    price: "$26.49",
    destinationUrl: "https://avidlove.com/products/avidlove-womens-satin-kimono-robe-for-bridesmaid-and-bride-wedding-party-getting-ready-short-robe",
    affiliateUrl: affiliatePath("satin-kimono-wedding-robe"),
  },
  {
    slug: "floral-sheer-lace-kimono",
    name: "Floral Sheer Lace Kimono Robe",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "A lightweight layer when you prefer sheer lace rather than satin weight.",
    skipIf: "You need opaque coverage or a robe designed for colder evenings.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a floral sheer lace kimono robe. The retailer page has the current fabric, length, and care details.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Layer", value: "Sheer kimono robe" }, { label: "Catalog price", value: "$27.98" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML006126_B-4.jpg?v=1744871838&width=1200",
    price: "$27.98",
    destinationUrl: "https://avidlove.com/products/avidlove-women-kimono-robe-floral-lace-babydoll-lingerie-sheer-mesh-nightgown",
    affiliateUrl: affiliatePath("floral-sheer-lace-kimono"),
  },
  {
    slug: "lace-kimono-mesh-nightgown",
    name: "Lace Kimono Robe Mesh Nightgown",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ product link",
    bestFor: "A lace kimono-style layer when you are specifically comparing a robe-led silhouette.",
    skipIf: "You need an opaque lounge layer or a garment designed for outdoor cover-up use.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a lace kimono robe and mesh nightgown. Check the retailer page for current fit and material details.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Layer", value: "Lace kimono robe" }, { label: "Catalog price", value: "$34.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML006103_B-1.jpg?v=1750390669&width=1200",
    price: "$34.99",
    destinationUrl: "https://avidlove.com/products/avidlove-womens-lace-kimono-robe-babydoll-lingerie-mesh-nightgown-s-5xl",
    affiliateUrl: affiliatePath("lace-kimono-mesh-nightgown"),
  },
  {
    slug: "high-neck-lace-bralette",
    name: "High-Neck Lace Bralette",
    merchant: "Avidlove",
    category: "Bralettes and basics",
    categorySlug: "bralettes-basics",
    status: "CJ product link",
    bestFor: "A high-neck, racerback bralette shape for light layering and lower-structure support.",
    skipIf: "You need an underwire, strong support, or a classic bra construction.",
    editorialNote: "Listed in the Avidlove CJ product catalog as a high-neck racerback lace bralette. Review current size guidance and material details at the retailer.",
    specs: [{ label: "Retailer", value: "Avidlove via CJ" }, { label: "Shape", value: "High neck, racerback" }, { label: "Catalog price", value: "$26.99" }],
    imageUrl: "https://avidlove.com/cdn/shop/files/AML009144_B-_3.jpg?v=1750316330&width=1200",
    price: "$26.99",
    destinationUrl: "https://avidlove.com/products/avidlove-lace-bralette-for-women-high-neck-camisoles-racerback-double-layered-crop-top",
    affiliateUrl: affiliatePath("high-neck-lace-bralette"),
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
    productNames: ["Satin Nightgown Mini Slip", "Lace V-Neck Full Slip Sleep Dress", "Satin Lace Chemise Mini Full Slip"],
    availability: "active",
    shoppingFocus: "Length, adjustability, fit",
  },
  {
    slug: "robes-cover-ups",
    title: "Robes And Cover-Ups",
    eyebrow: "Shop by layer",
    description: "Companion layers compared by length, sleeves, fabric weight, and how they work with sleepwear.",
    decision: "Start here when a layer, coverage, and fabric weight matter more than a single-piece sleep style.",
    productNames: ["Satin Kimono Wedding Party Robe", "Floral Sheer Lace Kimono Robe", "Lace Kimono Robe Mesh Nightgown"],
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
    availability: "hidden",
    shoppingFocus: "Band, straps, daily support",
  },
  {
    slug: "loungewear",
    title: "Loungewear",
    eyebrow: "Coverage expanding",
    description: "Relaxed pieces for home routines, travel days, and layering between sleep and daytime.",
    decision: "Start here when ease of movement, fabric weight, and repeat wear matter more than sleep-specific design.",
    productNames: [],
    availability: "hidden",
    shoppingFocus: "Movement, weight, repeat wear",
  },
  {
    slug: "shapewear-base-layers",
    title: "Shapewear And Base Layers",
    eyebrow: "Coverage expanding",
    description: "A future practical guide to smoothing, layering, and comfort under occasion outfits.",
    decision: "Use this section when your key decision is level of compression, garment length, and outfit compatibility.",
    productNames: [],
    availability: "hidden",
    shoppingFocus: "Compression, length, occasion",
  },
  {
    slug: "hosiery",
    title: "Hosiery",
    eyebrow: "Coverage expanding",
    description: "A future directory for tights, socks, and hosiery chosen by opacity, warmth, and durability.",
    decision: "Start here when denier, rise, warmth, and wear life are the decisions that matter.",
    productNames: [],
    availability: "hidden",
    shoppingFocus: "Opacity, warmth, durability",
  },
];

export const approvedPartners = ["Avidlove"];
