import assert from "node:assert/strict";
import fs from "node:fs";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";
const { checkDock, checkArm, planMiniPc, planEthernet } = loadAffiliateTypescript("../../lib/compatibility-engine.ts");
const { compatibilitySources, dockProfiles, macProfiles, miniPcProfiles } = loadAffiliateTypescript("../../lib/compatibility-data.ts");
const { siteSearchIndex, allSiteSearchIndex } = loadAffiliateTypescript("../../lib/site-search.ts");
const { searchContent } = loadAffiliateTypescript("../../../shared/content-search.ts");
const { compatibilityTopics } = loadAffiliateTypescript("../../lib/compatibility-topics.ts");
const { findGuide, findProduct, findRoundup, findTool } = loadAffiliateTypescript("../../lib/content.ts");
let checks = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); checks++; };
const dock = { mac: "m4-air", dock: "ud5", screens: 2, lid: "open", mode: "4k60", input: "hdmi", software: "no", workload: "office", powerWatts: 67, clamshellReady: "unknown" };
check("M4 Air native dual HDMI", checkDock(dock).status, "conditional");
check("M1 Air cannot gain a native stream from UD5", checkDock({ ...dock, mac: "m1-air" }).status, "incompatible");
check("M2 Air closing lid does not unlock native two", checkDock({ ...dock, mac: "m2-air", lid: "closed" }).status, "incompatible");
check("M3 lid open native two fails", checkDock({ ...dock, mac: "m3" }).status, "incompatible");
check("M3 unconfirmed clamshell remains unknown", checkDock({ ...dock, mac: "m3", lid: "closed" }).status, "unknown");
check("M3 completed clamshell conditions", checkDock({ ...dock, mac: "m3", lid: "closed", clamshellReady: "yes" }).status, "conditional");
check("DisplayLink software refusal blocks route", checkDock({ ...dock, dock: "displaylink" }).status, "incompatible");
check("M1 office DisplayLink allowed", checkDock({ ...dock, mac: "m1-air", dock: "displaylink", software: "yes" }).status, "conditional");
check("Permission unknown is not compatibility", checkDock({ ...dock, dock: "displaylink", software: "unknown" }).status, "unknown");
check("HDCP required is excluded from DisplayLink", checkDock({ ...dock, dock: "displaylink", software: "yes", workload: "protected" }).status, "incompatible");
check("USB-C-only display cannot use this dual-HDMI DisplayLink path", checkDock({ ...dock, dock: "displaylink", software: "yes", input: "usbc" }).status, "incompatible");
check("High-refresh modes are not inferred from 4K60", checkDock({ ...dock, mode: "other" }).status, "unknown");
check("Unknown host does not mean incompatible", checkDock({ ...dock, mac: "future-host" }).status, "unknown");
check("Mixed adapters require evidence", checkDock({ ...dock, input: "mixed" }).status, "unknown");
check("Power shortfall preserves display distinction", checkDock({ ...dock, powerWatts: 140 }).reasons.some((reason) => reason.includes("below your 140W")), true);
const arm = { arm: "lx", kg: 4.48, mm: 25, vesa: "100x100", construction: "approved", curved: "flat", clearance: "yes" };
check("LX flat panel and approved desk", checkArm(arm).status, "conditional");
check("Too-light display fails HX minimum", checkArm({ ...arm, arm: "hx" }).status, "incompatible");
check("LX above maximum fails", checkArm({ ...arm, kg: 12 }).status, "incompatible");
check("Clamp total includes plates", checkArm({ ...arm, mm: 61 }).status, "incompatible");
check("Hollow/glass/unapproved cannot pass from numbers", checkArm({ ...arm, construction: "unknown" }).status, "unknown");
check("Curved torque stays unresolved", checkArm({ ...arm, curved: "curved" }).status, "unknown");
check("VESA adapter is not assumed", checkArm({ ...arm, vesa: "200x200" }).status, "incompatible");
check("Invalid weight is unknown", checkArm({ ...arm, kg: NaN }).status, "unknown");
const pc = { model: "m720q", task: "sata", pcie: "no", hasKit: "yes", ramGb: 0, storageNeed:"yes", storageReady:"yes" };
check("SATA kit and free bay", planMiniPc(pc).status, "conditional");
check("PCIe plus SATA conflict", planMiniPc({ ...pc, pcie: "yes" }).status, "incompatible");
check("Missing carrier/cable stays unresolved", planMiniPc({ ...pc, hasKit: "unknown" }).status, "unknown");
for (const model of ["m720q", "m920q"]) check(`${model} does not have two NVMe sockets`, planMiniPc({ ...pc, model, task: "second-nvme" }).status, "incompatible");
check("M920x confirmed free second NVMe position", planMiniPc({ ...pc, model: "m920x", task: "second-nvme" }).status, "conditional");
check("64GB is not inferred from later reports", planMiniPc({ ...pc, task: "ram", ramGb: 64 }).status, "unknown");
check("32GB needs inspected slots for a quantity plan", planMiniPc({ ...pc, task: "ram", ramGb: 32 }).status, "unknown");
const lan = { pc: 10, adapter: 1, switchRate: 2.5, nas: 2.5, devices: 5, ports: 5, uplinks: 1 };
check("1GbE adapter limits faster switch/NAS", planEthernet(lan).gbps, 1);
check("Upstream uses a physical switch port", planEthernet(lan).sparePorts, -1);
check("2.5Gbps arithmetic ceiling", planEthernet({ ...lan, adapter: 2.5 }).theoreticalMBps, 312.5);
check("Fractional endpoint count rejected", planEthernet({ ...lan, devices: 2.5 }), null);
const queries = [
  ["homeoffice", "TS4", "/reviews/caldigit-ts4-thunderbolt-dock"],
  ["homeoffice", "CalDigit TS4", "/reviews/caldigit-ts4-thunderbolt-dock"],
  ["homeoffice", "TBT4-UD5", "/reviews/plugable-tbt4-ud5-thunderbolt-dock"],
  ["homeoffice", "USBC-6950PDZ", "/reviews/plugable-usbc-6950pdz-displaylink-dock"],
  ["homeoffice", "M720q", "/guides/thinkcentre-m720q-upgrade-compatibility-guide"],
  ["homeoffice", "M920q", "/guides/thinkcentre-m920q-upgrade-compatibility-guide"],
  ["homeoffice", "M920x", "/guides/thinkcentre-m920x-upgrade-compatibility-guide"],
  ["homeoffice", "M720q RAM upgrade", "/guides/thinkcentre-m720q-upgrade-compatibility-guide"],
  ["homeoffice", "M920x SSD", "/guides/thinkcentre-m920x-upgrade-compatibility-guide"],
  ["homeoffice", "U2723QE", "/compatibility/monitor-arms"],
  ["homeoffice", "U3223QE", "/compatibility/monitor-arms"],
  ["homeoffice", "U4025QW", "/compatibility/monitor-arms"],
  ["homeoffice", "Ergotron HX", "/reviews/ergotron-hx-monitor-arm"],
  ["homeoffice", "DisplayLink Thunderbolt", "/best/displaylink-vs-thunderbolt-dock-dual-monitors"],
  ["homeoffice", "Anker 675", "/reviews/anker-675-usb-c-docking-station"],
  ["network", "Deco BE67 BE63", "/best/tp-link-deco-be67-vs-be63"],
  ["network", "NAS Ethernet bottleneck", "/compatibility/ethernet"],
  ["network", "2.5GbE", "/guides/2-5gbe-home-network-upgrade-checklist"],
  ["homeoffice", "monitor arm desk fit", "/compatibility/monitor-arms"],
  ["homeoffice", "MacBook dock compatibility", "/compatibility/docks"],
];
const queryResults = queries.map(([site, query, expected]) => {
  const results = searchContent(siteSearchIndex(site), query);
  const rank = results.findIndex((entry) => entry.href === expected) + 1;
  assert.ok(rank > 0 && rank <= 3, `${query}: expected top 3 ${expected}, got ${JSON.stringify(results.slice(0,3).map((item) => item.href))}`);
  return { site, query, expected, rank };
});
check("Unknown model cannot match generic display words", searchContent(siteSearchIndex("homeoffice"), "TS9999 dual monitor").length, 0);
const all = allSiteSearchIndex();
check("Search has no duplicate destinations", all.length, new Set(all.map((entry) => entry.href)).size);
check("Search excludes retired Tools", all.some((entry) => entry.href.includes("tools.madabase.com")), false);
check("Search excludes isolated soft launches", all.some((entry) => entry.href.includes("satechi-dual-vertical")), false);
check("Filters cannot leak other sites", searchContent(all, "", { site: "network" }).every((entry) => entry.site === "network"), true);
for (const item of [...dockProfiles, ...macProfiles]) for (const id of item.sources) assert.ok(compatibilitySources.some((source) => source.id === id), `Missing evidence ${id}`);
for (const model of miniPcProfiles) {
  if(model.guide) assert.ok(findGuide("homeoffice",model.guide), `Unregistered guide ${model.id}`);
  else assert.ok(siteSearchIndex("homeoffice").some((entry)=>entry.href===`/compatibility/mini-pcs#tiny-model-${model.id}`), `Unregistered model anchor ${model.id}`);
  for(const id of [model.id,`${model.id}-hmm`]) assert.ok(compatibilitySources.some((source)=>source.id===id), `Missing model source ${id}`);
}
for (const topic of compatibilityTopics) for (const link of topic.links.filter((item) => item.href.startsWith("/"))) {
  const [,prefix,slug] = link.href.split("/");
  const finder = { guides: findGuide, reviews: findProduct, best: findRoundup, tools: findTool }[prefix];
  assert.ok(finder?.(topic.site,slug), `Broken topic backlink ${topic.site}:${link.href}`);
}
const source = fs.readFileSync(new URL("../app/search/page.tsx", import.meta.url), "utf8");
assert.ok(source.includes("index: false"), "Search results must stay noindex");

