"use client";

import { Calculator, Copy, RotateCcw } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { Tool } from "@/lib/types";
import { calculatorDefaults, calculatorFields, evaluateCalculator, type CalculatorValues } from "@/lib/calculator-plans";

export function CalculatorTool({ tool }: { tool: Tool }) {
  const id = useId();
  const [values, setValues] = useState(() => calculatorDefaults(tool.kind));
  const [example, setExample] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const result = useMemo(() => evaluateCalculator(tool.kind, values), [values, tool.kind]);
  const plan = [tool.title, "Inputs shown — verify every value, including any remaining example values, before making a decision.", ...calculatorFields(tool.kind).map((field) => `${field.label}: ${values[field.key]}`), result.title, ...result.lines].join("\n");

  function update(next: CalculatorValues, isExample = false) {
    setValues(next);
    setExample(isExample);
    setCopyStatus("");
    setManualCopy(false);
  }

  async function copyPlan() {
    if (result.status !== "ready") return;
    try {
      await navigator.clipboard.writeText(plan);
      setCopyStatus("Plan copied.");
      setManualCopy(false);
    } catch {
      setCopyStatus("Automatic copy is unavailable. Select and copy the plan below.");
      setManualCopy(true);
    }
  }

  return (
    <div className="panel p-5 sm:p-6" data-sticky-commerce-suppress data-clarity-mask="true">
      <div className="flex items-center gap-2">
        <Calculator aria-hidden="true" size={20} />
        <h2 className="text-xl font-bold">{tool.title}</h2>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]" id={`${id}-instructions`}>{example ? "Example inputs are loaded. Replace every value with your own before using this result." : "Check every field, including any remaining example values. Blank means unknown; invalid inputs do not produce a plan."}</p>
      {tool.kind === "desk" ? <p className="mt-3 text-sm leading-6 text-[var(--muted)]">With shoulders relaxed and forearms roughly level, measure floor to elbow while seated with feet supported, then while standing in your usual shoes and on your usual mat. Measure keyboard thickness from its support surface to the typing keys.</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {calculatorFields(tool.kind).map((field) => <div key={field.key}>
          <label className="block text-sm font-semibold text-[var(--muted)]" htmlFor={`${id}-${field.key}`}>{field.label}</label>
          <input id={`${id}-${field.key}`} className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2" type="number" step={field.integer ? "1" : "any"} min={field.min} value={values[field.key]} aria-invalid={Boolean(result.errors[field.key])} aria-describedby={`${id}-instructions${result.errors[field.key] ? ` ${id}-${field.key}-error` : ""}`} onChange={(event) => update({ ...values, [field.key]: event.target.value })} />
          {result.errors[field.key] ? <p className="mt-2 text-sm text-red-800" id={`${id}-${field.key}-error`}>{result.errors[field.key]}</p> : null}
        </div>)}
      </div>
      <div className="mt-5 rounded-md bg-[var(--brand-soft)] p-4" role="status" aria-live="polite" aria-atomic="true" data-calculator-status={result.status}>
        <p className="font-bold text-[var(--brand-strong)]">{result.title}</p>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">{result.lines.map((line) => <li key={line}>{line}</li>)}</ul>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="button-secondary disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={result.status !== "ready"} onClick={() => void copyPlan()}><Copy aria-hidden="true" size={16} />Copy plan</button>
        <button className="button-secondary" type="button" onClick={() => update(calculatorDefaults(tool.kind), true)}><RotateCcw aria-hidden="true" size={16} />Load example</button>
        <button className="button-secondary" type="button" onClick={() => update({ primary: "", secondary: "", keyboard: "" })}>Clear inputs</button>
      </div>
      <p className="mt-3 text-sm" role="status">{copyStatus}</p>
      {manualCopy ? <label className="mt-3 block text-sm font-semibold">Plan for manual copy<textarea className="mt-2 min-h-48 w-full rounded-md border border-[var(--border)] p-3 font-normal" readOnly value={plan} onFocus={(event) => event.currentTarget.select()} /></label> : null}
    </div>
  );
}
