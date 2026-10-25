import type { Tool } from "./types";

type Kind = Tool["kind"];
export type CalculatorValues = { primary: string; secondary: string; keyboard: string };
export type CalculatorField = { key: keyof CalculatorValues; label: string; min: number; integer?: boolean };
export type CalculatorPlan = { status: "unknown" | "invalid" | "ready"; title: string; lines: string[]; errors: Partial<Record<keyof CalculatorValues, string>> };

export function calculatorDefaults(kind: Kind): CalculatorValues {
  const defaults: Record<Kind, [string, string]> = {
    desk: ["28", "42"], diapers: ["2", "7"], wifi: ["1800", "35"],
    air: ["240", "8"], mesh: ["2200", "2"], matter: ["3", "2"], feeding: ["10", "220"],
  };
  return { primary: defaults[kind][0], secondary: defaults[kind][1], keyboard: "1" };
}

export function calculatorFields(kind: Kind): CalculatorField[] {
  const fields: Record<Kind, CalculatorField[]> = {
    desk: [{ key: "primary", label: "Seated elbow height from floor (inches)", min: 0 }, { key: "secondary", label: "Standing elbow height from floor (inches)", min: 0 }, { key: "keyboard", label: "Keyboard thickness (inches)", min: 0 }],
    diapers: [{ key: "primary", label: "Baby age in months", min: 0 }, { key: "secondary", label: "Days to plan for", min: 1, integer: true }],
    wifi: [{ key: "primary", label: "Home size in square feet", min: 0 }, { key: "secondary", label: "Connected devices", min: 1, integer: true }],
    air: [{ key: "primary", label: "Room area in square feet", min: 0 }, { key: "secondary", label: "Ceiling height in feet", min: 0 }],
    mesh: [{ key: "primary", label: "Home size in square feet", min: 0 }, { key: "secondary", label: "Number of floors", min: 1, integer: true }],
    matter: [{ key: "primary", label: "Planned Thread devices", min: 0, integer: true }, { key: "secondary", label: "Planned Wi-Fi Matter devices", min: 0, integer: true }],
    feeding: [{ key: "primary", label: "Meals per day", min: 1, integer: true }, { key: "secondary", label: "Daily calorie target (kcal, supplied by your vet)", min: 0 }],
  };
  return fields[kind];
}

