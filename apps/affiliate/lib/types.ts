export type SiteKey = "pet" | "homeoffice" | "baby" | "network" | "smarthome";

export type Score = {
  label: string;
  value: number;
};

export type Product = {
  slug: string;
  site: SiteKey;
  seoTitle?: string;
  updatedAt?: string;
  sources?: Array<{ name: string; url: string; note?: string }>;
  editorialSections?: Array<{ heading: string; body: string }>;
  compareSlugs?: string[];
  asin?: string;
  amazonTitle?: string;
  amazonImage?: string;
  amazonDetailUrl?: string;
  amazonFeatures?: string[];
  name: string;
  brand: string;
  category: string;
  image: string;
  summary: string;
  verdict?: string;
  whyItMatters?: string;
  bestFor: string;
  priceBand: "$" | "$$" | "$$$" | "$$$$";
  rating: number;
  scores: Score[];
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  evidence: string[];
  alternatives?: string[];
  offers: AffiliateOffer[];
};

export type AffiliateOffer = {
  merchant: string;
  url: string;
  label: string;
  priceNote: string;
};

export type Roundup = {
  slug: string;
  site: SiteKey;
  title: string;
  dek: string;
  category: string;
  intent: string;
  intro?: string;
  sections?: Array<{ heading: string; body: string }>;
  decisionGuide?: Array<{ label: string; detail: string }>;
  methodology: string[];
  productSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type Guide = {
  slug: string;
  site: SiteKey;
  title: string;
  dek: string;
  category: string;
  updatedAt?: string;
  sources?: Array<{ name: string; url: string; note?: string }>;
  sections: Array<{ heading: string; body: string }>;
  relatedRoundups: string[];
  relatedProducts?: string[];
};

export type Tool = {
  slug: string;
  site: SiteKey;
  title: string;
  dek: string;
  category: string;
  kind: "feeding" | "desk" | "diapers" | "wifi";
  relatedRoundups: string[];
};

export type StaticPage = {
  slug: string;
  title: string;
  dek: string;
  sections: Array<{ heading: string; body: string }>;
};
