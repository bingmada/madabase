import { marketKeys, marketPath, markets, type MarketProfile } from "./markets";
import type { MarketKey, SiteKey } from "./types";

export type MarketContentRoute = "reviews" | "guides" | "best";

export type MarketHomeCopy = {
  eyebrow: string;
  title: string;
  dek: string;
  intro: string;
  focus: string[];
};

export type LocalizedMarketVariant = {
  title: string;
  dek: string;
  quickAnswer: string;
  sections: Array<{ heading: string; body: string }>;
  checkoutChecks: string[];
};

export type LocalizedMarketPage = {
  site: SiteKey;
  route: MarketContentRoute;
  slug: string;
  primaryProductSlug: string;
  relatedPaths: Array<{ label: string; path: string }>;
  updatedAt: string;
  variants: Record<MarketKey, LocalizedMarketVariant>;
};

export const marketHomeCopy: Record<MarketKey, Partial<Record<SiteKey, MarketHomeCopy>>> = {
  gb: {
    network: {
      eyebrow: "Home-network research for the UK",
      title: "Choose mesh Wi-Fi and wired-network gear that matches a UK home and checkout offer.",
      dek: "UK-focused decision notes for regional Wi-Fi hardware, multi-gig ports, wired backhaul, power supplies, packs and warranty terms.",
      intro: "The core networking evidence stays shared with Signalwise Picks, while this edition keeps regional model numbers, UK plugs, broadband equipment and Amazon UK checkout differences visible.",
      focus: ["Regional model and Wi-Fi channel support", "UK plug and included power adapters", "Pack count, Ethernet ports and wired backhaul", "GBP price, seller, delivery, warranty and returns"],
    },
    smarthome: {
      eyebrow: "Smart-home research for the UK",
      title: "Check the regional model, wiring and ecosystem before adding another smart-home device.",
      dek: "UK-focused smart-home guidance covering Matter, Thread, Zigbee, hubs, subscriptions, wiring, plugs and local fallback controls.",
      intro: "A product name can span several regional versions. This edition keeps the UK model, power or wiring path, supported ecosystem and complete Amazon UK offer in the decision.",
      focus: ["UK model, radio support and ecosystem", "230V power, plug or fixed wiring requirements", "Hub, controller and Thread border-router roles", "Subscription, seller, warranty and fallback control"],
    },
    homeoffice: {
      eyebrow: "Home-office research for the UK",
      title: "Build a UK home office around measured fit, safe power and a realistic return path.",
      dek: "UK-focused desk, walking-pad and ergonomic decisions with metric dimensions, 230V power, floor protection, delivery and returns in view.",
      intro: "Body-fit and room-fit purchases are expensive to reverse. This edition keeps the physical measurements and UK checkout configuration ahead of feature lists.",
      focus: ["Metric room, desk and equipment measurements", "UK plug, voltage and cable route", "Floor, neighbour and shared-room noise", "Delivery access, assembly, warranty and returns"],
    },
    baby: {
      eyebrow: "Baby-gear research for the UK",
      title: "Compare baby gear using the current UK instructions, exact model and real care routine.",
      dek: "UK-focused carrier and baby-gear guidance with stated limits, developmental checks, regional manuals, materials, cleaning and returns visible.",
      intro: "Safety and fit depend on the exact instructions and the individual child, not a marketplace image. This edition preserves those checks while verifying the UK offer.",
      focus: ["Current UK instructions and exact model", "Age, weight and developmental requirements", "Caregiver fit, materials and cleaning routine", "Seller, included pieces, warranty and returns"],
    },
  },
  ca: {
    network: {
      eyebrow: "Home-network research for Canada",
      title: "Choose mesh Wi-Fi and wired-network gear for the Canadian model, home and ISP setup.",
      dek: "Canadian decision notes for regional hardware, multi-gig ports, wired backhaul, packs, power supplies, shipping and warranty.",
      intro: "The main networking research remains shared, while this edition keeps Canadian model identity, ISP gateway constraints, CAD checkout and regional support visible.",
      focus: ["Canadian model and supported wireless bands", "ISP gateway, modem or fibre-terminal layout", "Pack count, Ethernet ports and wired backhaul", "CAD price, seller, shipping, taxes, warranty and returns"],
    },
    smarthome: {
      eyebrow: "Smart-home research for Canada",
      title: "Match smart-home gear to the Canadian model, wiring, ecosystem and local fallback.",
      dek: "Canadian smart-home guidance covering Matter, Thread, Zigbee, hubs, subscriptions, wiring, climate and checkout differences.",
      intro: "Canadian and US products can look identical while bundles, certifications, support and service availability differ. This edition treats the local listing as a separate verification step.",
      focus: ["Canadian model and supported ecosystem", "Power, wiring and installation requirements", "Hub, controller and Thread border-router roles", "Cloud service, subscription, shipping and warranty"],
    },
    homeoffice: {
      eyebrow: "Home-office research for Canada",
      title: "Plan the workstation in metric dimensions, then verify the Canadian power and delivery offer.",
      dek: "Canadian desk, walking-pad and ergonomic decisions with room fit, floor protection, noise, CAD pricing, delivery and returns in view.",
      intro: "Large or body-fit equipment needs a complete plan before checkout. This edition keeps dimensions, household impact and Canadian seller terms ahead of convenience features.",
      focus: ["Metric equipment and room measurements", "Power, outlet and cable path", "Floor protection, noise and winter indoor use", "CAD price, delivery access, warranty and returns"],
    },
    baby: {
      eyebrow: "Baby-gear research for Canada",
      title: "Compare baby gear using current Canadian instructions, exact limits and everyday routines.",
      dek: "Canadian carrier and baby-gear guidance with the exact model, developmental requirements, materials, cleaning, shipping and returns visible.",
      intro: "Fit and safe use come from the current manufacturer instructions and the individual child. This edition keeps those limits visible and verifies the Canadian offer separately.",
      focus: ["Current Canadian instructions and exact model", "Age, weight and developmental requirements", "Caregiver fit, climate, materials and cleaning", "Seller, bundle, shipping, warranty and returns"],
    },
  },
  de: {
    network: {
      eyebrow: "Heimnetz-Recherche für Deutschland",
      title: "Mesh-WLAN und Netzwerkgeräte passend zu deutschem Modell, Anschluss und Zuhause auswählen.",
      dek: "Kaufhilfen zu regionaler Hardware, Multi-Gigabit-Ports, Ethernet-Backhaul, Netzteilen, Sets, Versand und Garantie.",
      intro: "Die technische Hauptrecherche bleibt gemeinsam. Diese Ausgabe ergänzt Modellkennung, Stecker, Router- oder Modembetrieb und das konkrete Angebot bei Amazon Deutschland.",
      focus: ["Deutsches beziehungsweise EU-Modell und Funkunterstützung", "Schuko-Stecker, Netzteil und 230V-Versorgung", "DSL-, Kabel- oder Glasfaser-Routeraufbau", "Set-Größe, Verkäufer, Versand, Garantie und Rückgabe"],
    },
    smarthome: {
      eyebrow: "Smart-Home-Recherche für Deutschland",
      title: "Regionales Modell, Stromversorgung und Ökosystem vor dem Smart-Home-Kauf prüfen.",
      dek: "Deutsche Kaufhilfen zu Matter, Thread, Zigbee, Hubs, Abos, Verkabelung, Steckern und lokalen Bedienwegen.",
      intro: "Gleiche Produktnamen können unterschiedliche regionale Versionen bezeichnen. Diese Ausgabe prüft deshalb Modell, 230V-Pfad, Funkrollen und das deutsche Verkaufsangebot getrennt.",
      focus: ["EU-Modell, Funkstandard und Ökosystem", "Schuko-Stecker, 230V oder feste Verkabelung", "Matter-Controller, Hub und Thread Border Router", "Abo, Datenschutzoptionen, Verkäufer und Garantie"],
    },
    homeoffice: {
      eyebrow: "Homeoffice-Recherche für Deutschland",
      title: "Arbeitsplatzgeräte nach Maßen, Strom, Geräusch und Rückgabeweg auswählen.",
      dek: "Deutsche Kaufhilfen für Schreibtische, Walking Pads und Ergonomie mit metrischen Maßen, 230V, Boden, Lieferung und Rückgabe.",
      intro: "Große und körperbezogene Produkte verursachen hohe Fehlkaufkosten. Diese Ausgabe stellt reale Maße und deutsche Angebotsbedingungen vor zusätzliche Funktionen.",
      focus: ["Metrische Maße von Raum, Tisch und Gerät", "Schuko-Stecker, 230V und sichere Kabelführung", "Boden, Trittschall und Nutzung in Mietwohnungen", "Lieferweg, Aufbau, Garantie und Rückgabe"],
    },
    baby: {
      eyebrow: "Babyartikel-Recherche für Deutschland",
      title: "Babyartikel nach aktueller Anleitung, Entwicklungsstand und tatsächlicher Passform vergleichen.",
      dek: "Deutsche Trage- und Babyausstattungs-Hilfen mit Modell, Grenzwerten, Materialien, Reinigung, Verkäufer und Rückgabe.",
      intro: "Sichere Nutzung und Passform hängen von der aktuellen Anleitung und vom einzelnen Kind ab. Diese Ausgabe hält diese Grenzen sichtbar und prüft das deutsche Angebot separat.",
      focus: ["Aktuelle deutsche beziehungsweise EU-Anleitung", "Gewicht, Größe und Entwicklungsanforderungen", "Passform für Kind und tragende Person", "Material, Reinigung, Lieferumfang und Rückgabe"],
    },
  },
  nl: {
    network: {
      eyebrow: "Thuisnetwerkonderzoek voor Nederland",
      title: "Kies mesh-wifi en netwerkapparatuur voor het Nederlandse model, de aansluiting en de woning.",
      dek: "Koophulp voor regionale hardware, multi-gigabitpoorten, ethernetbackhaul, voedingen, pakketten, levering en garantie.",
      intro: "Het technische hoofdonderzoek blijft gedeeld. Deze editie voegt controle van de EU-uitvoering, stekker, routeropstelling en het concrete aanbod bij Amazon Nederland toe.",
      focus: ["Nederlands of EU-model en ondersteunde wifi-banden", "Type-F-stekker, voeding en 230V", "Glasvezel-, kabel- of DSL-routeropstelling", "Pakketgrootte, verkoper, levering, garantie en retour"],
    },
    smarthome: {
      eyebrow: "Smart-homeonderzoek voor Nederland",
      title: "Controleer regionaal model, voeding en ecosysteem vóór een smart-homeaankoop.",
      dek: "Nederlandse koophulp voor Matter, Thread, Zigbee, hubs, abonnementen, bedrading, stekkers en lokale bediening.",
      intro: "Dezelfde productnaam kan meerdere regionale uitvoeringen omvatten. Deze editie controleert daarom model, 230V-aansluiting, netwerkrollen en Nederlands verkoopaanbod afzonderlijk.",
      focus: ["EU-model, radiostandaard en ecosysteem", "Type-F-stekker, 230V of vaste bedrading", "Matter-controller, hub en Thread border router", "Abonnement, bediening bij storing, verkoper en garantie"],
    },
    homeoffice: {
      eyebrow: "Thuiswerkonderzoek voor Nederland",
      title: "Kies werkplekapparatuur op maatvoering, voeding, geluid en een haalbare retourroute.",
      dek: "Nederlandse koophulp voor bureaus, walking pads en ergonomie met metrische maten, 230V, vloer, levering en retour in beeld.",
      intro: "Grote producten en lichaamsgebonden ergonomie zijn lastig terug te draaien. Deze editie zet fysieke passing en Nederlandse aanbiedingsvoorwaarden vóór extra functies.",
      focus: ["Metrische maten van kamer, bureau en apparaat", "Type-F-stekker, 230V en kabelroute", "Vloerbescherming en contactgeluid in gedeelde woningen", "Bezorgroute, montage, garantie en retour"],
    },
    baby: {
      eyebrow: "Onderzoek naar babyartikelen voor Nederland",
      title: "Vergelijk babyartikelen met de actuele handleiding, ontwikkelingsfase en dagelijkse routine.",
      dek: "Nederlandse koophulp voor draagzakken en babyartikelen met model, grenzen, materialen, reiniging, verkoper en retour zichtbaar.",
      intro: "Veilig gebruik en passing volgen uit de actuele instructies en het individuele kind. Deze editie houdt die grenzen zichtbaar en controleert het Nederlandse aanbod apart.",
      focus: ["Actuele Nederlandse of EU-handleiding", "Gewicht, lengte en ontwikkelingsvereisten", "Passing voor kind en drager", "Materiaal, reiniging, pakketinhoud en retour"],
    },
  },
};