function quantity(value: number) {
  return value > 0 && value < 0.1 ? "less than 0.1" : value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function evaluateCalculator(kind: Kind, values: CalculatorValues): CalculatorPlan {
  const fields = calculatorFields(kind);
  const errors: CalculatorPlan["errors"] = {};
  const numbers = {} as Record<keyof CalculatorValues, number>;
  let missing = false;
  for (const field of fields) {
    const text = values[field.key].trim();
    if (!text) { missing = true; continue; }
    const value = Number(text);
    const allowsZero = kind === "matter" || (kind === "diapers" && field.key === "primary") || field.key === "keyboard";
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text) || !Number.isFinite(value)
      || value < 0 || (!allowsZero && value === 0) || (field.integer && !Number.isSafeInteger(value))) {
      errors[field.key] = field.integer
        ? `Enter a whole number ${allowsZero ? "of zero or more" : "of at least one"}.`
        : `Enter a finite ${allowsZero ? "number of zero or more" : "number greater than zero"}.`;
    } else numbers[field.key] = value;
  }
  const incomplete = (status: "unknown" | "invalid", message: string): CalculatorPlan => ({ status, title: status === "unknown" ? "More information needed" : "Check your inputs", lines: [message, "No planning result is available until every input is complete and valid."], errors });
  if (Object.keys(errors).length) return incomplete("invalid", "Correct the highlighted inputs. Values are never replaced with a minimum or rounded to a whole count.");
  if (missing) return incomplete("unknown", "Blank means unknown. Enter your own measurements or counts, or load the example to see how this tool works.");
  const { primary: a, secondary: b, keyboard } = numbers;
  const ready = (title: string, lines: string[]): CalculatorPlan => ({ status: "ready", title, lines, errors });
  const overflow = () => incomplete("invalid", "These inputs exceed the calculation range. Check the values and units.");

  if (kind === "desk") {
    if (keyboard >= Math.min(a, b)) {
      errors.keyboard = "Keyboard thickness must be smaller than both elbow heights.";
      return incomplete("invalid", errors.keyboard);
    }
    return ready("Starting surface heights from your measurements", [`Sitting desk surface: about ${quantity(a - keyboard)} in`, `Standing desk surface: about ${quantity(b - keyboard)} in`, "Surface height = measured elbow height minus keyboard thickness.", "If using a keyboard tray, these are tray heights. Tune with relaxed shoulders and straight wrists; set the monitor separately."]);
  }
  if (kind === "diapers") {
    const daily = a <= 1 ? 10 : a <= 3 ? 8 : a <= 8 ? 7 : 5;
    if (!Number.isSafeInteger(daily * b)) return overflow();
    return ready("Estimated diaper planning number", [`About ${daily} diapers per day`, `About ${quantity(daily * b)} diapers for ${quantity(b)} day${b === 1 ? "" : "s"}`, "This age-based planning default is not a changing schedule. Use your observed daily use when it differs, and allow a small reserve without overbuying one size."]);
  }
  if (kind === "wifi") {
    const nodes = a <= 1200 ? 1 : a <= 2600 ? 2 : a <= 4500 ? 3 : 4;
    return ready("Rough network layout to test", [`Area-based starting example: ${nodes} Wi-Fi node${nodes === 1 ? "" : "s"}`, `Device-count band: ${b > 100 ? "high-device home" : b > 50 ? "busy family network" : "normal home network"}`, "The area bands are planning assumptions, not measured coverage or proof of device capacity. Test the smallest layout first; walls, placement and backhaul can change the result.", "Use wired backhaul where possible for office, TV, NAS, or gaming rooms."]);
  }
  if (kind === "air") {
    const volume = a * b;
    const cadr = volume / 12;
    if (![volume, cadr].every(Number.isFinite) || volume === 0 || cadr === 0) return overflow();
    return ready("Pet-room particle filtration planning target", [`Room volume: about ${quantity(volume)} cubic feet`, `At a planning assumption of 5 air changes per hour: about ${quantity(cadr)} CFM CADR`, "CADR = room area × ceiling height × 5 ÷ 60. Five air changes is a comparison scenario, not a universal requirement.", "This estimates particle filtration, not gas or odor removal. Keep litter, bedding and surface cleaning in the routine."]);
  }
  if (kind === "mesh") {
    const sizeNodes = a <= 1300 ? 1 : a <= 2800 ? 2 : a <= 4600 ? 3 : 4;
    const nodes = Math.max(sizeNodes, b);
    return ready("Rough mesh layout to test", [`Area/floor planning example: ${quantity(nodes)} node${nodes === 1 ? "" : "s"}`, "This heuristic takes the larger of the area band and floor count. It is a test layout, not a required purchase quantity or a coverage guarantee.", b > 1 ? "Prioritize Ethernet backhaul between floors when practical." : "Place the first node centrally before adding another.", "Test the smallest workable layout before buying more nodes. Dense walls, long wings and modem placement can change the result."]);
  }
  if (kind === "matter") {
    if (a === 0 && b === 0) return incomplete("unknown", "Add at least one planned device before generating compatibility requirements.");
    return ready("Planned Matter requirements", ["You need a compatible Matter controller in the primary ecosystem.", a > 0 ? "Thread devices also require a compatible Thread border router." : "No Thread border router is required for this Wi-Fi-only plan.", b > 0 ? "Confirm each Wi-Fi Matter device's supported band and local network requirements." : "No Wi-Fi Matter accessories are included in this plan.", "Device counts do not establish controller capacity or ecosystem support. Verify each exact model and feature before buying."]);
  }
  const perMeal = b / a;
  if (!Number.isFinite(perMeal) || perMeal === 0) return overflow();
  return ready("Equal split of your supplied calorie target", [`${quantity(a)} meals per day`, `About ${quantity(perMeal)} kcal per meal (${quantity(b)} kcal per day ÷ ${quantity(a)} meals)`, "This only divides the daily target you supply; it does not determine your pet's calorie needs. Use a vet-provided target, especially for medical diets.", "Convert calories to grams using the food label, then test actual feeder portions before relying on a schedule."]);
}
