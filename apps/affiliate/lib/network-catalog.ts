import { cache } from "react";
import { siteGuides, siteProducts, siteRoundups, siteTools } from "./content";
import { networkPagePlan, networkTopic, type NetworkTopicId } from "./network-journeys";

export type NetworkEntry = {path:string;title:string;description:string;kind:string;topic:NetworkTopicId;hidden:boolean};
export const networkCatalog = cache(():NetworkEntry[] => [
  ...siteGuides("network").map(item=>({path:`/guides/${item.slug}`,title:item.title,description:item.quickAnswer??item.dek,kind:"Guide",hidden:Boolean(item.discoveryExcluded)})),
  ...siteProducts("network").map(item=>({path:`/reviews/${item.slug}`,title:item.amazonTitle??item.name,description:item.verdict??item.summary,kind:"Model reference",hidden:Boolean(item.discoveryExcluded)})),
  ...siteRoundups("network").map(item=>({path:`/best/${item.slug}`,title:item.title,description:item.quickAnswer??item.dek,kind:"Comparison",hidden:Boolean(item.discoveryExcluded)})),
  ...siteTools("network").map(item=>({path:`/tools/${item.slug}`,title:item.title,description:item.dek,kind:"Planner",hidden:Boolean(item.discoveryExcluded)})),
  {path:"/compatibility/ethernet",title:"NAS and Ethernet bottleneck checker",description:"Map the physical traffic path, negotiated rates and switch ports before choosing a faster component.",kind:"Checker",hidden:false},
].map(item=>{
  const plan=networkPagePlan(item.path);
  if(!plan) throw new Error(`Network page needs an editorial path: ${item.path}`);
  return {...item,topic:plan.topic};
}));

export function networkEntry(path:string) {return networkCatalog().find(item=>item.path===path);}
export function networkTopicEntries(topic:NetworkTopicId) {return networkCatalog().filter(item=>item.topic===topic&&!item.hidden);}
export function networkLinkTitle(path:string) {
  if(path.startsWith("https://homeoffice.madabase.com/compatibility/docks"))return "Check the host, displays and complete dock path";
  if(path.startsWith("https://homeoffice.madabase.com/compatibility/mini-pcs"))return "Check the exact Tiny model, slots and missing parts";
  return networkEntry(path)?.title ?? networkTopic(networkPagePlan(path)?.topic??"wired-speed").name;
}