export const localizedMarketPages: LocalizedMarketPage[] = [
  {
    site: "network",
    route: "reviews",
    slug: "tp-link-deco-be67-wifi-7-mesh",
    primaryProductSlug: "tp-link-deco-be67-wifi-7-mesh",
    updatedAt: "July 27, 2026",
    relatedPaths: [
      { label: "Deco BE63 vs BE67 vs BE85 buying guide", path: "/guides/deco-be63-vs-be67-vs-be85-buying-guide" },
      { label: "Deco BE67 vs BE63 comparison", path: "/best/tp-link-deco-be67-vs-be63" },
      { label: "Deco BE63 research page", path: "/reviews/tp-link-deco-be63-wifi-7-mesh" },
    ],
    variants: {
      gb: {
        title: "TP-Link Deco BE67 review UK: 10GbE, pack size and regional checks",
        dek: "A UK-focused Deco BE67 decision guide covering the multi-gig path, two-pack identity, regional hardware, power supply, seller and warranty checks.",
        quickAnswer: "Buy the BE67 only when its 10GbE path, 6GHz capacity and two-node layout solve a measured UK home-network bottleneck. The BE63 is usually better value when the internet, switches and wired clients remain at 2.5GbE.",
        sections: [
          { heading: "Match the UK hardware and pack", body: "Confirm that the local offer is the intended Deco BE67 regional version and that the box contains two nodes. Similar Deco names can represent different speed classes, port layouts and packs, so compare the model label and included power adapters rather than the product photo." },
          { heading: "Build the complete multi-gig path first", body: "A 10GbE port matters only when the modem or ONT, router mode, switch, cabling and wired client can use it. For ordinary gigabit broadband, placement and Ethernet backhaul often improve the home more than paying for unused headline capacity." },
          { heading: "Treat support and subscriptions as part of the offer", body: "Check the Amazon UK seller, delivery, return window, regional warranty and which security or parental-control features require a paid service. Keep the existing system until the new pack is updated and stable." },
        ],
        checkoutChecks: ["BE67 regional model and two-pack quantity", "UK plug and power adapters for both nodes", "10GbE and 2.5GbE port layout", "GBP price, seller, delivery, warranty and return window"],
      },
      ca: {
        title: "TP-Link Deco BE67 review Canada: 10GbE, ISP fit and local offer checks",
        dek: "A Canadian Deco BE67 decision guide covering the multi-gig path, pack identity, ISP gateway, regional hardware, CAD checkout and warranty.",
        quickAnswer: "Choose the BE67 when a real Canadian multi-gig internet or wired-backhaul path can use its 10GbE connection and the two-node layout matches the home. Choose a lower Deco tier when coverage or placement is the actual problem.",
        sections: [
          { heading: "Confirm the Canadian model and bundle", body: "Verify the regional model label, number of nodes, port layout and included power supplies on the Canadian offer. Do not compare price against a US pack until quantity, hardware and support eligibility match." },
          { heading: "Map the ISP gateway and wired path", body: "Decide whether the ISP gateway remains in router mode or whether the Deco will own routing. Multi-gig value depends on every link from modem or fibre terminal through switches and cabling to a capable client." },
          { heading: "Price the complete Canadian checkout", body: "Compare CAD price, seller, shipping, applicable taxes, return window and regional warranty. A cheaper imported offer can become worse value when support or returns cross a border." },
        ],
        checkoutChecks: ["Canadian BE67 model and node quantity", "ISP gateway or fibre-terminal operating plan", "10GbE path, switch and cabling readiness", "CAD price, seller, shipping, taxes, warranty and returns"],
      },
      de: {
        title: "TP-Link Deco BE67 Test & Kaufberatung Deutschland: 10GbE, Set und EU-Modell",
        dek: "Deutsche Entscheidungshilfe zum Deco BE67 mit Multi-Gigabit-Pfad, Set-Größe, regionaler Hardware, Netzteilen, Verkäufer und Garantie.",
        quickAnswer: "Das BE67 lohnt sich, wenn der 10GbE-Pfad, 6GHz und zwei Knoten einen gemessenen Engpass lösen. Bei einem 2,5GbE- oder Gigabit-Netz ist das BE63 häufig wirtschaftlicher; Platzierung und Ethernet-Backhaul bleiben wichtiger als die maximale Werbegeschwindigkeit.",
        sections: [
          { heading: "EU-Modell und Set eindeutig zuordnen", body: "Prüfen Sie Modellbezeichnung, Anzahl der Knoten, Portanordnung und beide Netzteile im deutschen Angebot. Ähnliche Deco-Namen können eine andere Geschwindigkeitsklasse oder Ausstattung bezeichnen." },
          { heading: "Internetanschluss und Multi-Gigabit-Kette planen", body: "Legen Sie fest, ob ein vorhandener DSL-, Kabel- oder Glasfaser-Router weiter routet oder das Deco-System diese Aufgabe übernimmt. 10GbE bringt nur dann Nutzen, wenn Anschlussgerät, Switch, Kabel und Endgerät den Pfad unterstützen." },
          { heading: "Deutsches Gesamtangebot vergleichen", body: "Vergleichen Sie Euro-Preis, Verkäufer, Lieferzeit, Rückgabefrist und regionale Garantie. Prüfen Sie außerdem, welche Sicherheits- oder Jugendschutzfunktionen nach einer Testphase kostenpflichtig werden." },
        ],
        checkoutChecks: ["Deco BE67 als EU-Modell und richtige Set-Größe", "Schuko-Netzteile für alle Knoten", "Routermodus, 10GbE-Pfad, Switch und Verkabelung", "Euro-Preis, Verkäufer, Versand, Garantie und Rückgabe"],
      },
      nl: {
        title: "TP-Link Deco BE67 review Nederland: 10GbE, pakket en EU-model",
        dek: "Nederlandse beslisgids voor de Deco BE67 met multi-gigabitpad, pakketgrootte, regionale hardware, voedingen, verkoper en garantie.",
        quickAnswer: "Kies de BE67 wanneer het 10GbE-pad, 6GHz en twee nodes een gemeten knelpunt oplossen. Bij gigabit of 2,5GbE is de BE63 vaak voordeliger; plaatsing en ethernetbackhaul leveren meestal eerder winst op.",
        sections: [
          { heading: "Controleer EU-model en pakketinhoud", body: "Vergelijk modelnummer, aantal nodes, poortindeling en voedingen van het Nederlandse aanbod. Bijna gelijke Deco-namen kunnen een andere snelheidsklasse, hardware of pakketgrootte aanduiden." },
          { heading: "Plan glasvezel, routermodus en het volledige pad", body: "Bepaal of de bestaande providerrouter blijft routeren of de Deco deze rol overneemt. Een 10GbE-poort is pas nuttig wanneer modem of ONT, switch, bekabeling en een bedraad apparaat dezelfde snelheid aankunnen." },
          { heading: "Vergelijk het volledige Nederlandse aanbod", body: "Controleer europrijs, verkoper, bezorging, retourtermijn en regionale garantie. Bekijk ook welke beveiligings- of ouderlijk-toezichtfuncties na een proefperiode betaald worden." },
        ],
        checkoutChecks: ["Deco BE67 als EU-model en juiste pakketgrootte", "Type-F-voedingen voor alle nodes", "Routermodus, 10GbE-pad, switch en bekabeling", "Europrijs, verkoper, levering, garantie en retour"],
      },
    },
  },
  {
    site: "smarthome",
    route: "guides",
    slug: "matter-controller-vs-thread-border-router",
    primaryProductSlug: "aqara-hub-m3",
    updatedAt: "July 27, 2026",
    relatedPaths: [
      { label: "Matter vs Thread vs Zigbee guide", path: "/guides/matter-vs-thread-vs-zigbee" },
      { label: "Aqara Hub M3 research page", path: "/reviews/aqara-hub-m3" },
      { label: "Matter starter-kit comparison", path: "/best/matter-starter-kit-hub-sensor-smart-plug" },
    ],
    variants: {
      gb: {
        title: "Matter controller vs Thread border router: UK buying guide",
        dek: "A UK-focused explanation of the two roles, regional hub versions, ecosystem ownership and the checks that prevent failed Matter-over-Thread setup.",
        quickAnswer: "A Matter controller manages devices inside an ecosystem; a Thread border router connects Thread devices to the wider IP network. Some UK hubs provide both roles, but generation, software, account and Thread credentials still need to match.",
        sections: [
          { heading: "Buy the missing role, not another logo", body: "List the controllers and border routers already in the home before buying a hub. A Matter-over-Wi-Fi device needs a controller but not Thread, while a Matter-over-Thread device needs both roles somewhere in the chosen ecosystem." },
          { heading: "Generation and regional version matter", body: "A product family can contain generations with different Thread hardware. Confirm the exact UK model, power arrangement, current software support and whether the advertised role works in the ecosystem the household actually uses." },
          { heading: "Keep recovery and local control visible", body: "Record which account owns the home, keep hubs powered and avoid mixing setup attempts across several ecosystems. Check what remains controllable during an internet outage and whether any advanced feature needs a subscription." },
        ],
        checkoutChecks: ["Exact UK hub generation and regional model", "Matter-controller and Thread border-router roles", "Chosen ecosystem, account and software requirements", "Plug, seller, delivery, subscription, warranty and returns"],
      },
      ca: {
        title: "Matter controller vs Thread border router: Canadian buying guide",
        dek: "A Canadian explanation of the two roles, hub generation, ecosystem ownership and checks that prevent failed Matter-over-Thread commissioning.",
        quickAnswer: "A Matter controller manages the accessory in Apple Home, Google Home, SmartThings or another ecosystem. A Thread border router provides the network path. A Canadian home may already own both roles in one current-generation hub.",
        sections: [
          { heading: "Inventory the home before buying", body: "Write down every compatible speaker, display, streaming box and dedicated hub. Match the missing role to the accessory: Matter over Wi-Fi and Matter over Thread do not require the same network infrastructure." },
          { heading: "Confirm Canadian model and service support", body: "Check the exact model generation, regional power supply, supported ecosystem and current software. Similar-looking imported hardware may differ in support, warranty or service availability." },
          { heading: "Plan one stable ownership path", body: "Use one primary ecosystem for initial setup, keep the controller and border router online, and document the owning account. Verify local fallback, subscription boundaries, CAD checkout and return terms before adding more devices." },
        ],
        checkoutChecks: ["Canadian hub generation and regional model", "Matter-controller and Thread border-router capabilities", "Primary ecosystem, account and software support", "CAD price, seller, shipping, subscription, warranty and returns"],
      },
      de: {
        title: "Matter-Controller oder Thread Border Router? Kaufberatung für Deutschland",
        dek: "Deutsche Erklärung der beiden Rollen, Gerätegenerationen, Ökosystem-Zuordnung und typischen Ursachen für eine fehlgeschlagene Matter-over-Thread-Einrichtung.",
        quickAnswer: "Ein Matter-Controller verwaltet Geräte im gewählten Ökosystem. Ein Thread Border Router verbindet Thread-Geräte mit dem IP-Netz. Manche EU-Hubs übernehmen beide Rollen, doch Generation, Software, Konto und Thread-Zugangsdaten müssen zusammenpassen.",
        sections: [
          { heading: "Zuerst vorhandene Rollen erfassen", body: "Notieren Sie kompatible Lautsprecher, Displays, Streaming-Geräte und Hubs. Matter-over-WLAN benötigt einen Controller, aber kein Thread; Matter-over-Thread benötigt beide Rollen im verwendeten Ökosystem." },
          { heading: "Generation und EU-Version bestätigen", body: "Innerhalb einer Produktfamilie kann nur ein Teil der Generationen Thread-Hardware besitzen. Prüfen Sie das genaue EU-Modell, 230V-Netzteil, aktuelle Softwareunterstützung und die Rolle im tatsächlich genutzten Ökosystem." },
          { heading: "Ein stabiles Einrichtungs- und Ausfallkonzept wählen", body: "Richten Sie das Gerät zunächst in einem Hauptökosystem ein, halten Sie Controller und Border Router dauerhaft online und dokumentieren Sie das Besitzerkonto. Prüfen Sie lokale Bedienung und Abo-Grenzen." },
        ],
        checkoutChecks: ["EU-Modell und genaue Hub-Generation", "Matter-Controller- und Thread-Border-Router-Rollen", "Hauptökosystem, Konto und Softwarestand", "Schuko-Stecker, Verkäufer, Abo, Garantie und Rückgabe"],
      },
      nl: {
        title: "Matter-controller of Thread border router? Koophulp voor Nederland",
        dek: "Nederlandse uitleg van beide rollen, apparaatgeneraties, ecosysteemeigenaarschap en oorzaken van mislukte Matter-over-Thread-installatie.",
        quickAnswer: "Een Matter-controller beheert apparaten binnen het gekozen ecosysteem. Een Thread border router verbindt Thread-apparaten met het IP-netwerk. Sommige EU-hubs doen beide, maar generatie, software, account en Thread-referenties moeten overeenkomen.",
        sections: [
          { heading: "Inventariseer eerst de aanwezige rollen", body: "Noteer compatibele speakers, displays, streamers en hubs. Matter via wifi heeft een controller nodig maar geen Thread; Matter over Thread heeft beide rollen nodig in het gebruikte ecosysteem." },
          { heading: "Bevestig generatie en EU-uitvoering", body: "Binnen één productfamilie kan slechts een deel van de generaties Thread-hardware bevatten. Controleer het exacte EU-model, de 230V-voeding, actuele softwareondersteuning en de rol in het ecosysteem dat thuis echt gebruikt wordt." },
          { heading: "Kies één stabiele installatie- en herstelroute", body: "Stel het accessoire eerst in één primair ecosysteem in, houd controller en border router online en leg het eigenaarsaccount vast. Controleer lokale bediening bij internetuitval en grenzen van abonnementen." },
        ],
        checkoutChecks: ["EU-model en exacte hubgeneratie", "Matter-controller- en Thread-border-routerrollen", "Primair ecosysteem, account en softwareversie", "Type-F-stekker, verkoper, abonnement, garantie en retour"],
      },
    },
  },
  {
    site: "homeoffice",
    route: "reviews",
    slug: "urevo-smart-walking-pad",
    primaryProductSlug: "urevo-smart-walking-pad",
    updatedAt: "July 27, 2026",
    relatedPaths: [
      { label: "Walking-pad desk measurement checklist", path: "/guides/walking-pad-desk-measurement-checklist" },
      { label: "Walking-pad speed and monitor-stability guide", path: "/guides/walking-pad-speed-monitor-stability-guide" },
      { label: "Walking pad and monitor-arm comparison", path: "/best/best-walking-pad-and-monitor-arm-setup" },
    ],
    variants: {
      gb: {
        title: "UREVO walking pad review UK: desk fit, 230V offer and floor checks",
        dek: "A UK-focused UREVO walking-pad decision guide covering footprint, belt, desk clearance, power, floor protection, noise, seller and returns.",
        quickAnswer: "Consider this UREVO only after the 46.8 × 20-inch body, 5-inch step-up and 35.5 × 15-inch belt fit the workstation and user. Confirm that the UK offer is the same model with an appropriate 230V UK power arrangement.",
        sections: [
          { heading: "Measure the entire workstation", body: "Mark the walking-pad body, rear clearance, desk crossbars, chair storage and cable path on the floor. Add the five-inch step-up to standing desk height and recheck monitor, keyboard and elbow position." },
          { heading: "Plan for shared-home noise and floor impact", body: "Motor noise is only one part of the household impact. Footfall, vibration and floor structure matter, especially above another room. Use suitable floor protection and keep the emergency stop or power control reachable." },
          { heading: "Verify the exact UK electrical offer", body: "Confirm the model, UK plug or approved power arrangement, voltage, seller, delivery weight, return process and warranty before ordering. Do not use an imported transformer arrangement unless the manufacturer explicitly supports it." },
        ],
        checkoutChecks: ["Exact UREVO model and published capacity", "46.8 × 20-inch body, belt and five-inch step-up", "UK plug, 230V support and safe cable route", "GBP price, seller, delivery, warranty and return handling"],
      },
      ca: {
        title: "UREVO walking pad review Canada: desk fit, local power and delivery checks",
        dek: "A Canadian UREVO walking-pad decision guide covering footprint, belt, standing height, outlet path, floor, noise, CAD checkout and returns.",
        quickAnswer: "Choose this UREVO only when its body, short belt, published capacity and maximum speed match the user and measured desk. Verify that the Canadian offer is the same model and includes the correct local power configuration.",
        sections: [
          { heading: "Convert the listing into a floor plan", body: "Lay out the full machine footprint and rear clearance in the room. Check desk crossbars, cable travel, chair storage and the added standing height before deciding that the pad fits." },
          { heading: "Treat floor and seasonal use as buying criteria", body: "Choose floor protection for the actual surface and consider vibration in shared rooms. If the pad will be a winter indoor routine, plan ventilation, storage and a realistic walking schedule rather than buying for occasional motivation." },
          { heading: "Price the Canadian delivery and return path", body: "Confirm local voltage and plug, exact model, seller, shipping, applicable taxes, delivery access, return shipping and regional warranty. Large-equipment returns can erase a small cross-border price saving." },
        ],
        checkoutChecks: ["Exact UREVO model, belt, speed and capacity", "Metric room, desk and step-up measurements", "Canadian plug, voltage and cable route", "CAD price, seller, shipping, taxes, warranty and large-item returns"],
      },
      de: {
        title: "UREVO Walking Pad Kaufberatung Deutschland: Tischhöhe, 230V und Trittschall",
        dek: "Deutsche Entscheidungshilfe zu Stellfläche, Lauffläche, Tischfreiheit, Schuko-Stromversorgung, Boden, Geräusch, Lieferung und Rückgabe.",
        quickAnswer: "Das UREVO passt nur, wenn Gehäuse, kurze Lauffläche, zulässiges Gewicht und Maximalgeschwindigkeit zur Person und zum vermessenen Arbeitsplatz passen. Bestätigen Sie beim deutschen Angebot dasselbe Modell und eine vorgesehene 230V-Schuko-Ausführung.",
        sections: [
          { heading: "Den vollständigen Arbeitsplatz vermessen", body: "Markieren Sie Gehäuse, hinteren Freiraum, Tischtraversen, Stuhlablage und Kabelweg. Addieren Sie die Gerätehöhe zur Stehhöhe und prüfen Sie Monitor, Tastatur und Ellenbogenposition erneut." },
          { heading: "Boden und Trittschall einplanen", body: "Neben dem Motorgeräusch entstehen Schritte und Vibrationen. Das ist besonders in Mietwohnungen und über anderen Räumen relevant. Verwenden Sie geeigneten Bodenschutz und halten Sie Stopp- oder Stromschalter erreichbar." },
          { heading: "Deutsche Elektro- und Rückgabedaten prüfen", body: "Bestätigen Sie Modell, Schuko-Stecker, 230V-Freigabe, Verkäufer, Liefergewicht, Rückgabeprozess und regionale Garantie. Ein nicht freigegebener Transformator ist keine sichere Lösung für eine Importversion." },
        ],
        checkoutChecks: ["Genaues UREVO-Modell, Tempo und Tragfähigkeit", "Stellfläche, Lauffläche und zusätzliche Stehhöhe", "Schuko-Stecker, 230V und sichere Kabelführung", "Euro-Preis, Verkäufer, Lieferung, Garantie und Großgeräte-Rückgabe"],
      },
      nl: {
        title: "UREVO walking pad review Nederland: bureaupassing, 230V en contactgeluid",
        dek: "Nederlandse beslisgids voor afmetingen, loopvlak, bureauvrijheid, Type-F-voeding, vloer, geluid, bezorging en retour.",
        quickAnswer: "Deze UREVO past alleen wanneer behuizing, kort loopvlak, gepubliceerd draagvermogen en maximumsnelheid aansluiten op de gebruiker en de gemeten werkplek. Bevestig bij het Nederlandse aanbod hetzelfde model en een bedoelde 230V-uitvoering.",
        sections: [
          { heading: "Meet de volledige werkplek", body: "Markeer de behuizing, vrije ruimte achteraan, dwarsbalken van het bureau, stoelopslag en kabelroute. Tel de hoogte van het apparaat op bij de stahoogte en controleer monitor, toetsenbord en elleboogpositie opnieuw." },
          { heading: "Plan vloerbescherming en contactgeluid", body: "Naast motorgeluid ontstaan voetstappen en trillingen. Dat telt extra in appartementen en boven andere kamers. Kies bescherming voor de werkelijke vloer en houd stopknop of stroomschakelaar bereikbaar." },
          { heading: "Controleer Nederlandse voeding en retourafhandeling", body: "Bevestig model, Type-F-stekker, 230V-ondersteuning, verkoper, bezorggewicht, retourproces en regionale garantie. Gebruik geen niet-goedgekeurde transformator om een importuitvoering passend te maken." },
        ],
        checkoutChecks: ["Exact UREVO-model, snelheid en draagvermogen", "Afmetingen van behuizing, loopvlak en extra stahoogte", "Type-F-stekker, 230V en veilige kabelroute", "Europrijs, verkoper, levering, garantie en retour van grote apparatuur"],
      },
    },
  },
  {
    site: "baby",
    route: "guides",
    slug: "ergobaby-omni-breeze-positions-by-age",
    primaryProductSlug: "ergobaby-omni-breeze-carrier",
    updatedAt: "July 27, 2026",
    relatedPaths: [
      { label: "Ergobaby Omni Breeze research page", path: "/reviews/ergobaby-omni-breeze-carrier" },
      { label: "Newborn fit checklist", path: "/guides/ergobaby-omni-breeze-newborn-fit-checklist" },
      { label: "Baby carriers by age and position", path: "/best/best-baby-carriers-by-age-and-position" },
    ],
    variants: {
      gb: {
        title: "Ergobaby Omni Breeze positions by age: UK fit and buying guide",
        dek: "A UK-focused position guide keeping the current instructions, newborn fit, developmental readiness, exact carrier model, seller and returns visible.",
        quickAnswer: "Begin with inward-facing carry only after the baby meets the current Omni Breeze instructions. Outward, hip and back positions depend on size, head control and developmental readiness rather than age alone.",
        sections: [
          { heading: "Use the current UK instructions as the authority", body: "Check the manual supplied for the exact carrier and compare every position with the baby's current weight, height and development. Marketplace diagrams and age shorthand do not replace the manufacturer setup steps." },
          { heading: "Treat each position as a complete refit", body: "Recheck seat width, panel height, waistband, straps, airway and head support whenever orientation changes or the child grows. Stop and reset if the baby slumps or the caregiver cannot maintain the instructed position." },
          { heading: "Keep model, material and return path aligned", body: "Confirm that the UK offer is the intended Omni Breeze material, colour and bundle from an appropriate seller. Fit varies for both child and adult, so understand the return conditions before extended indoor use." },
        ],
        checkoutChecks: ["Exact Omni Breeze model, material, colour and bundle", "Current UK instructions and all stated limits", "Child development and caregiver fit", "GBP price, seller, delivery, warranty and return conditions"],
      },
      ca: {
        title: "Ergobaby Omni Breeze positions by age: Canadian fit and buying guide",
        dek: "A Canadian position guide keeping current instructions, developmental readiness, exact model, climate, seller, shipping and returns visible.",
        quickAnswer: "Use inward-facing carry only when the baby meets the current Omni Breeze instructions. Move to outward, hip or back carry only after the stated size and developmental requirements are met; age is not enough by itself.",
        sections: [
          { heading: "Follow the instructions for the Canadian offer", body: "Match the manual to the exact carrier version and verify weight, height, head-control and position requirements. Keep the airway and instructed body position visible during every use." },
          { heading: "Refit for growth, clothing and season", body: "Bulky winter layers and warm-weather clothing change strap tension and fit. Recheck seat, panel, waistband and head support whenever clothing, orientation or caregiver changes." },
          { heading: "Verify the complete Canadian bundle and return path", body: "Confirm model, mesh material, colour, included pieces, seller, shipping, regional warranty and return conditions. A lower imported price is not automatically better when fit needs to be tested." },
        ],
        checkoutChecks: ["Exact Omni Breeze model, material, colour and bundle", "Current instructions and every size or developmental limit", "Fit across caregivers, clothing and seasons", "CAD price, seller, shipping, warranty and returns"],
      },
      de: {
        title: "Ergobaby Omni Breeze Tragepositionen: Alter, Entwicklung und Kaufberatung",
        dek: "Deutsche Positions- und Passformhilfe mit aktueller Anleitung, Neugeborenen-Sitz, Entwicklungsreife, genauem Modell, Verkäufer und Rückgabe.",
        quickAnswer: "Beginnen Sie nur dann mit der nach innen gerichteten Position, wenn das Baby die aktuelle Omni-Breeze-Anleitung erfüllt. Außen-, Hüft- und Rückentragen hängen von Größe, Kopfkontrolle und Entwicklung ab; das Alter allein reicht nicht.",
        sections: [
          { heading: "Die aktuelle deutsche oder EU-Anleitung ist maßgeblich", body: "Ordnen Sie die Anleitung dem genauen Tragemodell zu und prüfen Sie für jede Position Gewicht, Größe und Entwicklung. Marktplatzgrafiken und verkürzte Altersangaben ersetzen keine Einrichtungsschritte." },
          { heading: "Jede Positionsänderung erfordert eine neue Passformprüfung", body: "Prüfen Sie Sitzbreite, Rückenteil, Hüftgurt, Träger, Atemwege und Kopfstütze erneut, sobald Position, Kleidung, tragende Person oder Körpergröße sich ändern. Bei Einsinken oder unsicherem Halt neu einstellen." },
          { heading: "Modell, Material und Rückgabeweg zusammen prüfen", body: "Bestätigen Sie Omni Breeze, Mesh-Material, Farbe, Lieferumfang, Verkäufer und regionale Garantie. Die Passform ist für Kind und Erwachsene individuell; klären Sie die Rückgabebedingungen vor längerer Nutzung." },
        ],
        checkoutChecks: ["Genaues Omni-Breeze-Modell, Material, Farbe und Set", "Aktuelle deutsche oder EU-Anleitung", "Entwicklungsreife und Passform für alle Tragenden", "Euro-Preis, Verkäufer, Versand, Garantie und Rückgabe"],
      },
      nl: {
        title: "Ergobaby Omni Breeze draagposities: leeftijd, ontwikkeling en koophulp",
        dek: "Nederlandse positie- en passinggids met actuele handleiding, pasvorm voor pasgeborenen, ontwikkelingsfase, exact model, verkoper en retour.",
        quickAnswer: "Begin alleen naar binnen gericht wanneer de baby voldoet aan de actuele Omni Breeze-instructies. Naar buiten, op de heup en op de rug hangen af van lengte, hoofdcontrole en ontwikkeling; leeftijd alleen is niet voldoende.",
        sections: [
          { heading: "De actuele Nederlandse of EU-handleiding is leidend", body: "Koppel de handleiding aan het exacte draagzakmodel en controleer voor elke positie gewicht, lengte en ontwikkeling. Marketplace-afbeeldingen en verkorte leeftijdslabels vervangen de instelstappen niet." },
          { heading: "Elke positiewijziging vraagt een volledige herpassing", body: "Controleer zitbreedte, rugpand, heupband, schouderbanden, luchtweg en hoofdsteun opnieuw zodra positie, kleding, drager of lichaamsgrootte verandert. Stel opnieuw af bij wegzakken of onvoldoende steun." },
          { heading: "Controleer model, materiaal en retourroute samen", body: "Bevestig Omni Breeze, meshmateriaal, kleur, pakketinhoud, verkoper en regionale garantie. Passing verschilt per kind en volwassene; begrijp de retourvoorwaarden vóór langdurig gebruik." },
        ],
        checkoutChecks: ["Exact Omni Breeze-model, materiaal, kleur en pakket", "Actuele Nederlandse of EU-handleiding", "Ontwikkelingsfase en passing voor alle dragers", "Europrijs, verkoper, levering, garantie en retour"],
      },
    },
  },
];

