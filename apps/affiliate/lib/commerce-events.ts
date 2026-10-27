export const commerceEventTypes = ["content_view", "cta_view", "affiliate_click"] as const;
export type CommerceEventType = typeof commerceEventTypes[number];
export type CommerceEvent = {
  eventType: CommerceEventType;
  sessionId: string;
  site: string;
  path: string;
  pageType: string;
  market: string;
  releaseId: string;
  device: string;
  channel: string;
  source: string;
  campaign: string;
  productSlug: string;
  merchant: string;
  position: string;
};
const siteHosts: Record<string,string> = {homeoffice:"homeoffice",network:"network",smarthome:"smarthome",baby:"baby",pet:"pets",};
const localeMarkets: Record<string,string> = {"en-gb":"gb","en-ca":"ca","de-de":"de","nl-nl":"nl"};

export function commercePage(path: string) {
  const match = /^\/(?:(en-gb|en-ca|de-de|nl-nl)\/)?(guides|reviews|best|tools|compatibility|categories|products)\/([a-z0-9-]+)\/?$/.exec(path);
  return match ? {pageType:match[2],market:localeMarkets[match[1]] ?? "us"} : undefined;
}
export function knownAutomation(userAgent: string) { return /bot\b|crawler|spider|headless|lighthouse|pagespeed|prerender|preview|facebookexternalhit|slurp/i.test(userAgent); }
export function commerceContextChannel(referrer: string, search: string) {
  const query = new URLSearchParams(search);
  const safe = (value: string | null) => value && /^[a-z0-9_-]{1,64}$/i.test(value) ? value.toLowerCase() : "";
  const utmSource = safe(query.get("utm_source"));
  const medium = safe(query.get("utm_medium"));
  let host = "";
  try { host = new URL(referrer).hostname.toLowerCase(); } catch { /* Direct visit. */ }
  const name = utmSource || (/^(www\.)?(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host) ? host.replace(/^www\./, "").split(".")[0]
    : /(^|\.)pinterest\.[a-z.]+$/.test(host) ? "pinterest" : /(^|\.)facebook\.com$/.test(host) ? "facebook" : /(^|\.)instagram\.com$/.test(host) ? "instagram" : "");
  const channel = /^(cpc|ppc|paid|paid_social)$/.test(medium) ? "paid" : ["google","bing","duckduckgo","search"].includes(name) ? "search" : ["pinterest","facebook","instagram"].includes(name) || medium === "social" ? "social" : host && !/(^|\.)madabase\.com$/.test(host) ? "referral" : "direct";
  return {channel,source:name || (channel === "referral" ? "other" : "direct"),campaign:safe(query.get("utm_campaign"))};
}

export function validateCommerceEvent(body: unknown, host: string): CommerceEvent | undefined {
  if (!body || typeof body !== "object") return;
  const value = body as Record<string,unknown>;
  const text = (name: string, max: number) => typeof value[name] === "string" && (value[name] as string).length <= max ? (value[name] as string).trim() : "";
  const eventType = text("eventType",30) as CommerceEventType;
  const path = text("path",220);
  const page = commercePage(path);
  const site = text("site",20);
  const sessionId = text("sessionId",40);
  if (!page || !siteHosts[site] || !commerceEventTypes.includes(eventType) || !/^[a-f0-9-]{36}$/.test(sessionId)) return;
  if (host !== `${siteHosts[site]}.madabase.com` && host !== `${siteHosts[site]}.localhost` && host !== "localhost" && host !== "127.0.0.1") return;
  const releaseId = text("releaseId",80);
  const device = text("device",10);
  const channel = text("channel",10);
  const source = text("source",64);
  const campaign = text("campaign",64);
  if (!/^[a-z0-9._-]{1,80}$/i.test(releaseId) || !["mobile","tablet","desktop"].includes(device) || !["direct","search","social","referral","paid"].includes(channel) || !/^[a-z0-9_-]{1,64}$/i.test(source) || (campaign && !/^[a-z0-9_-]{1,64}$/i.test(campaign))) return;
  const productSlug = text("productSlug",180), merchant = text("merchant",80), position = text("position",100);
  if (eventType !== "content_view" && (!/^[a-z0-9-]+$/i.test(productSlug) || !merchant || !/^[a-z0-9_-]+$/i.test(position))) return;
  return {eventType,sessionId,site,path,pageType:page.pageType,market:page.market,releaseId,device,channel,source,campaign,
    productSlug:eventType === "content_view" ? "" : productSlug,merchant:eventType === "content_view" ? "" : merchant,position:eventType === "content_view" ? "" : position};
}

// Pure state transitions make continuous visibility (including tab hiding)
// testable without relying on browser timer precision.
export function exposureStartedAt(previous: number | undefined, ratio: number, visible: boolean, now: number) {
  return visible && ratio >= 0.5 ? previous ?? now : undefined;
}
export function exposureQualified(startedAt: number | undefined, now: number) { return startedAt !== undefined && now - startedAt >= 1000; }
