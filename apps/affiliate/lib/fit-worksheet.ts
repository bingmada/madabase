export type FitWorksheetKind = "printer" | "lumbar";
export type FitStatus = "unknown" | "match" | "mismatch" | "invalid";
export type FitCheck = { label: string; status: FitStatus; detail: string };
export type FitWorksheetResult = { status: FitStatus; checks: FitCheck[]; errors: Record<string, string> };

export const fitWorksheetFields = {
  printer: [
    { key: "shelfWidth", label: "Usable shelf width", unit: "cm" },
    { key: "printerWidth", label: "Printer width with trays and covers open", unit: "cm" },
    { key: "shelfDepth", label: "Usable shelf depth", unit: "cm" },
    { key: "printerDepth", label: "Printer depth with trays and cables in use", unit: "cm" },
    { key: "shelfCapacity", label: "Documented capacity of the supporting shelf", unit: "kg" },
    { key: "loadedWeight", label: "Printer, paper and supplies on that shelf", unit: "kg" },
    { key: "openingHeight", label: "Clear height above the supporting shelf", unit: "cm" },
    { key: "operatingHeight", label: "Height needed with the scanner lid open", unit: "cm" },
  ],
  lumbar: [
    { key: "seatDepth", label: "Usable seat depth before adding the cushion", unit: "cm" },
    { key: "cushionProjection", label: "How far the fitted cushion moves you forward", unit: "cm", allowZero: true },
    { key: "neededDepth", label: "Seat depth you need in your adjusted sitting position", unit: "cm" },
  ],
} as const;

export function evaluateFitWorksheet(kind: FitWorksheetKind, input: Record<string, string>): FitWorksheetResult {
  const values: Record<string, number | null> = {};
  const errors: Record<string, string> = {};
  for (const field of fitWorksheetFields[kind]) {
    const raw = (input[field.key] ?? "").trim();
    if (!raw) { values[field.key] = null; continue; }
    const value = Number(raw);
    const allowZero = "allowZero" in field && field.allowZero;
    if (!/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw) || !Number.isFinite(value) || value < 0 || (!allowZero && value === 0)) {
      errors[field.key] = allowZero ? "Enter zero or a positive measurement." : "Enter a positive measurement, or leave it blank if unknown.";
      values[field.key] = null;
    } else values[field.key] = value;
  }
  const compare = (label: string, available: number | null, needed: number | null, unit: string): FitCheck => {
    if (available === null || needed === null) return { label, status: "unknown", detail: "More measurements needed." };
    const difference = available - needed;
    if (!Number.isFinite(difference)) return { label, status: "invalid", detail: "These values are too large to compare. Check the measurements and units." };
    const gap = Number(difference.toFixed(2));
    return {
      label, status: available >= needed ? "match" : "mismatch",
      detail: available >= needed ? `${gap} ${unit} remaining in these measurements.` : gap === 0 ? `Less than 0.01 ${unit} short in these measurements.` : `${Math.abs(gap)} ${unit} short in these measurements.`,
    };
  };
  const checks = kind === "printer" ? [
    compare("Width", values.shelfWidth, values.printerWidth, "cm"),
    compare("Depth", values.shelfDepth, values.printerDepth, "cm"),
    compare("Shelf load", values.shelfCapacity, values.loadedWeight, "kg"),
    compare("Lid clearance", values.openingHeight, values.operatingHeight, "cm"),
  ] : [
    compare("Seat depth after the cushion", values.seatDepth === null || values.cushionProjection === null ? null : values.seatDepth - values.cushionProjection, values.neededDepth, "cm"),
  ];
  const status: FitStatus = Object.keys(errors).length || checks.some((row) => row.status === "invalid") ? "invalid" : checks.some((row) => row.status === "mismatch") ? "mismatch" : checks.some((row) => row.status === "unknown") ? "unknown" : "match";
  return { status, checks, errors };
}

export function fitWorksheetForGuide(site: string, slug: string): FitWorksheetKind | undefined {
  if (site !== "homeoffice") return undefined;
  if (slug === "office-printer-stands-buying-guide") return "printer";
  if (slug === "office-lumbar-cushions-buying-guide") return "lumbar";
  return undefined;
}