const { activeUpgradeOffers, upgradeOfferRecords, upgradeAffiliateOffer } = loadAffiliateTypescript("../../lib/upgrade-offers.ts");
const { isPublishedCommerceClick } = loadAffiliateTypescript("../../lib/commerce-inventory.ts");
const verifiedOffer = upgradeOfferRecords[0];
assert.equal(activeUpgradeOffers(Date.parse(verifiedOffer.verifiedAt)).length, 1);
assert.equal(activeUpgradeOffers(Date.parse(verifiedOffer.expiresAt)).length, 0, "Expired manually verified offers must close");
const offerUrl = new URL(upgradeAffiliateOffer(verifiedOffer).url);
assert.equal(offerUrl.pathname, `/dp/${verifiedOffer.asin}`);
assert.equal(offerUrl.searchParams.get("tag"), "madaoffice-20");
if (activeUpgradeOffers().length) {
  assert.equal(isPublishedCommerceClick("homeoffice", verifiedOffer.slug, "Amazon US"), true);
  assert.equal(isPublishedCommerceClick("network", verifiedOffer.slug, "Amazon US"), false);
  assert.equal(isPublishedCommerceClick("homeoffice", verifiedOffer.slug, "eBay"), false);
}
const mainIndex = JSON.parse(fs.readFileSync(new URL("../../main/lib/search-index.json",import.meta.url),"utf8"));
const publicationHosts = {main:"madabase.com",homeoffice:"homeoffice.madabase.com",network:"network.madabase.com",smarthome:"smarthome.madabase.com",baby:"baby.madabase.com",pet:"pets.madabase.com",style:"style.madabase.com",costume:"costumes.madabase.com"};
check("Cross-site search publication labels match every destination",mainIndex.every((item)=>new URL(item.href).host===publicationHosts[item.site]),true);
console.log(JSON.stringify({passed:true,engineAndIntegrityChecks:checks,queryCases:queryResults,sourceRecords:compatibilitySources.length,modelGuides:miniPcProfiles.filter((model)=>model.guide).length,documentedModelProfiles:miniPcProfiles.length,exactAmazonOfferChecks:7},null,2));
