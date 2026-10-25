"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isQaVisit } from "../../../shared/analytics-traffic";
import { commerceContextChannel, commercePage, exposureQualified, exposureStartedAt, knownAutomation, type CommerceEventType } from "@/lib/commerce-events";

type Entry = ReturnType<typeof commerceContextChannel>;
type Session = {id:string;last:number;entry:Entry};
let fallbackSession: Session | undefined;
const delivered = new Set<string>();
const pending = new Set<string>();
function currentSession(): Session {
  let session = fallbackSession;
  try { session = JSON.parse(sessionStorage.getItem("madabase:commerce-session") || "null") ?? session; } catch { /* Storage is optional. */ }
  if (!session || typeof session !== "object" || !/^[a-f0-9-]{36}$/.test(session.id) || !Number.isFinite(session.last) || !session.entry || Date.now() - session.last > 30*60*1000) session = {id:crypto.randomUUID(),last:Date.now(),entry:commerceContextChannel(document.referrer,location.search)};
  session.last = Date.now(); fallbackSession = session;
  try { sessionStorage.setItem("madabase:commerce-session",JSON.stringify(session)); } catch { /* In-memory session for this document. */ }
  return session;
}

export function CommerceAnalytics({site,releaseId}: {site:string;releaseId:string}) {
  const path = usePathname();
  useEffect(() => {
    if (!commercePage(path) || isQaVisit() || navigator.webdriver || knownAutomation(navigator.userAgent) || !location.hostname.endsWith(".madabase.com")) return;
    const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent) ? "tablet" : /Mobile|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop";
    let stopped = false;
    async function emit(eventType: CommerceEventType, anchor?: HTMLAnchorElement) {
      if (isQaVisit() || stopped) return;
      const session = currentSession();
      const productSlug = anchor?.dataset.commerceProduct ?? "";
      const merchant = anchor?.dataset.commerceMerchant ?? "";
      const position = anchor?.dataset.commercePosition ?? "";
      const key = JSON.stringify([session.id,site,path,releaseId,eventType,productSlug,merchant,position]);
      if (delivered.has(key) || pending.has(key)) return;
      try { if (sessionStorage.getItem(`madabase:commerce:${key}`)) return; } catch { /* In-memory dedup remains. */ }
      pending.add(key);
      try {
        const response = await fetch("/api/commerce-events",{method:"POST",headers:{"content-type":"application/json"},keepalive:true,body:JSON.stringify({eventType,sessionId:session.id,site,path,releaseId,device,...session.entry,productSlug,merchant,position})});
        const result = await response.json();
        if (!response.ok || !result.persisted) throw new Error(result.reason || "not_persisted");
        delivered.add(key);
        try { sessionStorage.setItem(`madabase:commerce:${key}`,"1"); } catch { /* Server also deduplicates. */ }
      } catch { console.warn("commerce_event_not_persisted",{eventType,site,path,position}); }
      finally { pending.delete(key); }
    }
    const states = new Map<HTMLAnchorElement,{ratio:number;start?:number;timer?:ReturnType<typeof setTimeout>}>();
    let contentStart: number | undefined;
    let contentTimer: ReturnType<typeof setTimeout> | undefined;
    function contentVisibility() {
      clearTimeout(contentTimer);
      contentStart = exposureStartedAt(contentStart,1,document.visibilityState === "visible",Date.now());
      if (contentStart !== undefined) contentTimer = setTimeout(() => {
        if(document.visibilityState === "visible" && exposureQualified(contentStart,Date.now())) void emit("content_view");
      },1005);
    }
    function update(anchor: HTMLAnchorElement, ratio: number) {
      const state = states.get(anchor) ?? {ratio:0};
      clearTimeout(state.timer);
      state.ratio = ratio;
      state.start = exposureStartedAt(state.start,ratio,document.visibilityState === "visible" && anchor.isConnected,Date.now());
      if (state.start !== undefined) state.timer = setTimeout(() => {
        if (!anchor.isConnected || document.visibilityState !== "visible" || !exposureQualified(state.start,Date.now())) return;
        void emit("content_view"); void emit("cta_view",anchor);
      },1005);
      states.set(anchor,state);
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => update(entry.target as HTMLAnchorElement,entry.intersectionRatio)),{threshold:[0,0.5,1]});
    const selector = 'a[data-commerce-product][data-commerce-merchant][data-commerce-position]';
    function discover() {
      for(const [anchor,state] of states) if(!anchor.isConnected) {clearTimeout(state.timer);observer.unobserve(anchor);states.delete(anchor);}
      document.querySelectorAll<HTMLAnchorElement>(selector).forEach(anchor => {if(!states.has(anchor)) {states.set(anchor,{ratio:0});observer.observe(anchor);}});
    }
    function visibility() { contentVisibility(); states.forEach((state,anchor) => update(anchor,state.ratio)); }
    function click(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(selector);
      if (!anchor || !event.isTrusted) return;
      // An intentional click qualifies a content session even before one second.
      void emit("content_view"); void emit("affiliate_click",anchor);
    }
    const mutations = new MutationObserver(discover);
    discover(); contentVisibility(); mutations.observe(document.body,{childList:true,subtree:true});
    document.addEventListener("visibilitychange",visibility); document.addEventListener("click",click,true);
    return () => {stopped=true;clearTimeout(contentTimer);states.forEach(state=>clearTimeout(state.timer));observer.disconnect();mutations.disconnect();document.removeEventListener("visibilitychange",visibility);document.removeEventListener("click",click,true);};
  },[path,site,releaseId]);
  return null;
}
