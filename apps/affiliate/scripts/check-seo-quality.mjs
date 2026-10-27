import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";

const { evaluateFitWorksheet: fit } = loadAffiliateTypescript("../../lib/fit-worksheet.ts");
const { siteGuides, guides } = loadAffiliateTypescript("../../lib/content.ts");
const { mergeConsolidatedFamilyGuide, consolidationTargetSlug } = loadAffiliateTypescript("../../lib/search-recovery-consolidation.ts");
const { localizedMarketPages, marketSitemapEntries, isIndexableLocalizedMarketPage } = loadAffiliateTypescript("../../lib/market-content.ts");
const reportDir = path.resolve(new URL("../reports/seo-quality-2026-10-21/", import.meta.url).pathname);
const before = JSON.parse(gunzipSync(fs.readFileSync(path.join(reportDir, "guide-inventory-before.json.gz"))).toString("utf8"));
const examples = [];
const printer = { shelfWidth: "60", printerWidth: "52", shelfDepth: "50", printerDepth: "48", shelfCapacity: "20", loadedWeight: "15", openingHeight: "60", operatingHeight: "55" };
for (const [name, kind, values, expected] of [
  ["Unknown is not zero", "printer", {}, "unknown"],
  ["Partial measurements stay incomplete", "printer", { shelfWidth: "60" }, "unknown"],
  ["Complete printer measurement match", "printer", printer, "match"],
  ["Operating depth can fail while load fits", "printer", { ...printer, shelfDepth: "45" }, "mismatch"],
  ["Overloaded shelf fails", "printer", { ...printer, loadedWeight: "21" }, "mismatch"],
  ["Zero shelf capacity is invalid", "printer", { ...printer, shelfCapacity: "0" }, "invalid"],
  ["Negative weight is invalid", "printer", { ...printer, loadedWeight: "-1" }, "invalid"],
  ["Nonfinite input is invalid", "printer", { ...printer, shelfWidth: "1e999" }, "invalid"],
  ["Nondecimal notation is rejected", "printer", { ...printer, shelfWidth: "0x40" }, "invalid"],
  ["Subcentimetre mismatch is retained", "printer", { ...printer, shelfDepth: "47.999" }, "mismatch"],
  ["Cushion can remove needed seat depth", "lumbar", { seatDepth: "49", cushionProjection: "6", neededDepth: "45" }, "mismatch"],
  ["Exact seat-depth boundary", "lumbar", { seatDepth: "49", cushionProjection: "4", neededDepth: "45" }, "match"],
  ["Zero cushion projection is explicit", "lumbar", { seatDepth: "49", cushionProjection: "0", neededDepth: "49" }, "match"],
  ["Missing projection is unknown", "lumbar", { seatDepth: "49", neededDepth: "45" }, "unknown"],
  ["Negative projection is invalid", "lumbar", { seatDepth: "49", cushionProjection: "-2", neededDepth: "45" }, "invalid"],
  ["Arithmetic overflow cannot become fit", "lumbar", { seatDepth: "1", cushionProjection: "1e308", neededDepth: "1e308" }, "invalid"],
]) {
  const result = fit(kind, values);
  assert.equal(result.status, expected, name);
  assert.ok(!result.checks.some((check) => check.detail.includes("Infinity")), name);
  examples.push({ name, status: result.status });
}

