export type SiteKey = "pet" | "homeoffice" | "baby" | "network" | "smarthome" | "style" | "costume";

export type MarketKey = "gb" | "ca" | "de" | "nl";
export type AmazonMarketKey = "us" | MarketKey;

export type PublicationStatus = "published" | "draft";

type Publishable = {
  publicationStatus?: PublicationStatus;
  releaseCandidate?: string;
  sitemapExcluded?: boolean;
};

export type Score = {
  label: string;
  value: number;
};

export type EvidenceMode = "hands-on" | "research-synthesis" | "official-spec";

export type ExternalTestEvidence = {
  source: string;
  url: string;
  date?: string;
  testSetup: string;
  result: string;
  interpretation: string;
  limitation: string;
};

export type Product = Publishable & {
  slug: string;
  site: SiteKey;
  seoTitle?: string;
  updatedAt?: string;
  evidenceMode?: EvidenceMode;
  researchNote?: string;
  externalTests?: ExternalTestEvidence[];
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
  imageAlt?: string;
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
  price?: number;
};

export type Roundup = Publishable & {
  slug: string;
  site: SiteKey;
  seoTitle?: string;
  updatedAt?: string;
  title: string;
  dek: string;
  category: string;
  intent: string;
  intro?: string;
  sections?: Array<{ heading: string; body: string }>;
  decisionGuide?: Array<{ label: string; detail: string }>;
  comparisonTable?: {
    title: string;
    columns: string[];
    rows: Array<{ label: string; values: string[] }>;
  };
  methodology: string[];
  productSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type Guide = Publishable & {
  slug: string;
  site: SiteKey;
  title: string;
  dek: string;
  category: string;
  updatedAt?: string;
  image?: string;
  imageAlt?: string;
  searchQuestion?: string;
  quickAnswer?: string;
  editorialMethod?: string[];
  communityEvidence?: Array<{
    sourceName: string;
    title: string;
    url: string;
    note: string;
  }>;
  governance?: {
    decision: "keep" | "rewrite" | "merge" | "retire";
    independentDemand: string;
    distinctFrom: string;
    benchmark: string;
  };
  comparisonTable?: {
    title: string;
    columns: string[];
    rows: Array<{ label: string; values: string[] }>;
  };
  sources?: Array<{ name: string; url: string; note?: string }>;
  sections: Array<{ heading: string; body: string }>;
  relatedRoundups: string[];
  relatedProducts?: string[];
  relatedGuides?: string[];
  familySlug?: string;
  familyRole?: "buying" | "comparison" | "fit" | "ownership" | "workflow" | "safety";
};

export type Tool = Publishable & {
  slug: string;
  site: SiteKey;
  title: string;
  dek: string;
  category: string;
  updatedAt?: string;
  kind: "feeding" | "desk" | "diapers" | "wifi" | "air" | "mesh" | "matter";
  sections?: Array<{ heading: string; body: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  relatedRoundups: string[];
};

export type StaticPage = {
  slug: string;
  title: string;
  dek: string;
  sections: Array<{ heading: string; body: string }>;
};
