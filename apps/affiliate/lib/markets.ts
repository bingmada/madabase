import type { MarketKey, SiteKey } from "./types";

export type MarketProfile = {
  key: MarketKey;
  routeSlug: "en-gb" | "en-ca" | "de-de" | "nl-nl";
  languageTag: "en-GB" | "en-CA" | "de-DE" | "nl-NL";
  hrefLang: "en-GB" | "en-CA" | "de-DE" | "nl-NL";
  countryCode: "GB" | "CA" | "DE" | "NL";
  countryName: string;
  localName: string;
  amazonStore: string;
  currency: "GBP" | "CAD" | "EUR";
  labels: {
    edition: string;
    quickAnswer: string;
    featuredDecision: string;
    buyerChecks: string;
    buyerChecksIntro: string;
    evidence: string;
    evidenceIntro: string;
    related: string;
    originalEdition: string;
    marketHome: string;
    updated: string;
    cta: string;
    oneLink: string;
    otherEditions: string;
    currentEdition: string;
    categories: string;
  };
};

export const markets: Record<MarketKey, MarketProfile> = {
  gb: {
    key: "gb",
    routeSlug: "en-gb",
    languageTag: "en-GB",
    hrefLang: "en-GB",
    countryCode: "GB",
    countryName: "United Kingdom",
    localName: "United Kingdom",
    amazonStore: "Amazon UK",
    currency: "GBP",
    labels: {
      edition: "United Kingdom edition",
      quickAnswer: "Quick answer for UK buyers",
      featuredDecision: "Featured UK buying decision",
      buyerChecks: "Checks before buying in the UK",
      buyerChecksIntro: "Confirm the regional model and the complete UK checkout offer rather than assuming a US listing is identical.",
      evidence: "Product and source evidence",
      evidenceIntro: "The product identity and editorial evidence come from the main research page; regional availability remains a checkout check.",
      related: "Continue the research",
      originalEdition: "Read the original US research page",
      marketHome: "UK edition home",
      updated: "Updated",
      cta: "Check the matching offer on Amazon",
      oneLink: "Amazon OneLink may redirect this US Associates link to the matching local offer. Confirm the UK model, seller, plug, bundle, delivery, warranty and return terms before ordering.",
      otherEditions: "Other country editions",
      currentEdition: "Current edition",
      categories: "What UK buyers should compare",
    },
  },
  ca: {
    key: "ca",
    routeSlug: "en-ca",
    languageTag: "en-CA",
    hrefLang: "en-CA",
    countryCode: "CA",
    countryName: "Canada",
    localName: "Canada",
    amazonStore: "Amazon Canada",
    currency: "CAD",
    labels: {
      edition: "Canada edition",
      quickAnswer: "Quick answer for Canadian buyers",
      featuredDecision: "Featured Canadian buying decision",
      buyerChecks: "Checks before buying in Canada",
      buyerChecksIntro: "Confirm the Canadian model and complete landed offer rather than assuming a US listing, warranty or bundle is identical.",
      evidence: "Product and source evidence",
      evidenceIntro: "The product identity and editorial evidence come from the main research page; Canadian availability remains a checkout check.",
      related: "Continue the research",
      originalEdition: "Read the original US research page",
      marketHome: "Canada edition home",
      updated: "Updated",
      cta: "Check the matching offer on Amazon",
      oneLink: "Amazon OneLink may redirect this US Associates link to the matching local offer. Confirm the Canadian model, seller, bundle, delivery, taxes, warranty and return terms before ordering.",
      otherEditions: "Other country editions",
      currentEdition: "Current edition",
      categories: "What Canadian buyers should compare",
    },
  },
  de: {
    key: "de",
    routeSlug: "de-de",
    languageTag: "de-DE",
    hrefLang: "de-DE",
    countryCode: "DE",
    countryName: "Germany",
    localName: "Deutschland",
    amazonStore: "Amazon Deutschland",
    currency: "EUR",
    labels: {
      edition: "Ausgabe für Deutschland",
      quickAnswer: "Kurzantwort für Käufer in Deutschland",
      featuredDecision: "Ausgewählte Kaufentscheidung",
      buyerChecks: "Vor dem Kauf in Deutschland prüfen",
      buyerChecksIntro: "Prüfen Sie das regionale Modell und das vollständige deutsche Angebot, statt von einer identischen US-Version auszugehen.",
      evidence: "Produkt- und Quellenbelege",
      evidenceIntro: "Produktidentität und redaktionelle Belege stammen aus der Hauptrecherche; die regionale Verfügbarkeit muss beim Kauf geprüft werden.",
      related: "Recherche fortsetzen",
      originalEdition: "Englische Originalrecherche öffnen",
      marketHome: "Startseite Deutschland",
      updated: "Aktualisiert",
      cta: "Passendes Angebot bei Amazon prüfen",
      oneLink: "Amazon OneLink kann diesen US-Associates-Link zum passenden lokalen Angebot weiterleiten. Prüfen Sie deutsches Modell, Verkäufer, Stecker, Lieferumfang, Versand, Garantie und Rückgabe.",
      otherEditions: "Weitere Länderausgaben",
      currentEdition: "Aktuelle Ausgabe",
      categories: "Worauf Käufer in Deutschland achten sollten",
    },
  },
  nl: {
    key: "nl",
    routeSlug: "nl-nl",
    languageTag: "nl-NL",
    hrefLang: "nl-NL",
    countryCode: "NL",
    countryName: "Netherlands",
    localName: "Nederland",
    amazonStore: "Amazon Nederland",
    currency: "EUR",
    labels: {
      edition: "Editie voor Nederland",
      quickAnswer: "Kort antwoord voor kopers in Nederland",
      featuredDecision: "Uitgelichte aankoopbeslissing",
      buyerChecks: "Controleren vóór aankoop in Nederland",
      buyerChecksIntro: "Controleer het regionale model en het volledige Nederlandse aanbod; ga er niet van uit dat de Amerikaanse uitvoering identiek is.",
      evidence: "Product- en brononderbouwing",
      evidenceIntro: "De productidentiteit en redactionele onderbouwing komen uit het hoofdonderzoek; regionale beschikbaarheid blijft een controle bij aankoop.",
      related: "Ga verder met het onderzoek",
      originalEdition: "Open het oorspronkelijke Engelse onderzoek",
      marketHome: "Startpagina Nederland",
      updated: "Bijgewerkt",
      cta: "Controleer het passende aanbod bij Amazon",
      oneLink: "Amazon OneLink kan deze Amerikaanse Associates-link doorsturen naar een passend lokaal aanbod. Controleer Nederlands model, verkoper, stekker, bundel, levering, garantie en retourvoorwaarden.",
      otherEditions: "Andere landedities",
      currentEdition: "Huidige editie",
      categories: "Wat Nederlandse kopers moeten vergelijken",
    },
  },
};

