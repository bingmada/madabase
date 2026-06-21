"use client";

import { Calculator, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { Tool } from "@/lib/types";

export function CalculatorTool({ tool }: { tool: Tool }) {
  const [primary, setPrimary] = useState(tool.kind === "desk" ? 68 : tool.kind === "diapers" ? 2 : 10);
  const [secondary, setSecondary] = useState(tool.kind === "feeding" ? 220 : 0);

  const result = useMemo(() => {
    if (tool.kind === "desk") {
      const sitting = Math.round(primary * 0.25 * 10) / 10;
      const standing = Math.round(primary * 0.59 * 10) / 10;
      return {
        title: "Estimated ergonomic range",
        lines: [`Sitting desk height: about ${sitting} in`, `Standing desk height: about ${standing} in`, "Fine-tune by elbow angle and shoe height."],
      };
    }

    if (tool.kind === "diapers") {
      const daily = primary <= 1 ? 10 : primary <= 3 ? 8 : primary <= 8 ? 7 : 5;
      return {
        title: "Estimated diaper planning number",
        lines: [`About ${daily} diapers per day`, `About ${daily * 7} diapers per week`, "Keep one backup pack before changing sizes."],
      };
    }

    const meals = Math.max(1, Math.round(primary));
    const calories = Math.max(1, Math.round(secondary));
    return {
      title: "Estimated meal split",
      lines: [`${meals} meals per day`, `About ${Math.round(calories / meals)} kcal per meal`, "Use your vet's calorie target for medical diets."],
    };
  }, [primary, secondary, tool.kind]);

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Calculator aria-hidden="true" size={20} />
        <h2 className="text-xl font-bold">{tool.title}</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--muted)]">
            {tool.kind === "desk" ? "Your height in inches" : tool.kind === "diapers" ? "Baby age in months" : "Meals per day"}
          </span>
          <input className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2" type="number" value={primary} min={1} onChange={(event) => setPrimary(Number(event.target.value))} />
        </label>
        {tool.kind === "feeding" ? (
          <label className="block">
            <span className="text-sm font-semibold text-[var(--muted)]">Daily calorie target</span>
            <input className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2" type="number" value={secondary} min={1} onChange={(event) => setSecondary(Number(event.target.value))} />
          </label>
        ) : (
          <div className="rounded-md bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]">
            This estimate is a planning aid. Product fit still depends on your room, routine, and product limits.
          </div>
        )}
      </div>
      <div className="mt-5 rounded-md bg-[var(--brand-soft)] p-4">
        <p className="font-bold text-[var(--brand-strong)]">{result.title}</p>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
          {result.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <button className="button-secondary mt-5" type="button" onClick={() => setPrimary(tool.kind === "desk" ? 68 : tool.kind === "diapers" ? 2 : 10)}>
        <RotateCcw aria-hidden="true" size={16} />
        Reset
      </button>
    </div>
  );
}
