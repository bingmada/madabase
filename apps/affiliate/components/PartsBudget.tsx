"use client";
import { useEffect, useState } from "react";
import { costSummary, type PlanPart } from "@/lib/upgrade-parts";
import { evidenceSources } from "@/lib/compatibility-data";
import { matchingComponentOffers, componentAffiliateOffer } from "@/lib/upgrade-offers";
import { AffiliateButton } from "./AffiliateButton";

export type PartsWorksheet = {currency:string; lines:{name:string; quantity:string; owned:boolean; cost:string}[]};
export function PartsBudget({ parts, allowComponents = false, onWorksheetChange }: { parts: PlanPart[]; allowComponents?: boolean; onWorksheetChange?: (value:PartsWorksheet) => void }) {
  const [lines,setLines] = useState(parts.map((part) => ({owned:part.purchaseCount === 0,cost:""})));
  const [currency,setCurrency] = useState("USD");
  useEffect(() => { onWorksheetChange?.({currency,lines:parts.map((part,index) => ({name:part.name,quantity:part.quantity,...lines[index]}))}); },[parts,lines,currency,onWorksheetChange]);
  const update = (index: number, change: Partial<typeof lines[number]>) => setLines(lines.map((line,i) => i === index ? {...line,...change} : line));
  const summary = costSummary(lines);
  const offers = allowComponents ? matchingComponentOffers(parts,lines.map((line) => line.owned)) : [];
  const unmatchedMemory = parts.find((part,index) => part.id === "memory" && (part.purchaseCount ?? 0) > 0 && !lines[index].owned && !offers.some((offer) => offer.part === "memory"));
  return <section className="parts-budget">
    <h3>Complete parts and cost worksheet</h3>
    <p>Mark reusable items; enter a delivered line cost in one currency, including quantity, shipping and tax. Zero-purchase lines are excluded automatically. Blank costs remain unknown; this worksheet does not approve an unresolved part.</p>
    <label>Currency <select value={currency} onChange={(event) => setCurrency(event.target.value)}><option>USD</option><option>GBP</option><option>EUR</option><option>CAD</option><option>AUD</option></select></label>
    <div className="compat-table-wrap"><table className="compat-table">
      <thead><tr><th>Required item</th><th>Identity / assembly check</th><th>Reuse / delivered cost</th></tr></thead>
      <tbody>{parts.map((part,index) => <tr key={part.id}>
        <th scope="row">{part.name}<p>{part.quantity}</p></th>
        <td>{part.check}{part.reference ? <p><strong>{part.reference}</strong></p> : null}{evidenceSources([part.source]).map((source) => <p key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.locator}</p>)}</td>
        <td><label><input type="checkbox" checked={lines[index].owned} disabled={part.purchaseCount === 0} onChange={(event) => update(index,{owned:event.target.checked})} /> Already have / no purchase needed: {part.name}</label><label>Delivered line cost: {part.name}<input type="number" min="0" step="0.01" value={lines[index].cost} disabled={lines[index].owned} onChange={(event) => update(index,{cost:event.target.value})} /></label></td>
      </tr>)}</tbody>
    </table></div>
    <p role="status">{summary.total === null ? `Known subtotal ${currency} ${summary.subtotal.toFixed(2)}; ${summary.missing} line cost(s) still unknown. Complete total unavailable.` : `Entered complete total: ${currency} ${summary.total.toFixed(2)}. Compare with a complete system of the same configuration and condition.`}</p>
    <p className="evidence-note">Inputs stay in this page and clear when you leave. No merchant price feed or compatibility guarantee; an entered zero is your explicit zero-cost assumption.</p>
    {allowComponents && unmatchedMemory ? <p className="discovery-card"><strong>No verified merchant option for this exact memory plan.</strong> The required quantity is {unmatchedMemory.quantity}. Use that capacity and the manufacturer selector when checking a seller; a 16GB listing must not replace a required {unmatchedMemory.capacityGb}GB module. No different-capacity button is shown.</p> : null}
    {offers.map((offer) => {
      const part = parts.find((item) => item.id === offer.part)!;
      return <article className="discovery-card mt-4" key={offer.asin}>
        <h3>{offer.name}</h3><p><strong>Required purchase: {part.purchaseCount} {offer.part === "memory" ? "single module(s)" : "drive(s)"}.</strong> {offer.part === "memory" ? "The listing is one module; choose this quantity at the merchant, not one kit." : "Drive only; keep the model-matched installation pieces listed above."}</p>
        <p>{offer.limits}</p><p className="evidence-note">Paid link: as an Amazon Associate we earn from qualifying purchases. Exact listing checked October 19, 2026; no live price or stock promise. This option appears after the selected route checks, and is not an instruction to replace a working part.</p>
        <AffiliateButton site={offer.site} product={{slug:offer.slug,name:offer.name,asin:offer.asin,specs:{ASIN:offer.asin}}} offer={componentAffiliateOffer(offer)} position="tiny-parts-after-compatibility" resolveCreatorsListing={false} />
      </article>;
    })}
  </section>;
}
