export type NetworkPlanKind = "mesh"|"wifi"|"ethernet";
export type NetworkDraft = {version:1;kind:NetworkPlanKind;at:number;values:Record<string,string>};
const names:Record<NetworkPlanKind,string[]>={mesh:["primary","secondary","keyboard"],wifi:["primary","secondary","keyboard"],ethernet:["path","target","pc","adapter","switchRate","nas","devices","ports","uplinks","routerLan","routerWan","internet","cable"]};
export function validateNetworkDraft(value:unknown,kind:NetworkPlanKind,now=Date.now()):NetworkDraft|null {
  if(!value||typeof value!=="object")return null;
  const draft=value as Partial<NetworkDraft>;
  if(draft.version!==1||draft.kind!==kind||typeof draft.at!=="number"||!Number.isFinite(draft.at)||draft.at>now+60000||now-draft.at>24*60*60*1000||!draft.values||typeof draft.values!=="object"||Array.isArray(draft.values))return null;
  const values:Record<string,string>={};
  for(const [key,v] of Object.entries(draft.values)){
    if(!names[kind].includes(key)||typeof v!=="string"||v.length>30)return null;
    if(!["path","cable"].includes(key)&&v!==""&&!/^\d{1,8}(?:\.\d{1,6})?$/.test(v))return null;
    if(key==="path"&&!["same-switch","router-transit","direct","internet"].includes(v))return null;
    if(key==="cable"&&v!==""&&!["yes","no","unknown"].includes(v))return null;
    values[key]=v;
  }
  return {version:1,kind,at:draft.at!,values};
}
export const networkDraftKey=(kind:NetworkPlanKind)=>`madabase:network-plan:v1:${kind}`;
