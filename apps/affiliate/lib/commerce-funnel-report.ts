import type { CommerceEvent } from "./commerce-events";
type Row = CommerceEvent & {createdAt:string | Date};

export function commerceFunnelReport(events: readonly Row[], start: string, end: string) {
  const from = Date.parse(start), until = Date.parse(end);
  if (!Number.isFinite(from) || !Number.isFinite(until) || from >= until) throw new Error("A valid start-inclusive/end-exclusive period is required.");
  const pages = new Map<string,{dimensions:object;content:Set<string>;clicks:Set<string>}>();
  const buttons = new Map<string,{dimensions:object;views:Set<string>;clicks:Set<string>}>();
  for(const event of events) {
    const at = new Date(event.createdAt).getTime();
    if (at < from || at >= until || !Number.isFinite(at)) continue;
    const dimensions = {site:event.site,path:event.path,releaseId:event.releaseId,device:event.device,market:event.market,channel:event.channel,source:event.source,campaign:event.campaign};
    const key = JSON.stringify(dimensions);
    const page = pages.get(key) ?? {dimensions,content:new Set<string>(),clicks:new Set<string>()};
    if (event.eventType === "content_view") page.content.add(event.sessionId);
    if (event.eventType === "affiliate_click") page.clicks.add(event.sessionId);
    pages.set(key,page);
    if (event.eventType === "content_view") continue;
    const buttonDimensions = {...dimensions,productSlug:event.productSlug,merchant:event.merchant,position:event.position};
    const buttonKey = JSON.stringify(buttonDimensions);
    const button = buttons.get(buttonKey) ?? {dimensions:buttonDimensions,views:new Set<string>(),clicks:new Set<string>()};
    if(event.eventType === "cta_view") button.views.add(event.sessionId);
    if(event.eventType === "affiliate_click") button.clicks.add(event.sessionId);
    buttons.set(buttonKey,button);
  }
  const intersect = (a:Set<string>,b:Set<string>) => [...a].filter(id=>b.has(id)).length;
  const rate = (a:number,b:number) => b ? Number((100*a/b).toFixed(2)) : null;
  return {period:{start,end,endExclusive:true},definitions:{content:"Eligible content visible continuously for one second, or an intentional shopping click.",cta:"At least 50% of a CTA visible continuously for one second while the tab is visible.",session:"Anonymous tab session; new after 30 minutes without a measured content/CTA interaction.",attribution:"Entry source/channel/campaign retained for the session; no raw referrer or form inputs.",rate:"Unique clicking sessions intersected with the matching observed denominator, within the same page/release/device/market/channel/period. Clicks missing an exposure are reported separately; totals are not order counts."},
    pages:[...pages.values()].map(({dimensions,content,clicks})=>({...dimensions,contentSessions:content.size,clickSessions:clicks.size,matchedClickSessions:intersect(content,clicks),clickSessionsWithoutContentView:clicks.size-intersect(content,clicks),shoppingSessionRatePercent:rate(intersect(content,clicks),content.size)})),
    buttons:[...buttons.values()].map(({dimensions,views,clicks})=>({...dimensions,exposedSessions:views.size,clickSessions:clicks.size,matchedClickSessions:intersect(views,clicks),clickSessionsWithoutQualifiedExposure:clicks.size-intersect(views,clicks),observedButtonCtrPercent:rate(intersect(views,clicks),views.size)}))};
}
