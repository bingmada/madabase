"use client";

import { useId, useState } from "react";
import { ownershipCost, type OwnershipInputs } from "@/lib/ownership-cost";

const fields: Array<{ key: keyof OwnershipInputs; label: string; hint: string }> = [
  { key: "purchase", label: "Device price", hint: "Actual price for the same model, condition and bundle" },
  { key: "accessories", label: "Required accessories", hint: "Adapters, mounts and other one-time parts" },
  { key: "firstYearPlan", label: "First-year subscription", hint: "Actual amount billed for year one, including any introductory offer" },
  { key: "renewalPlan", label: "Annual renewal subscription", hint: "Annual cost after the introductory year; use 0 if no plan is required" },
  { key: "annualConsumables", label: "Consumables per year", hint: "Filters, bags or other replacements at your expected replacement rate" },
  { key: "watts", label: "Average power (watts)", hint: "Measured or documented average; an adapter rating is not average use" },
  { key: "hoursPerDay", label: "Hours powered per day", hint: "0 to 24" },
  { key: "pricePerKwh", label: "Electricity price per kWh", hint: "Use the same currency as every other cost" },
];
type Form = Record<keyof OwnershipInputs, string>;
const empty = () => Object.fromEntries(fields.map((field) => [field.key, ""])) as Form;
function parse(form: Form) {
  if (fields.some(({ key }) => !form[key].trim())) return null;
  return Object.fromEntries(fields.map(({ key }) => [key, Number(form[key])])) as OwnershipInputs;
}

export function OwnershipCostCalculator() {
  const id = useId();
  const [forms, setForms] = useState<[Form, Form]>([empty(), empty()]);
  const [years, setYears] = useState(3);
  const [example, setExample] = useState(false);
  const results = forms.map((form) => { const input = parse(form); return input ? ownershipCost(input, years) : null; });
  const format = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);
  function edit(index: number, key: keyof OwnershipInputs, value: string) {
    setExample(false);
    setForms((previous) => previous.map((form, position) => position === index ? { ...form, [key]: value } : form) as [Form, Form]);
  }
  return <section className="ownership-calculator" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Compare the complete ownership cost</h2>
    <p>Enter both options in one currency. Blank means unknown, not free. Enter 0 only for a cost you know does not apply. Inputs stay in this page and are not saved.</p>
    <div className="ownership-controls">
      <label htmlFor={`${id}-years`}>Years to compare <select id={`${id}-years`} value={years} onChange={(event) => setYears(Number(event.target.value))}>{[1, 3, 5].map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
      <button type="button" className="button button-dark" onClick={() => { setForms([{ purchase: "150", accessories: "20", firstYearPlan: "30", renewalPlan: "60", annualConsumables: "12", watts: "5", hoursPerDay: "24", pricePerKwh: "0.20" }, { purchase: "220", accessories: "0", firstYearPlan: "0", renewalPlan: "0", annualConsumables: "24", watts: "8", hoursPerDay: "24", pricePerKwh: "0.20" }]); setExample(true); }}>Load illustrative example</button>
      <button type="button" className="text-link" onClick={() => { setForms([empty(), empty()]); setExample(false); }}>Clear inputs</button>
    </div>
    {example ? <p role="status"><strong>Illustrative numbers only.</strong> These are not prices or measured power for a real product.</p> : null}
    <div className="ownership-grid">{forms.map((form, index) => <fieldset key={index}>
      <legend>Option {index === 0 ? "A" : "B"}</legend>
      {fields.map(({ key, label, hint }) => <div className="ownership-field" key={key}>
        <label htmlFor={`${id}-${index}-${key}`}>{label}</label>
        <input id={`${id}-${index}-${key}`} type="number" inputMode="decimal" min="0" max={key === "hoursPerDay" ? 24 : undefined} step="any" value={form[key]} onChange={(event) => edit(index, key, event.target.value)} aria-describedby={`${id}-${index}-${key}-hint`} />
        <small id={`${id}-${index}-${key}-hint`}>{hint}</small>
      </div>)}
    </fieldset>)}</div>
    <div className="ownership-results" aria-live="polite">
      <h3>{years}-year cost in your chosen currency</h3>
      {results.every(Boolean) ? <>
        <table><thead><tr><th scope="col">Cost</th><th scope="col">Option A</th><th scope="col">Option B</th></tr></thead><tbody>{([ ["Equipment and accessories", "equipment"], ["Subscriptions", "subscriptions"], ["Consumables", "consumables"], ["Electricity", "electricity"], ["Total", "total"] ] as const).map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{results.map((result, index) => <td key={index}>{format(result![key])}</td>)}</tr>)}</tbody></table>
        <p>{results[0]!.total === results[1]!.total ? "The entered totals are equal." : `Option ${results[0]!.total < results[1]!.total ? "A" : "B"} costs ${format(Math.abs(results[0]!.total - results[1]!.total))} less over ${years} ${years === 1 ? "year" : "years"} under these assumptions.`}</p>
      </> : <p>Complete all fields with non-negative numbers; hours per day must be between 0 and 24. No total is shown while a cost is unknown.</p>}
    </div>
    <p><small>Subscriptions = first-year billed amount + renewal amount × remaining years. Electricity = watts ÷ 1000 × hours per day × 365 × years × price per kWh. Rates stay constant in this estimate; taxes, financing, resale, repair, downtime and inflation are excluded unless you include them in your inputs. A lower total does not establish product fit.</small></p>
  </section>;
}