export const marketKeys = Object.keys(markets) as MarketKey[];
export const marketRouteSlugs = marketKeys.map((key) => markets[key].routeSlug);
export const marketSiteKeys: SiteKey[] = ["network", "smarthome", "homeoffice", "baby"];

export function getMarketByKey(key: string | undefined | null) {
  return marketKeys.includes(key as MarketKey) ? markets[key as MarketKey] : undefined;
}

export function getMarketByRouteSlug(routeSlug: string | undefined | null) {
  return marketKeys.map((key) => markets[key]).find((market) => market.routeSlug === routeSlug);
}

export function supportsMarketEditions(site: SiteKey) {
  return marketSiteKeys.includes(site);
}

export function marketPath(market: MarketProfile, basePath = "/") {
  const normalized = basePath === "/" ? "" : basePath.startsWith("/") ? basePath : `/${basePath}`;
  return `/${market.routeSlug}${normalized}`;
}

export function marketHomeAlternates(domain: string) {
  return {
    "en-US": new URL("/", domain).toString(),
    ...Object.fromEntries(
      marketKeys.map((key) => {
        const market = markets[key];
        return [market.hrefLang, new URL(marketPath(market), domain).toString()];
      }),
    ),
    "x-default": new URL("/", domain).toString(),
  };
}
