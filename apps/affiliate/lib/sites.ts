import { headers } from "next/headers";
import type { SiteKey } from "./types";

export type SiteConfig = {
  key: SiteKey;
  name: string;
  tagline: string;
  description: string;
  domain: string;
  hostHints: string[];
  disclosure: string;
  heroImage: string;
  theme: {
    brand: string;
    brandStrong: string;
    brandSoft: string;
    accent: string;
    accentSoft: string;
  };
  categories: Array<{ slug: string; name: string; description: string }>;
};

export const sites: Record<SiteKey, SiteConfig> = {
  pet: {
    key: "pet",
    name: "PawSelect Lab",
    tagline: "Evidence-led picks for calmer pet care.",
    description: "Pet product reviews, comparison guides, and practical calculators for feeders, cameras, litter, beds, and air quality.",
    domain: process.env.NEXT_PUBLIC_PET_SITE_URL ?? "https://pets.example.com",
    hostHints: ["pet", "paw"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. PawSelect Lab may also earn commissions from other retailer links. Recommendations are based on fit, evidence, and trade-offs, not commission size.",
    heroImage: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=1600&q=80",
    theme: {
      brand: "#126a5f",
      brandStrong: "#0d4f47",
      brandSoft: "#dff5ef",
      accent: "#a8551a",
      accentSoft: "#fff0df",
    },
    categories: [
      { slug: "feeding", name: "Feeding", description: "Automatic feeders, bowls, fountains, and routines." },
      { slug: "home-care", name: "Home care", description: "Litter, odor, pet hair, cameras, and air quality." },
      { slug: "comfort", name: "Comfort", description: "Beds, crates, carriers, and daily comfort gear." },
    ],
  },
  homeoffice: {
    key: "homeoffice",
    name: "Deskwise Picks",
    tagline: "Sharper home office decisions, fewer regret buys.",
    description: "Home office buying notes, ergonomic comparisons, and setup calculators for desks, chairs, lights, monitor arms, and audio.",
    domain: process.env.NEXT_PUBLIC_HOMEOFFICE_SITE_URL ?? "https://homeoffice.example.com",
    hostHints: ["homeoffice", "desk", "office"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Deskwise Picks may also earn commissions from other retailer links. Recommendations are based on use-case fit, specifications, ergonomics, and long-term value.",
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    theme: {
      brand: "#245b75",
      brandStrong: "#183e51",
      brandSoft: "#e2f1f7",
      accent: "#8d5a22",
      accentSoft: "#fff2df",
    },
    categories: [
      { slug: "desks", name: "Desks", description: "Standing desks, compact desks, converters, and work surfaces." },
      { slug: "ergonomics", name: "Ergonomics", description: "Chairs, monitor arms, footrests, and posture helpers." },
      { slug: "meetings", name: "Meetings", description: "Lighting, audio, webcams, and video call upgrades." },
    ],
  },
  baby: {
    key: "baby",
    name: "NestCheck Baby",
    tagline: "Clear baby gear guidance for tired decision-makers.",
    description: "Baby gear reviews, safety-minded buying guides, and planning tools for monitors, strollers, carriers, bottles, and diapers.",
    domain: process.env.NEXT_PUBLIC_BABY_SITE_URL ?? "https://baby.example.com",
    hostHints: ["baby", "nest"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. NestCheck Baby may also earn commissions from other retailer links. We keep safety notes, limitations, and fit guidance visible on buying pages.",
    heroImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=80",
    theme: {
      brand: "#846036",
      brandStrong: "#5d4226",
      brandSoft: "#f2eadf",
      accent: "#2f6f73",
      accentSoft: "#e2f4f2",
    },
    categories: [
      { slug: "sleep", name: "Sleep", description: "Monitors, safe sleep accessories, sound, and nursery basics." },
      { slug: "travel", name: "Travel", description: "Strollers, carriers, travel bags, and lightweight gear." },
      { slug: "feeding", name: "Feeding", description: "Bottles, sterilizers, pumps, and clean-up routines." },
    ],
  },
};

export const siteKeys = Object.keys(sites) as SiteKey[];

export function getSiteByKey(key: string | undefined | null) {
  return sites[siteKeys.includes(key as SiteKey) ? (key as SiteKey) : "pet"];
}

export function getSiteFromHost(host: string | null | undefined) {
  const normalized = (host ?? "").toLowerCase();
  const envSite = process.env.NEXT_PUBLIC_AFFILIATE_SITE;

  if (envSite && siteKeys.includes(envSite as SiteKey)) {
    return sites[envSite as SiteKey];
  }

  return siteKeys.map((key) => sites[key]).find((site) => site.hostHints.some((hint) => normalized.includes(hint))) ?? sites.pet;
}

export async function getCurrentSite() {
  const headerList = await headers();
  return getSiteFromHost(headerList.get("host"));
}
