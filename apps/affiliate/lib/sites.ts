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
    name: "PawSelect Picks",
    tagline: "Calmer pet-care choices for busy homes.",
    description: "Pet buying notes, comparison guides, and practical calculators for feeders, cameras, litter, beds, pet hair, and air quality.",
    domain: process.env.NEXT_PUBLIC_PET_SITE_URL ?? "https://pets.madabase.com",
    hostHints: ["pet", "paw"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Amazon is currently the site's only commissioned retailer. Recommendations are based on routine fit, specifications, cleaning effort, and trade-offs.",
    heroImage: "/images/affiliate/hero-pet-realistic.webp",
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
    domain: process.env.NEXT_PUBLIC_HOMEOFFICE_SITE_URL ?? "https://homeoffice.madabase.com",
    hostHints: ["homeoffice", "desk", "office"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Amazon is currently the site's only commissioned retailer. Recommendations are based on use-case fit, specifications, ergonomics, and long-term value.",
    heroImage: "/images/affiliate/hero-homeoffice-realistic.webp",
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
    name: "NestCheck Picks",
    tagline: "Clear baby gear choices for tired decision-makers.",
    description: "Baby gear buying notes, safety-minded guides, and planning tools for monitors, strollers, carriers, bottles, sleep, and diapers.",
    domain: process.env.NEXT_PUBLIC_BABY_SITE_URL ?? "https://baby.madabase.com",
    hostHints: ["baby", "nest"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Amazon is currently the site's only commissioned retailer. We keep safety notes, limitations, and fit guidance visible on buying pages.",
    heroImage: "/images/affiliate/hero-baby-realistic.webp",
    theme: {
      brand: "#846036",
      brandStrong: "#5d4226",
      brandSoft: "#f2eadf",
      accent: "#2f6f73",
      accentSoft: "#e2f4f2",
    },
    categories: [
      { slug: "sleep", name: "Sleep", description: "Monitors, sound machines, nursery setup, and routine basics." },
      { slug: "travel", name: "Travel", description: "Strollers, carriers, travel bags, and lightweight gear." },
      { slug: "feeding", name: "Feeding", description: "Bottles, sterilizers, pumps, and clean-up routines." },
    ],
  },
  network: {
    key: "network",
    name: "Signalwise Picks",
    tagline: "Cleaner home networks without the spec-sheet fog.",
    description: "Home network buying notes, router comparisons, mesh Wi-Fi guides, Ethernet planning tools, and practical setup checklists.",
    domain: process.env.NEXT_PUBLIC_NETWORK_SITE_URL ?? "https://network.madabase.com",
    hostHints: ["network", "wifi", "router", "signal"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Amazon is currently the site's only commissioned retailer. Recommendations are based on home layout, wired backhaul options, speed needs, device count, and setup trade-offs.",
    heroImage: "/images/affiliate/hero-network-realistic.webp",
    theme: {
      brand: "#255f8f",
      brandStrong: "#173f63",
      brandSoft: "#e4f1fb",
      accent: "#7a5a20",
      accentSoft: "#fff4dc",
    },
    categories: [
      { slug: "wifi", name: "Wi-Fi", description: "Mesh systems, routers, coverage planning, and wireless upgrades." },
      { slug: "wired", name: "Wired networking", description: "Ethernet switches, cables, adapters, and reliable wired paths." },
      { slug: "backup", name: "Backup power", description: "UPS planning for routers, modems, ONTs, and small network shelves." },
    ],
  },
  smarthome: {
    key: "smarthome",
    name: "Dwellwise Picks",
    tagline: "Smart-home choices that still work after setup day.",
    description: "Research-based smart lock, doorbell, thermostat, and home-automation comparisons with compatibility, subscription, wiring, and ecosystem checks kept visible.",
    domain: process.env.NEXT_PUBLIC_SMARTHOME_SITE_URL ?? "https://smarthome.madabase.com",
    hostHints: ["smarthome", "smart-home", "dwell"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Amazon is currently the site's only commissioned retailer. Recommendations are based on compatibility, installation requirements, privacy choices, subscriptions, and everyday control paths.",
    heroImage: "/images/affiliate/hero-smarthome-realistic.webp",
    theme: {
      brand: "#176b6b",
      brandStrong: "#114b56",
      brandSoft: "#dff4f1",
      accent: "#8b4d2f",
      accentSoft: "#fff0e7",
    },
    categories: [
      { slug: "access", name: "Smart access", description: "Smart locks, entry methods, door fit, hubs, and guest access." },
      { slug: "cameras", name: "Doorbells & cameras", description: "Video doorbells, local storage, subscriptions, and notification choices." },
      { slug: "climate", name: "Smart climate", description: "Thermostats, room sensors, HVAC compatibility, and energy controls." },
      { slug: "automation", name: "Automation basics", description: "Matter, Thread, Zigbee, hubs, and ecosystem planning." },
    ],
  },
  style: {
    key: "style",
    name: "Sideglance Style",
    tagline: "Wear the interesting thing. Keep the rest intentional.",
    description: "Practical styling notes for statement jewelry, character bags, hair accessories, scarves, socks, and expressive extras—judged by scale, comfort, materials, outfit fit, and return risk.",
    domain: process.env.NEXT_PUBLIC_STYLE_SITE_URL ?? "https://style.madabase.com",
    hostHints: ["style", "wear", "accessory"],
    disclosure: "As an Amazon Associate I earn from qualifying purchases. Amazon is currently the site's only commissioned retailer. Recommendations are based on stated materials, measurements, closure, carrying comfort, outfit versatility, and return risk.",
    heroImage: "/images/affiliate/hero-style-realistic.webp",
    theme: {
      brand: "#9a3655",
      brandStrong: "#65223b",
      brandSoft: "#fae8ef",
      accent: "#39706a",
      accentSoft: "#e3f3ef",
    },
    categories: [
      { slug: "jewelry", name: "Statement jewelry", description: "Novelty, mismatched, celestial, floral, and conversation-starting pieces." },
      { slug: "bags", name: "Expressive bags", description: "Character bags, unusual shapes, mini backpacks, and practical statement pieces." },
      { slug: "hair", name: "Hair accessories", description: "Sculptural clips, pearls, florals, butterflies, and playful finishing pieces." },
      { slug: "scarves", name: "Scarves & wraps", description: "Silk, satin, skinny, and multipurpose scarves for the neck, hair, bag, or waist." },
      { slug: "socks", name: "Statement socks", description: "Colorful food, fruit, cat, animal, and graphic socks that make basics less quiet." },
      { slug: "styling", name: "How to wear it", description: "Outfit formulas, scale checks, comfort notes, and ways to avoid costume territory." },
    ],
  },
};

export const siteKeys = Object.keys(sites) as SiteKey[];

function getEnvSite() {
  const envSite = process.env.NEXT_PUBLIC_AFFILIATE_SITE;

  return siteKeys.includes(envSite as SiteKey) ? sites[envSite as SiteKey] : null;
}

export function getSiteByKey(key: string | undefined | null) {
  return sites[siteKeys.includes(key as SiteKey) ? (key as SiteKey) : "pet"];
}

export function getSiteFromHost(host: string | null | undefined) {
  const normalized = (host ?? "").toLowerCase();
  const envSite = getEnvSite();

  if (envSite) {
    return envSite;
  }

  return siteKeys.map((key) => sites[key]).find((site) => site.hostHints.some((hint) => normalized.includes(hint))) ?? sites.pet;
}

function getRequestDomain(headerList: Headers) {
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return null;

  const forwardedProto = headerList.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isLocalHost = host.includes("localhost") || host.startsWith("127.") || host.startsWith("[::1]");
  const protocol = isLocalHost ? (forwardedProto ?? "http") : "https";

  return `${protocol}://${host}`;
}

export async function getCurrentSite() {
  const envSite = getEnvSite();
  if (envSite) return envSite;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const site = getSiteFromHost(host);
  const requestDomain = getRequestDomain(headerList);

  return requestDomain ? { ...site, domain: requestDomain } : site;
}