const sites = ["homeoffice", "network", "smarthome", "baby", "pet",];
const after = sites.flatMap((site) => siteGuides(site));
assert.deepEqual(after.map((g) => `${g.site}:${g.slug}`).sort(), before.map((g) => `${g.site}:${g.slug}`).sort(), "Published guide identities stay unchanged");
const { publicDecisionNote } = loadAffiliateTypescript("../../lib/guide-editorial-repairs.ts");
const opportunities = JSON.parse(fs.readFileSync(new URL("../config/breadth-draft-120-plus-opportunity-evidence.json", import.meta.url))).records;
// These explicit copy edits replace leaked planning notes. Deduplication alone
// must preserve paragraphs; a separately authored hub replacement has a different
// acceptance contract and must retain its useful decisions and redirect topology.
const readerCopyEdits = new Map(opportunities.filter((record) => record.publicDecision).map((record) => [publicDecisionNote(record.note), record.publicDecision]));
const key = (body) => (readerCopyEdits.get(body) ?? body).replace(/\s+/g, " ").trim();
const deduplicated = [];
const authoredReplacements = [];
// Each authored canonical hub has its own reviewed decisions. A future hub must
// be added explicitly; the flag alone must never waive information preservation.
const authoredHubContracts = new Map([
  ["pet:automatic-aquarium-feeders-setup-and-daily-workflow", {
    terms: ["cy-109", "cy-019", "15", "outlet", "flakes", "monday then wednesday", "not waterproof", "adapter-input", "carer", "existing"],
    decisions: ["compartment tray versus reservoir drum", "actual animal ration versus seller compartment capacity", "15 meals and empty outlet position", "clock and enabled timers versus rounds and consumed compartments", "skipped-day interval examples versus daily setting", "received mounting diagram, lid and dry outlet path", "exact power and component-care requirements", "ordinary scheduled release and actual food access", "competent human care and no unattended-duration guarantee", "damp food, fault, service, successor uncertainty and keep-existing"],
  }],
  ["pet:aquarium-water-monitors-setup-and-daily-workflow", {
    terms: ["ky-ygjcq-s01us", "derived", "ammonia", "nitrite", "nitrate", "dissolved-oxygen", "pool", "cl", "reference", "notification", "existing"],
    decisions: ["actual species/system water questions", "sensed inputs versus legitimate derived values", "ORP versus direct nitrogen-compound tests", "selected aquarium SKU versus mismatched pool original", "exact probe, installation, power and exposure", "matched calibration and independent reference checks", "units, conversion and compensation", "whole notification and response path without harmful chemistry tests", "exact probe, consumable, care and service cost", "abnormal readings, appropriate help and keep-existing"],
  }],
  ["pet:interactive-puzzle-feeders-buying-guide", {
    terms: ["280ml", "potaroma-d1-ddgwj", "remote accessory", "dry food", "daily intake", "supervis", "charging", "electronics", "meal", "existing"],
    decisions: ["slow bowl versus mechanical puzzle versus remote reward task", "complete 280ml unit versus separately priced remote accessory", "actual permitted dry food and planned dietary allowance", "achievable voluntary learning and guarding or chewing stop", "unmeasured range and sound tolerance", "matching supplied charging and component-cleaning instructions", "ordinary food-release observation with a reliable meal route", "care, parts, supervised time and no purchase"],
  }],
  ["pet:automatic-ball-launchers-buying-guide", {
    terms: ["wl-008", "2.3 in", "19 ft", "trajectory", "supervis", "sensor", "power-isolation", "etpu", "unavailable", "successor", "manual play"],
    decisions: ["individual exercise suitability and no universal session limit", "permitted ball and animal mouth fit with no chew-proof guarantee", "full trajectory, bounce, running and stopping space", "matched startup, clearance, controls and sensing limitations", "voluntary introduction and whole-session supervision", "exact charging and weather limits", "original shutdown and jam service without powered intrusion", "matched replacement balls, care and storage", "unavailable current state versus unverified successor or EOL", "independently suitable manual play and no purchase"],
  }],
  ["pet:pet-stain-carpet-cleaners-buying-guide", {
    terms: ["22 fl oz", "handheld", "6233801007", "pet specialist", "machine", "colorfastness", "two hours", "bleach", "padding", "existing"],
    decisions: ["spot spray versus foam, extractor and approved machine formula", "exact one-bottle identity and advertised old/new packaging correspondence", "actual material permission and fully dried hidden-area check", "label-specific application rather than invented saturation or tank recipe", "ventilation and full child/pet exclusion including post-dry limits", "no mixing, animal application or unverified chemical guarantees", "persistent below-surface contamination and care escalation", "bottle cost, storage, optional subscription and no purchase"],
  }],
  ["pet:cooling-pet-beds-setup-and-daily-workflow", {
    terms: ["polyester", "fiber", "q-max", "20", "19", "6 in", "inner", "exit", "cold", "low", "heat illness", "existing"],
    decisions: ["selected passive fiber-filled fabric versus gel, water or powered systems", "unverified cool-touch metric versus animal temperature and heat illness", "Cooling Blue size/quantity and separate self-warming variants", "actual inner rest area, rim, entry and voluntary movement", "stable indoor placement and continued choice", "received-label cold washing and complete low-temperature drying", "fabric/fill damage, chewing, moisture and ingestion concerns", "veterinary escalation rather than cooling-product fallback", "ownership, alternative fit and keep-existing"],
  }],
  ["pet:washable-orthopedic-pet-beds-buying-guide", {
    terms: ["ecus22mpt8s13xl", "ecus23ppt8fa03xl", "44", "32", "three", "l-shaped", "inside", "foam", "sides are not waterproof", "cover", "cold", "6.5", "existing"],
    decisions: ["actual resting posture and veterinary pain/access boundary", "selected three-sided part and external versus inside/entry dimensions", "foam construction claims versus unmeasured density and clinical relief", "open approach, bolsters, stability and comfortable voluntary use", "partial film protection with non-waterproof sides", "removed-cover washing versus non-washable foam core", "received preparation, expansion and complete drying", "individually observed newer L-shaped part and unresolved height difference", "exact replacement-cover availability, care cost and no fixed service-life promise", "damage, chewing, unsuitable rest and keep-existing"],
  }],
  ["pet:cat-litter-mats-compatibility-and-fit-guide", {
    terms: ["23.6", "14.6", "exit", "texture", "pc", "pvc", "floor", "flat", "moisture", "dry", "runner", "existing"],
    decisions: ["normal exit coverage and unobstructed access", "selected compact footprint and pack versus separate sizes", "voluntary texture acceptance and chewing/avoidance stop", "unresolved backing polymer and floor-finish permission", "flat stable edges and unresolved heat-flattening directions", "spill inspection rather than certified moisture containment", "component-specific cleaning and complete drying", "separate runner, larger mat or no-mat decision", "ordinary passive care without invented electronics", "powered-box support limits, damaged-mat pause and keep-existing"],
  }],
  ["pet:cat-gps-trackers-setup-and-daily-workflow", {
    terms: ["trcat5dbna", "cat 6 mini", "above 7 lb", "breakaway", "clip charger", "cellular", "subscription", "power saving zones", "last-known", "activity and sleep", "microchip", "unknown"],
    decisions: ["cellular GPS versus local locator and identification", "selected CAT Mini versus documented newer CAT 6 Mini", "conflicting size threshold, collar fit and adjustable release", "GPS, cellular, phone and delayed-location limits", "full advance subscription charge and separate cancellation", "model-matched charging, activation and in-hand route check", "off-animal mount installation and comfortable supervised wear", "virtual fence, power-saving and mode-dependent runtime", "activity/sleep versus newer vitals and nonmedical interpretation", "care, detached-collar recovery, keep-existing and no-buy"],
  }],
  ["pet:dog-activity-collars-buying-guide", {
    terms: ["tg6c", "dog 6 xl", "above 9 lb", "3 cm", "cellular", "subscription", "activity and sleep", "baseline", "bluetooth sync", "usb-c", "wet-port", "existing"],
    decisions: ["location, activity diary and clinical assessment are separate jobs", "exact current Mint DOG 6 and larger-model alternatives", "conflicting size limits and actual comfortable fit", "narrow and wide supplied-clip attachment routes", "full signal, plan and phone chain versus physical containment", "advance billing, renewal and separate hardware/service returns", "specific health-alert limits versus marketing", "learning, missing wear, current sync and nonmedical interpretation", "USB-C, wet-port pause, mode-dependent battery and exact spares", "fault, poor wear, keep-existing and no automatic GPS fallback"],
  }],
  ["pet:airtag-pet-collar-holders-setup-and-daily-workflow", {
    terms: ["gocii", "two-pack", "25 mm", "6 mm", "26.2.1", "breakaway", "white inner", "precision finding", "last-known", "cr2032", "chew", "microchip"],
    decisions: ["Find My item-network locator versus live cellular GPS", "exact accessory-only package and complete ownership cost", "original versus 2026 second-generation tag and current pairing requirements", "actual slot geometry, comfortable collar fit and release clearance", "two-piece off-animal installation, retention and secure battery door", "Find My setup, audible and supported UWB nearby finding", "stale report, detached collar and ordinary lost-pet response", "qualified tag IP67 versus unverified holder waterproofing and separate cleaning", "coin-cell and loose-part handling, suspected-ingestion emergency stop", "routine inspection, identification, keep-existing and no attachment"],
  }],
  ["smarthome:diy-smart-alarm-kits-buying-guide", {
    terms: ["pg108-4gus-f", "pg108-a", "24-piece", "monitoring", "radio frequency", "entry delay", "cellular", "backup", "codes", "service", "unavailable", "unknown"],
    decisions: ["installation versus local/self-notified/professionally monitored response", "exact US kit and current unavailability versus separate manufacturer package", "protected openings versus box pieces and actual contact/motion scope", "model-matched sensors, zones, modes and missing-device states", "actual modem/carrier/service versus network headline", "whole detection and message chain backup", "household access, account and private-code recovery", "full service, battery and installation costs", "supervised mode/stop/recipient acceptance with coordinated service testing", "maintenance, handover, documented alternative or keep existing"],
  }],
  ["smarthome:smart-smoke-co-listeners-buying-guide", {
    terms: ["ca011-01dus", "gen 3", "four inches", "interconnected", "standalone", "ul 217", "ul 2034", "professional", "test mode", "cr123a", "voice", "unknown"],
    decisions: ["listener versus actual hazard detector", "existing alarm condition and actual interconnected coverage", "same-surface directional microphone placement", "Gen 3 and separate app/dispatch service paths", "listener versus connected-detector replacement or no-buy", "complete per-position and service ownership cost", "approved acoustic test versus system heartbeat", "battery, pairing, voice-prompt diagnosis and scoped recovery"],
  }],
  ["smarthome:smart-garage-door-controllers-buying-guide", {
    terms: ["ekgda260", "security+2.0", "security+3.0", "photo eyes", "reversal", "position", "locked", "unattended", "2.4ghz", "siri shortcuts", "learn", "unknown"],
    decisions: ["exact operator model and required matching adapter", "controller versus status-only reminder or complete operator", "approved control interface versus original entrapment protection", "physical door position versus command, lock state and stale data", "network, power and permitted remote or unattended behavior", "per-door costs and optional alert services", "household sharing, assistant PIN and Shortcuts boundary", "in-view commissioning, original controls and scoped fault recovery"],
  }],
  ["network:ethernet-cable-testers-compatibility-and-fit-guide", {
    terms: ["unenergized", "split pair", "0.5m", "remote", "vdv999-200", "tdr", "certification", "scout pro max", "aaa", "known-good", "existing"],
    decisions: ["substitution, wire map, qualification and certification", "isolate both ends from active power and PoE", "pair-map interpretation and limits", "remote, leads and separate probe", "distance versus reachable test length", "current higher-feature alternative and keep-existing", "repair verification versus standards report", "model-specific batteries, cleaning and storage"],
  }],
  ["homeoffice:office-trackballs-buying-guide", {
    terms: ["thumb", "finger", "handedness", "mam1 pro", "mam2", "receiver", "software", "cleaning", "return", "pointer speed", "drag"],
    decisions: ["comparison", "hand/control fit", "OS and receiver", "ownership and cleaning", "setup and precise tasks", "keep-current and discomfort stop"],
  }],
  ["homeoffice:wireless-conference-headsets-buying-guide", {
    terms: ["wired", "4xd1m80020", "4xh1m80022", "4xd1m80021", "enc", "teams", "two", "mute", "charging", "return"],
    decisions: ["wireless versus wired", "exact headset and receiver", "microphone ENC versus listening ANC", "call controls", "two-host switching", "power and wear parts", "keep-current and unresolved fit"],
  }],
  ["network:sfp-plus-transceivers-compatibility-and-fit-guide", {
    terms: ["both", "coding", "1310", "single-mode", "multimode", "lc/upc", "optical", "dac", "ddm", "dust caps", "budget", "existing"],
    decisions: ["both host acceptance and coding", "LR versus SR, copper and BiDi", "complete optical path and power budget", "short compatible DAC or keep existing", "module power and diagnostics", "installation, cleaning, records and support"],
  }],
  ["network:vpn-gateways-buying-guide", {
    terms: ["site-to-site", "provider client", "per-device", "end of life", "encrypted throughput", "authentication", "routing", "dns", "failure", "keys", "local", "support"],
    decisions: ["tunnel role and exact peer", "legacy status and hardware revision", "current protocol and authentication", "encrypted workload", "routing, DNS and tunnel failure", "supported alternatives or keep existing", "local recovery and protected keys", "ownership costs and retirement"],
  }],
  ["network:dual-wan-routers-compatibility-and-fit-guide", {
    terms: ["manual", "independent", "health", "public ip", "dns", "gigabit sfp", "v1.20", "v1.30", "1.4.10", "metered", "local", "configuration"],
    decisions: ["automatic backup versus manual recovery", "independent ISP and power paths", "exact fixed and configurable ports", "internet health and management mode", "sessions, DNS and incoming access", "revision lifecycle and software prerequisites", "failure, return-to-primary and local recovery", "recurring service and maintenance costs"],
  }],
  ["network:five-g-home-internet-gateways-compatibility-and-fit-guide", {
    terms: ["apn", "carrier", "one", "modem", "u-boot", "firmware", "47.4wh", "gigabit lan", "cgnat", "mudi 7", "active", "local"],
    decisions: ["exact carrier, plan and device eligibility", "primary service versus backup and no-buy", "single-modem SIM topology and actual ports", "published bootloader and firmware remedy", "complete power path and battery limits", "NAT, DNS, VPN and failover", "current lifecycle and separate newer alternatives", "supported maintenance, protected configuration and local recovery"],
  }],
  ["network:mobile-hotspots-buying-guide", {
    terms: ["phone", "cloud sim", "five", "ten", "usb-c", "30 days", "expiry", "top-up", "5ghz", "5g", "account", "paused"],
    decisions: ["phone tethering versus SIM router versus Cloud SIM", "unresolved current R10 revision", "destination data, activation and expiry", "actual coverage and radio distinction", "client capacity, charging and runtime", "total cost and separate current 5G option", "app, account and reversible setup", "future packages, support and no-buy"],
  }],
  ["network:ethernet-patch-panels-buying-guide", {
    terms: ["punch-down", "coupler", "bare", "24", "spare", "1u", "rear", "crosstalk", "poe", "shield", "label", "passive"],
    decisions: ["plugged cable versus bare-wire termination", "passive positions versus active switch capacity", "full rack and rear cable path", "component labels versus installed channel tests", "exact PoE, shielding and approval limits", "separate Cat6A and blank-panel choices", "labelled staged installation and verification", "ordinary passive maintenance and keep-existing"],
  }],
]);
for (const old of before) {
  if (new Set(old.sections.map((s) => key(s.body))).size === old.sections.length) continue;
  const current = after.find((g) => g.site === old.site && g.slug === old.slug);
  if (current.curatedFamilyHub) {
    // Explicit scope: this hub was read and rewritten, including the old merged
    // comparison, fit, ownership and workflow sections. Never waive preservation
    // for a new flagged hub without recording its own decision requirements.
    const contract = authoredHubContracts.get(`${current.site}:${current.slug}`);
    assert.ok(contract, "An authored hub requires an explicit reviewed decision contract");
    const text = JSON.stringify(current).toLowerCase();
    for (const decision of contract.terms)
      assert.ok(text.includes(decision), `Retain ${current.slug} decision: ${decision}`);
    assert.ok(!/add one device, user, animal|compare time saved, new chores|loss of power, video/.test(text), "Retired generic body must not be re-appended");
    const family = guides.filter((g) => g.site === current.site && g.familySlug === current.familySlug);
    assert.deepEqual(mergeConsolidatedFamilyGuide(current, family).sections, current.sections, "Repeated hub merge cannot restore retired body");
    for (const sibling of family.filter((g) => g.slug !== current.slug))
      assert.equal(consolidationTargetSlug(sibling), current.slug, `Keep existing redirect: ${sibling.slug}`);
    assert.equal(after.filter((g) => g.site === current.site && g.familySlug === current.familySlug).length, 1, "Only the existing canonical hub remains in discovery");
    authoredReplacements.push({site:current.site,slug:current.slug,before:old.sections.length,after:current.sections.length,retainedDecisions:contract.decisions,existingRedirectsPreserved:true});
    continue;
  }
  assert.deepEqual([...new Set(current.sections.map((s) => key(s.body)))].sort(), [...new Set(old.sections.map((s) => key(s.body)))].sort(), `Preserve all distinct information: ${old.site}/${old.slug}`);
  assert.equal(new Set(current.sections.map((s) => key(s.body))).size, current.sections.length, `No repeated paragraphs: ${old.slug}`);
  deduplicated.push({ site: old.site, slug: old.slug, before: old.sections.length, after: current.sections.length });
}
const indexQualified = localizedMarketPages.filter(isIndexableLocalizedMarketPage).length * 4;
const localeSitemaps = sites.flatMap((site) => marketSitemapEntries(site));
assert.equal(indexQualified, 16, "Qualified localized articles stay unchanged");
assert.equal(localeSitemaps.length, 32, "Qualified localized articles and directory homes stay unchanged");
const report = { checkedAt: new Date().toISOString(), arithmeticScenarios: examples, publishedGuides: after.length, canonicalIdentitiesUnchanged: true, deduplicatedGuides: deduplicated, duplicateSectionsRemoved: deduplicated.reduce((n, g) => n + g.before - g.after, 0), distinctInformationPreserved: true, preservationScope:"Paragraph-preserving deduplication entries only; separately authored replacements use the recorded decision and redirect checks.", authoredReplacements, qualifiedLocaleArticleUrls: indexQualified, localeSitemapEntries: localeSitemaps.length };
fs.writeFileSync(path.join(reportDir, "quality-checks.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ scenarios: examples.length, guides: after.length, deduplicatedGuides: deduplicated.length, authoredReplacements:authoredReplacements.length, duplicateSectionsRemoved: report.duplicateSectionsRemoved, qualifiedLocaleArticleUrls: indexQualified, qualifiedLocaleUrlsIncludingHomes: localeSitemaps.length }));
