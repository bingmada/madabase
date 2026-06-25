"use client";

import { Calculator, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { Tool } from "@/lib/types";

function getDefaultPrimary(kind: Tool["kind"]) {
  return kind === "desk" ? 68 : kind === "diapers" ? 2 : kind === "wifi" ? 1800 : 10;
}

function getDefaultSecondary(kind: Tool["kind"]) {
  return kind === "feeding" ? 220 : kind === "wifi" ? 35 : 0;
}

export function CalculatorTool({ tool }: { tool: Tool }) {
  const [primary, setPrimary] = useState(getDefaultPrimary(tool.kind));
  const [secondary, setSecondary] = useState(getDefaultSecondary(tool.kind));

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

    if (tool.kind === "wifi") {
      const squareFeet = Math.max(200, Math.round(primary));
      const devices = Math.max(1, Math.round(secondary));
      const meshNodes = squareFeet <= 1200 ? 1 : squareFeet <= 2600 ? 2 : squareFeet <= 4500 ? 3 : 4;
      const deviceTier = devices > 100 ? "high-device home" : devices > 50 ? "busy family network" : "normal home network";
      return {
        title: "Estimated network planning target",
        lines: [`Start with about ${meshNodes} Wi-Fi node${meshNodes > 1 ? "s" : ""}`, `Plan for a ${deviceTier}`, "Use wired backhaul where possible for office, TV, NAS, or gaming rooms."],
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
            {tool.kind === "desk" ? "Your height in inches" : tool.kind === "diapers" ? "Baby age in months" : tool.kind === "wifi" ? "Home size in square feet" : "Meals per day"}
          </span>
          <input className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2" type="number" value={primary} min={1} onChange={(event) => setPrimary(Number(event.target.value))} />
        </label>
        {tool.kind === "feeding" || tool.kind === "wifi" ? (
          <label className="block">
            <span className="text-sm font-semibold text-[var(--muted)]">{tool.kind === "wifi" ? "Connected devices" : "Daily calorie target"}</span>
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
      <button
        className="button-secondary mt-5"
        type="button"
        onClick={() => {
          setPrimary(getDefaultPrimary(tool.kind));
          setSecondary(getDefaultSecondary(tool.kind));
        }}
      >
        <RotateCcw aria-hidden="true" size={16} />
        Reset
      </button>
    </div>
  );
}
