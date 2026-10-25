import type { SearchEntry } from "../../shared/content-search";

// A task taxonomy sits above legacy categories; published canonicals keep their identity.
export const discoveryTopics = [
  { id: "displays", site: "homeoffice", label: "Docks & displays", pattern: /dock|displaylink|thunderbolt|usb.c.*hub|monitor hub|dual.monitor|ultrawide|(?:vertical|portrait|portable|office) monitors?|monitor.*calibrat|colorimeters?/i },
  { id: "mounts", site: "homeoffice", label: "Monitor arms & mounting", pattern: /monitor.arm|vesa|clamp|ergotron|monitor.mount/i },
  { id: "tiny", site: "homeoffice", label: "Tiny PC upgrades", pattern: /thinkcentre|m720q|m920q|m920x|tiny.*pc/i },
  { id: "seating", site: "homeoffice", label: "Chairs & posture", pattern: /chair|seat|lumbar|footrest|foot.rest/i },
  { id: "meetings", site: "homeoffice", label: "Calls, cameras & lighting", pattern: /webcam|document.camera|microphone|meeting|light|screenbar|video.call|headset|speakerphone|audio.interface/i },
  { id: "printing", site: "homeoffice", label: "Printing & scanning", pattern: /printer|scanner|scanning/i },
  { id: "desks", site: "homeoffice", label: "Desks & workspace", pattern: /desk|workspace|walking|keyboard|mouse|mice|trackball|cable/i },
  { id: "nas", site: "network", label: "Ethernet, NAS & switches", pattern: /\bpoe\b|power.over.ethernet|ethernet|nas|switch|gbe|wired|nic|usb.*adapter|bottleneck/i },
  { id: "mesh", site: "network", label: "Wi-Fi, routers & mesh", pattern: /wifi|wi.fi|mesh|router|deco|orbi|backhaul/i },
  { id: "backup", site: "network", label: "Network backup power", pattern: /ups|power|outage|battery/i },
];
// Broad setup guides mention several tasks. Keep their primary route stable as
// editorial titles change instead of letting a secondary word choose the task.
const canonicalTaskOverrides: Record<string, string> = {
  "homeoffice:/guides/small-home-office-setup-guide": "desks",
};
export function entryTopic(entry: Pick<SearchEntry, "site" | "title" | "aliases" | "familySlug"> & Partial<Pick<SearchEntry, "href">>) {
  const path = entry.href?.replace(/^https?:\/\/[^/]+/, "").split(/[?#]/)[0];
  const canonicalTopic = path && canonicalTaskOverrides[`${entry.site}:${path}`];
  if (canonicalTopic) return canonicalTopic;
  const family = entry.familySlug?.replace(/-/g, " ");
  // A router or NAS can be the load in a UPS guide, rather than its main task.
  const primaryText = family ?? entry.title;
  if (entry.site === "network" && /\bups\b|uninterruptible|backup.?power|power.?backup|battery.?backup/i.test(primaryText)) return "backup";
  const familyTopic = family && discoveryTopics.find((topic) => topic.site === entry.site && topic.pattern.test(family));
  if (familyTopic) return familyTopic.id;
  const text = `${entry.title} ${(entry.aliases ?? []).join(" ")}`;
  return discoveryTopics.find((topic) => topic.site === entry.site && topic.pattern.test(text))?.id ?? "other";
}
export function topicsForSite(site: string) { return discoveryTopics.filter((topic) => topic.site === site); }
