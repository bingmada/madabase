import type { SearchEntry } from "../../shared/content-search";

// A task taxonomy sits above legacy categories; published canonicals keep their identity.
export const discoveryTopics = [
  { id: "displays", site: "homeoffice", label: "Docks & displays", pattern: /dock|displaylink|thunderbolt|usb.c.*hub|monitor hub|dual.monitor/i },
  { id: "mounts", site: "homeoffice", label: "Monitor arms & mounting", pattern: /monitor.arm|vesa|clamp|ergotron|monitor.mount/i },
  { id: "tiny", site: "homeoffice", label: "Tiny PC upgrades", pattern: /thinkcentre|m720q|m920q|m920x|tiny.*pc/i },
  { id: "seating", site: "homeoffice", label: "Chairs & posture", pattern: /chair|seat|lumbar|footrest|foot.rest/i },
  { id: "meetings", site: "homeoffice", label: "Calls, cameras & lighting", pattern: /webcam|microphone|meeting|light|screenbar|video.call/i },
  { id: "desks", site: "homeoffice", label: "Desks & workspace", pattern: /desk|workspace|walking|keyboard|mouse|cable/i },
  { id: "nas", site: "network", label: "Ethernet, NAS & switches", pattern: /ethernet|nas|switch|gbe|wired|nic|usb.*adapter|bottleneck/i },
  { id: "mesh", site: "network", label: "Wi-Fi, routers & mesh", pattern: /wifi|wi.fi|mesh|router|deco|orbi|backhaul/i },
  { id: "backup", site: "network", label: "Network backup power", pattern: /ups|power|outage|battery/i },
];
export function entryTopic(entry: Pick<SearchEntry, "site" | "title" | "aliases">) {
  const text = `${entry.title} ${(entry.aliases ?? []).join(" ")}`;
  return discoveryTopics.find((topic) => topic.site === entry.site && topic.pattern.test(text))?.id ?? "other";
}
export function topicsForSite(site: string) { return discoveryTopics.filter((topic) => topic.site === site); }
