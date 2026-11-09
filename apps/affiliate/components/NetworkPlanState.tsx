"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { networkDraftKey,validateNetworkDraft,type NetworkDraft,type NetworkPlanKind } from "@/lib/network-plan-state";
import type { NetworkTopicId } from "@/lib/network-journeys";
import { discoveryEvent } from "../../shared/SearchControls";

export function readNetworkDraft(kind:NetworkPlanKind):NetworkDraft|null {
  try{return validateNetworkDraft(JSON.parse(sessionStorage.getItem(networkDraftKey(kind))??"null"),kind);}catch{return null;}
}
export function saveNetworkDraft(kind:NetworkPlanKind,values:Record<string,string>) {
  try{
    const draft=validateNetworkDraft({version:1,kind,at:Date.now(),values},kind);
    if(draft)sessionStorage.setItem(networkDraftKey(kind),JSON.stringify(draft));
    else sessionStorage.removeItem(networkDraftKey(kind));
    window.dispatchEvent(new Event("network-plan-change"));
  }catch{/* The form still works when storage is unavailable. */}
}
export function clearNetworkDraft(kind:NetworkPlanKind){try{sessionStorage.removeItem(networkDraftKey(kind));window.dispatchEvent(new Event("network-plan-change"));}catch{/* Optional storage. */}}

export function NetworkPlanSummary({topic,currentPath}:{topic:NetworkTopicId;currentPath:string}) {
  const [draft,setDraft]=useState<NetworkDraft|null>(null);
  useEffect(()=>{
    const kinds:NetworkPlanKind[]=topic==="wired-speed"?["ethernet"]:["coverage","mesh","access-points"].includes(topic)?["mesh","wifi"]:[];
    function load(){setDraft(kinds.map(readNetworkDraft).filter((x):x is NetworkDraft=>Boolean(x)).sort((a,b)=>b.at-a.at)[0]??null);}
    load();window.addEventListener("network-plan-change",load);return()=>window.removeEventListener("network-plan-change",load);
  },[topic,currentPath]);
  if(!draft)return null;
  const path=draft.kind==="ethernet"?"/compatibility/ethernet":`/tools/${draft.kind==="mesh"?"mesh-node-and-backhaul-planner":"wifi-coverage-estimator"}`;
  if(path===currentPath)return null;
  const summary=draft.kind==="ethernet"?`Traffic path: ${({"same-switch":"PC → same switch → NAS","router-transit":"PC → switch → router LAN → NAS",direct:"PC → NAS",internet:"PC → router → internet"} as Record<string,string>)[draft.values.path]??"not yet selected"}. Required link-rate target: ${draft.values.target?`${draft.values.target}Gbps`:"unknown"}.`:`Home size: ${draft.values.primary||"unknown"} sq ft. ${draft.kind==="mesh"?"Floors":"Connected devices"}: ${draft.values.secondary||"unknown"}.`;
  return <aside className="network-plan-summary" data-network-saved-plan="true" data-clarity-mask="true"><strong>Your saved planning inputs</strong><p>{summary} Recheck these inputs for this decision; they do not verify the model, coverage or a buying quantity.</p><div><Link href={path}>Return to this plan →</Link><button type="button" onClick={()=>{clearNetworkDraft(draft.kind);setDraft(null);}}>Clear saved plan</button></div></aside>;
}

export function NetworkJourneyEvents(){useEffect(()=>{
  function click(event:MouseEvent){if(!event.isTrusted)return;const anchor=(event.target as Element|null)?.closest<HTMLAnchorElement>("a[data-network-next],a[data-network-task]");if(!anchor)return;discoveryEvent(anchor.dataset.networkTask?"network_task_start":"network_continue",anchor.dataset.networkTask??`${anchor.dataset.networkNext}:${anchor.getAttribute("href")}`);}
  document.addEventListener("click",click);return()=>document.removeEventListener("click",click);
},[]);return null;}
