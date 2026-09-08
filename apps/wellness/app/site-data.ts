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

export const productPicks: ProductPick[] = [
  {
    name: "Avidlove Lingerie Collection",
    merchant: "Avidlove",
    category: "Lingerie",
    categorySlug: "lingerie",
    status: "CJ approved partner link",
    bestFor: "Shoppers starting with a style, coverage, and fabric preference before comparing individual pieces.",
    skipIf: "You already know you need sleepwear, a robe, or a relaxed at-home layer instead of lingerie.",
    editorialNote: "Avidlove is the first approved partner for this site. Product-level recommendations will be added only after CJ tracking links and current retailer details are verified.",
    specs: [
      { label: "Partner", value: "Avidlove via CJ" },
      { label: "Market", value: "United States" },
      { label: "Evidence", value: "Retailer details pending verification" },
    ],
    art: "sila",
    affiliateUrl: "https://www.jdoqocy.com/click-101832972-15860220",
  },
  {
    name: "Avidlove Nightwear Collection",
    merchant: "Avidlove",
    category: "Nightwear",
    categorySlug: "nightwear",
    status: "CJ approved partner link",
    bestFor: "People comparing lighter sleep layers by coverage, fabric feel, temperature, and care burden.",
    skipIf: "You want a structured lingerie piece or an outerwear-ready lounge layer.",
    editorialNote: "This category is intentionally kept style-led and non-explicit, with product pages added only when their material and sizing details can be confirmed.",
    specs: [
      { label: "Partner", value: "Avidlove via CJ" },
      { label: "Decision", value: "Fabric, coverage, care" },
      { label: "Evidence", value: "Retailer details pending verification" },
    ],
    art: "sona",
    affiliateUrl: "https://www.jdoqocy.com/click-101832972-15860220",
  },
  {
    name: "Avidlove Babydoll And Chemise Collection",
    merchant: "Avidlove",
    category: "Babydolls and chemises",
    categorySlug: "babydolls-chemises",
    status: "CJ approved partner link",
    bestFor: "Shoppers who want a lighter, draped silhouette and need help comparing length, coverage, and support expectations.",
    skipIf: "You prefer a two-piece set, a more structured bra-led look, or everyday sleepwear.",
    editorialNote: "The editorial lens here is proportion, material transparency, and comfort expectations rather than suggestive styling claims.",
    specs: [
      { label: "Partner", value: "Avidlove via CJ" },
      { label: "Decision", value: "Length, coverage, fit" },
      { label: "Evidence", value: "Retailer details pending verification" },
    ],
    art: "dot",
    affiliateUrl: "https://www.jdoqocy.com/click-101832972-15860220",
  },
  {
    name: "Avidlove Robes And Cover-Ups Collection",
    merchant: "Avidlove",
    category: "Robes and cover-ups",
    categorySlug: "robes-cover-ups",
    status: "CJ approved partner link",
    bestFor: "Layering over sleepwear or lingerie, with attention to length, sleeves, fabric weight, and wash instructions.",
    skipIf: "You need a single-piece sleep layer or a structured everyday garment.",
    editorialNote: "This is a practical companion category for shoppers who want coverage and layering rather than a stand-alone statement piece.",
    specs: [
      { label: "Partner", value: "Avidlove via CJ" },
      { label: "Decision", value: "Layering, length, fabric weight" },
      { label: "Evidence", value: "Retailer details pending verification" },
    ],
    art: "tor",
    affiliateUrl: "https://www.jdoqocy.com/click-101832972-15860220",
  },
];

export const wellnessCategories: WellnessCategory[] = [
  {
    slug: "lingerie",
    title: "Lingerie",
    eyebrow: "Shop by silhouette",
    description: "Compare shape, coverage, fabric, and the level of structure you want from a piece.",
    decision: "Choose this path when the main decision is between different lingerie silhouettes and fit expectations.",
    productNames: ["Avidlove Lingerie Collection"],
    availability: "active",
    shoppingFocus: "Silhouette, coverage, support",
  },
  {
    slug: "nightwear",
    title: "Nightwear",
    eyebrow: "Shop by routine",
    description: "Sleep layers compared by temperature, fabric feel, coverage, and care requirements.",
    decision: "Start here for comfort-first nightwear and lighter sleep layers.",
    productNames: ["Avidlove Nightwear Collection"],
    availability: "active",
    shoppingFocus: "Temperature, fabric, care",
  },
  {
    slug: "babydolls-chemises",
    title: "Babydolls And Chemises",
    eyebrow: "Shop by silhouette",
    description: "Draped, lightweight styles where length, adjustability, fabric, and coverage lead the decision.",
    decision: "Use this path when you want a one-piece, lighter silhouette and need expectations set around fit.",
    productNames: ["Avidlove Babydoll And Chemise Collection"],
    availability: "active",
    shoppingFocus: "Length, adjustability, fit",
  },
  {
    slug: "robes-cover-ups",
    title: "Robes And Cover-Ups",
    eyebrow: "Shop by layer",
    description: "Companion layers compared by length, sleeves, fabric weight, and how they work with sleepwear.",
    decision: "Start here when a layer, coverage, and fabric weight matter more than a single-piece sleep style.",
    productNames: ["Avidlove Robes And Cover-Ups Collection"],
    availability: "active",
    shoppingFocus: "Layers, weight, wash care",
  },
  {
    slug: "bralettes-basics",
    title: "Bralettes And Basics",
    eyebrow: "Coverage expanding",
    description: "An upcoming fit-led path for everyday bras, bralettes, and foundational pieces.",
    decision: "Use this section to compare support needs, straps, bands, and preferred coverage once partner coverage is active.",
    productNames: [],
    availability: "expanding",
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
