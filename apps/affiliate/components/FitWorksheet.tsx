"use client";

import { useState } from "react";
import { evaluateFitWorksheet, fitWorksheetFields, type FitWorksheetKind } from "@/lib/fit-worksheet";

export function FitWorksheet({ kind }: { kind: FitWorksheetKind }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const result = evaluateFitWorksheet(kind, values);
  const title = kind === "printer" ? "Printer stand measurement worksheet" : "Lumbar cushion seat-depth worksheet";
  const messages = {
    unknown: "Complete the measurements you can verify. Blank entries remain unknown.",
    invalid: "Check the measurements and units, and correct any highlighted values before using the result.",
    mismatch: "At least one measurement does not fit. Recheck the setup before choosing this product.",
    match: "The recorded measurements match. Check the instructions and remaining physical-fit conditions below.",
  };
  function printWorksheet() {
    document.body.classList.add("printing-fit-worksheet");
    window.addEventListener("afterprint", () => document.body.classList.remove("printing-fit-worksheet"), { once: true });
    window.print();
  }
  return (
    <section className="mt-8 rounded-md border border-[var(--brand)] bg-white p-5 sm:p-6" id="fit-worksheet" data-fit-worksheet={kind} data-print-worksheet="true" aria-labelledby="fit-worksheet-title">
      <p className="eyebrow">Measure your actual setup</p>
      <h2 className="mt-3 text-2xl font-bold" id="fit-worksheet-title">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Record the exact product and date on your printed copy. Measurements are not saved. Convert inches to centimetres by multiplying by 2.54{kind === "printer" ? "; convert pounds to kilograms by dividing by 2.20462" : ""}.</p>
      <p className="mt-3 text-sm leading-6">{kind === "printer" ? "Measure the usable shelf and a full printing-and-scanning cycle, including trays, cables and lid movement. Use the capacity for that shelf, rather than the total cart rating." : "Adjust the chair first. Measure the cushion's actual forward projection while seated. Choose the needed depth from your own adjusted position, with thigh support and clearance behind the knees; this worksheet does not prescribe a universal seat depth."}</p>
      <fieldset className="mt-5 grid gap-4 sm:grid-cols-2" data-clarity-mask="true">
        <legend className="sr-only">Measurements for {title}</legend>
        {fitWorksheetFields[kind].map((field) => <div key={field.key}>
          <label className="block text-sm font-bold leading-6" htmlFor={`fit-${field.key}`}>{field.label} ({field.unit})</label>
          <input className="mt-2 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-[var(--text)]" id={`fit-${field.key}`} type="number" min={"allowZero" in field && field.allowZero ? 0 : undefined} step="any" inputMode="decimal" value={values[field.key] ?? ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} aria-invalid={Boolean(result.errors[field.key])} aria-describedby={result.errors[field.key] ? `fit-error-${field.key}` : undefined} />
          {result.errors[field.key] ? <p className="mt-1 text-sm font-semibold text-red-700" id={`fit-error-${field.key}`}>{result.errors[field.key]}</p> : null}
        </div>)}
      </fieldset>
      <div className="mt-6 rounded-md bg-[var(--surface-muted)] p-4" aria-live="polite" data-fit-result={result.status} data-clarity-mask="true">
        <p className="font-bold leading-6">{messages[result.status]}</p>
        <ul className="mt-3 space-y-2 text-sm leading-6">{result.checks.map((check) => <li key={check.label}><strong>{check.label}:</strong> {check.detail}</li>)}</ul>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{kind === "printer" ? "Matching numbers do not establish stability, shelf strength, ventilation, caster locking, cable strain or safe mounting. Keep any additional clearance required by the exact printer and stand instructions." : "The subtraction cannot establish comfort, pain relief or support. Check strap security, backrest shape, recline, armrest reach and whether the cushion stays in place. Stop using a configuration that causes discomfort."}</p>
      <div className="mt-5 flex flex-wrap gap-3"><button className="button-secondary" onClick={printWorksheet} type="button">Print this worksheet</button><button className="button-secondary" onClick={() => setValues({})} type="button">Clear measurements</button><a className="button-secondary" href="#fit-worksheet">Link to this worksheet</a></div>
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Madabase · {title} · Use the page URL to return to the sources and current guide.</p>
    </section>
  );
}