export function findLocalizedMarketPage(site: SiteKey, market: MarketKey, route: string, slug: string) {
  const page = localizedMarketPages.find((item) => item.site === site && item.route === route && item.slug === slug);
  return page ? { page, variant: page.variants[market] } : undefined;
}

export function localizedMarketPagesForSite(site: SiteKey, market: MarketKey) {
  return localizedMarketPages
    .filter((page) => page.site === site)
    .map((page) => ({ page, variant: page.variants[market] }));
}

export function basePathForMarketPage(page: Pick<LocalizedMarketPage, "route" | "slug">) {
  return `/${page.route}/${page.slug}`;
}

export function localizedMarketPath(market: MarketProfile, page: Pick<LocalizedMarketPage, "route" | "slug">) {
  return marketPath(market, basePathForMarketPage(page));
}

export function localizedAlternatesForBasePath(domain: string, site: SiteKey, path: string) {
  const page = localizedMarketPages.find((item) => item.site === site && basePathForMarketPage(item) === path);
  if (!page) return undefined;

  return {
    "en-US": new URL(path, domain).toString(),
    ...Object.fromEntries(
      marketKeys.map((key) => {
        const market = markets[key];
        return [market.hrefLang, new URL(localizedMarketPath(market, page), domain).toString()];
      }),
    ),
    "x-default": new URL(path, domain).toString(),
  };
}

export function marketSitemapEntries(site: SiteKey) {
  if (!marketHomeCopy.gb[site]) return [];

  return marketKeys.flatMap((key) => {
    const market = markets[key];
    const pages = localizedMarketPages.filter((page) => page.site === site);
    return [
      { path: marketPath(market), priority: 0.76, changeFrequency: "weekly" as const, updatedAt: "July 27, 2026" },
      ...pages.map((page) => ({
        path: localizedMarketPath(market, page),
        priority: 0.8,
        changeFrequency: "weekly" as const,
        updatedAt: page.updatedAt,
      })),
    ];
  });
}
