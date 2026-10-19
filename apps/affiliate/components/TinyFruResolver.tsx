"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { machineIdentity, resolveFruShopping, fruRoleLabels, type FruShoppingInput } from "@/lib/tiny-fru";
import { miniPcProfiles } from "@/lib/tiny-models";
import { componentAffiliateOffer } from "@/lib/upgrade-offers";
import { AffiliateButton } from "./AffiliateButton";

export function TinyFruResolver({modelId}:{modelId:string}) {
  const model = miniPcProfiles.find((item) => item.id === modelId);
  const [machine,setMachine] = useState("");
  const [ready,setReady] = useState(false);
  const [result,setResult] = useState<ReturnType<typeof resolveFruShopping>|null>(null);
  const [request,setRequest] = useState<FruShoppingInput|null>(null);
  const [copyText,setCopyText] = useState("");
  const [copied,setCopied] = useState(false);
  useEffect(() => setReady(true),[]);
  const identity = machineIdentity(modelId,machine);
  useEffect(()=>{if(result){const node=document.getElementById("tiny-fru-result");node?.focus({preventScroll:true});node?.scrollIntoView({behavior:"smooth",block:"start"});}},[result]);
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const f=new FormData(event.currentTarget);const get=(name:string)=>String(f.get(name)??"");
    const input={model:modelId,machine,need:get("need"),scope:get("scope"),cable:get("cable"),carrier:get("carrier"),ownsCable:f.has("ownsCable"),ownsCarrier:f.has("ownsCarrier"),photos:get("photos"),bay:get("bay")};
    setRequest(input);setResult(resolveFruShopping(input));
  }
  async function copy() {
    if (!result || !request) return;
    const text=[`${model?.name} — SATA parts record`,`Machine type: ${result.identity.type}; evidence entered: ${request.scope}`,`Cable FRU: ${result.cable || "not recorded"}; carrier FRU: ${result.carrier || "not recorded"}`,`Already owned: cable ${request.ownsCable ? "yes" : "no"}; carrier ${request.ownsCarrier ? "yes" : "no"}`,`Missing: ${result.noBuy ? "No duplicate kit purchase needed for this goal" : result.missing.join(", ")}`,`Decision: ${result.status}; this is the reader's recorded check, not Madabase verification of the unit.`,...result.issues,result.noBuy ? "New cable/carrier purchase cost: 0. Verify existing parts before reuse." : "Delivered cost and any additional hardware: unknown; compare the complete upgrade bill.",...result.identity.candidates.map((row)=>`${row.part} — ${row.url}`)].join("\n");
    try {await navigator.clipboard.writeText(text);setCopied(true);} catch {setCopyText(text);}
  }
  return <section id="tiny-fru-check" className="discovery-card mt-6" style={{scrollMarginTop:110}} aria-label="Machine-specific FRU record">
    <h2>Resolve this machine’s SATA cable and carrier</h2>
    <p>Use the chassis label and Lenovo’s exact-configuration parts record. Record the two FRUs separately; a family-level marketplace title is not enough.</p>
    <p><a href="https://support.lenovo.com/us/en/parts-lookup" target="_blank" rel="noopener noreferrer">Open Lenovo Parts Lookup</a> · <Link href="/compatibility/mini-pcs#tiny-fru-reference">Read the checked machine-type candidates</Link></p>
    {!model ? <p>Select an exact Tiny model in the setup checker above to start this record.</p> : <>
      <p><strong>{model.name}</strong> · This profile’s documented machine types: {model.machineTypes.join(", ")}.</p>
      <p className="evidence-note">Enter a serial only on Lenovo’s website. This form asks for the machine type/MTM and part numbers, keeps them in this page, and makes no background lookup or installation certification.</p>
      <form onSubmit={submit} onChange={()=>{setResult(null);setCopied(false);setCopyText("");}}>
        {!ready ? <p>Preparing the parts record…</p> : null}
        <fieldset disabled={!ready} className="compat-form"><legend>Machine and parts evidence</legend>
          <label>Four-character machine type or ten-character MTM<input name="machine" maxLength={14} placeholder="For example: 10T7" value={machine} onChange={(e)=>setMachine(e.target.value)} autoComplete="off" required /></label>
          <label>Does a storage need or diagnosed fault require this installation?<select name="need" defaultValue="unknown"><option value="unknown">Not established</option><option value="yes">Yes</option><option value="no">No — existing storage is sufficient</option></select></label>
          <div className="compat-wide">{identity.matches ? identity.candidates.length ? <><h3>Candidate numbers for type {identity.type}</h3><ul>{identity.candidates.map((row)=><li key={row.part}><strong>{fruRoleLabels[row.role]}: {row.part}</strong> · {row.name} · <a href={row.url} target="_blank" rel="noopener noreferrer">Lenovo Machine Type catalog</a></li>)}</ul><p>These do not establish which part your unit needs. In Lenovo, use As-Built / supported substitutes or the full MTM; confirm the actual fitted hardware.</p></> : <p>The manual covers this type, but its part candidates have not been checked in this library. Continue on Lenovo; no number is inferred from a nearby type.</p> : machine ? <p>{identity.other && identity.other.id !== modelId ? `This type is documented for ${identity.other.name}. Correct the selected model.` : "Use a type listed in the selected manual, or find the unlisted type’s own manual on Lenovo."}</p> : null}</div>
          <label>What exact configuration did you check on Lenovo?<select name="scope" defaultValue="unknown"><option value="unknown">Not checked</option><option value="type">Machine Type catalog only</option><option value="mtm">Full ten-character MTM and supported parts</option><option value="serial">Serial-specific As-Built / supported substitute record</option></select></label>
          <label>SATA cable FRU from that record<input name="cable" maxLength={12} placeholder="Copy the exact cable FRU" autoComplete="off" /></label>
          <label>Drive carrier FRU from that record<input name="carrier" maxLength={12} placeholder="Copy the exact carrier FRU" autoComplete="off" /></label>
          <label><input type="checkbox" name="ownsCable" /> Already have the required cable</label><label><input type="checkbox" name="ownsCarrier" /> Already have the required carrier</label>
          <label>Actual seller photos match the FRUs, connectors, carrier style and retaining pieces?<select name="photos" defaultValue="unknown"><option value="unknown">Not confirmed</option><option value="yes">Yes — checked actual parts and included hardware</option><option value="no">No / conflicting photos</option></select></label>
          <label>Drive bay and cable path clear of conflicting expansion hardware?<select name="bay" defaultValue="unknown"><option value="unknown">Not inspected</option><option value="yes">Yes — physically checked</option><option value="no">No — occupied or conflicting assembly</option></select></label>
          <button type="submit" className="compat-wide">Check missing SATA parts</button>
        </fieldset>
      </form>
      {result ? <section id="tiny-fru-result" tabIndex={-1} style={{scrollMarginTop:110}} className="mt-5" aria-label="FRU shopping result" aria-live="polite">
        <h3>{result.noBuy ? "Keep the parts; buy no duplicate kit" : result.offers.length ? "A conditional listing for your recorded pair" : "Hold the parts purchase"}</h3>
        <p>{result.noBuy ? "No new cable/carrier kit is needed for this stated goal. Reuse still requires the exact fit checks before installation." : `Missing: ${result.missing.join("; ") || "no new kit components"}.`}</p>
        <ul>{result.issues.map((issue)=><li key={issue}>{issue}</li>)}</ul>
        <p className="evidence-note">This compares your recorded numbers with the checked catalog and listing. Madabase has not accessed your serial record, inspected your unit or tested these parts.</p>
        {result.offers.map((offer)=><article className="discovery-card" key={offer.asin}><h3>{offer.name}</h3><p>One kit contains one cable and one carrier. No SSD is included. Delivered cost and any further mounting pieces remain for your complete bill.</p><p>{offer.limits}</p><p className="evidence-note">Paid link: as an Amazon Associate we earn from qualifying purchases. Exact listing checked October 19, 2026; seller, stock, delivery and return terms can change.</p><AffiliateButton site={offer.site} product={{slug:offer.slug,name:offer.name,asin:offer.asin,specs:{ASIN:offer.asin}}} offer={componentAffiliateOffer(offer)} position="tiny-fru-confirmed-pair" resolveCreatorsListing={false} /></article>)}
        <button type="button" className="decision-button" onClick={copy}>Copy this FRU record</button><span role="status">{copied ? " FRU record copied." : ""}</span>{copyText ? <label>Select and copy your FRU record<textarea readOnly rows={7} value={copyText} /></label> : null}
      </section> : null}
    </>}
  </section>;
}
