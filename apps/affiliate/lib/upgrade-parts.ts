import { miniPcProfiles } from "./compatibility-data";
export type PlanPart = { id: string; name: string; quantity: string; check: string; source: string; reference?: string; purchaseCount?: number; capacityGb?: number; memoryGeneration?: "DDR4" | "DDR5"; modelId?: string };
export function memoryLayout(targetGb: number, modules?: readonly number[], maxGb = 32, generation: "DDR4" | "DDR5" = "DDR4") {
  const sizes = (generation === "DDR5" ? [8,16,32] : [4,8,16,32]).filter((n) => n <= maxGb/2);
  const known = modules?.length === 2 && modules.every((n) => n === 0 || sizes.includes(n));
  if (!known || ![8,16,32,64].includes(targetGb) || targetGb > maxGb) return { count: null, moduleGb: null, retained: 0, steps: ["Inspect both slot labels and choose a documented target before setting a shopping quantity."], note:"" };
  if (modules.reduce((a,b) => a+b,0) >= targetGb) return { count: 0, moduleGb: null, retained: modules.filter(Boolean).length, steps: modules.map((gb,index) => `Slot ${index+1}: ${gb ? `keep the existing ${gb}GB module` : "leave empty"}.`),note:"" };
  const candidates = [0,...sizes].flatMap((a) => [0,...sizes].filter((b) => a+b === targetGb).map((b) => [a,b]));
  const purchases = (layout:number[]) => layout.filter((gb,i) => gb && gb !== modules[i]).length;
  const retained = (layout:number[]) => layout.filter((gb,i) => gb && gb === modules[i]).length;
  candidates.sort((a,b) => purchases(a)-purchases(b) || retained(b)-retained(a) || Number(b[0]===b[1])-Number(a[0]===a[1]) || b[0]-a[0]);
  const desired = candidates[0];
  if (!desired) return {count:null,moduleGb:null,retained:0,steps:["No documented module layout for this target."],note:""};
  const newModules = desired.filter((gb,i) => gb && gb !== modules[i]);
  return {count:newModules.length,moduleGb:newModules[0] ?? null,retained:retained(desired),steps:desired.map((gb,index) => `Slot ${index+1}: ${gb === modules[index] ? gb ? `keep the existing ${gb}GB module after matching its label` : "leave empty" : gb ? modules[index] ? `remove the ${modules[index]}GB module and fit one ${gb}GB SO-DIMM` : `fit one ${gb}GB SO-DIMM` : `remove the ${modules[index]}GB module and leave empty`}.`),note:desired.includes(0) ? "This minimizes new modules for the stated capacity target. One fitted module is a single-channel layout; assess a matched pair separately if the workload needs dual-channel operation." : "This layout uses two equal-capacity modules; confirm actual labels and characteristics, not capacity alone."};
}
export function miniPcParts(modelId: string, task: string, targetGb = 32, currentModules?: readonly number[]): PlanPart[] {
  const model = miniPcProfiles.find((item) => item.id === modelId);
  if (!model) return [];
  const manual = `${modelId}-hmm`;
  const common = [{ id: "power", name: "Existing model-matched power adapter", quantity: "1, retain if correct", check: model.adapters + "; match the actual label and configuration. A larger wattage is not a reason to replace a correct adapter.", source: modelId }, { id: "backup", name: "Verified backup / migration method", quantity: "1 plan", check: "Retain a readable independent backup; an empty enclosure or RAID mirror is not a backup. Include cloning hardware or service only if needed.", source: manual }];
  if (task === "ram") {
    const layout = memoryLayout(targetGb,currentModules,model.validatedRamGb,model.memoryGeneration);
    const references = model.memoryReferences;
    const reference = layout.moduleGb && layout.count && references[layout.moduleGb] ? `${references[layout.moduleGb]} (one ${layout.moduleGb}GB module, not a kit; manufacturer selector reference)` : undefined;
    return [{ id: "memory", name: model.memorySpec, quantity: layout.count === 0 ? "0 — current capacity meets target" : layout.count === null ? "Inspect both slots before setting quantity" : `${layout.count} × ${layout.moduleGb}GB; retain ${layout.retained} matching module(s)`, purchaseCount:layout.count ?? undefined,capacityGb:layout.moduleGb ?? undefined, memoryGeneration:model.memoryGeneration, modelId:model.id, check: `Target ${targetGb}GB. ${layout.steps.join(" ")} ${layout.note} ${reference ? `Capacity-matched reference: Kingston ${references[layout.moduleGb!]}; check its exact rank/organization and matching labels. Manufacturer discontinuation and seller stock are separate.` : layout.count ? `Choose the required ${layout.moduleGb}GB capacity; the verified 16GB listing is not a substitute for this plan.` : ""} ${reference ? "Kingston’s selector is component-vendor evidence, separate from Lenovo validation." : "No exact retail module has been qualified in this model profile; do not borrow a different model’s SKU."} No XMP assumption.`, source: reference ? `kingston-${modelId}` : modelId, reference }, ...common];
  }
  if (task === "sata") return [
    { id: "drive", name: "2.5-inch SATA SSD", quantity: "1 if storage is needed", purchaseCount:1, modelId:model.id, check: "Choose SATA rather than M.2 NVMe. A 7mm drive example is Crucial MX500 CT1000MX500SSD1 (1TB). This is a form-factor reference, not Lenovo validation of this exact retail drive.", source: "mx500", reference: "CT1000MX500SSD1" },
    { id: "carrier", name: "Tiny storage-drive bracket / carrier", quantity: "1, retain if present", check: "Match the machine type and actual carrier in Lenovo Parts Lookup. No universal FRU is asserted for every refurbished machine.", source: manual },
    { id: "sata-cable", name: "Model-matched storage-drive cable", quantity: "1, retain if present", check: "Match board connector, cable orientation and FRU using machine type or serial privately on Lenovo's site. A generic desktop SATA cable is not a substitute.", source: manual },
    { id: "hardware", name: "Carrier retention and free drive-bay space", quantity: "1 complete assembly", check: "Confirm all retaining pieces in photographs. Check the exact model’s expansion policy and installed options; do not price a mutually exclusive PCIe/SATA assembly as one build.", source: manual }, ...common];
  if (["nvme", "second-nvme"].includes(task)) return [
    { id: "nvme", name: "M.2 PCIe NVMe SSD, correct length", quantity: task === "second-nvme" && model.nvmeSlots < 2 ? "0 — this route is unsupported" : "1; replace existing or use confirmed free socket", check: "Confirm 2242/2280 position, key, board space and thermal clearance. Example 2280 reference: Samsung 970 EVO Plus 1TB MZ-V7S1T0B/AM, PCIe 3.0 x4. No measured speed, endurance suitability or factory qualification is inferred.", source: "samsung-970", reference: "MZ-V7S1T0B/AM" },
    { id: "retainer", name: "M.2 storage retaining clip and compatible mount", quantity: "1 per fitted drive", check: "The maintenance manual shows a locking clip. Do not assume a generic screw fits or count the WLAN socket as storage. Inspect the exact mount before ordering.", source: manual }, ...common];
  return common;
}
export function costSummary(lines: { owned: boolean; cost: string }[]) {
  const missing = lines.filter((line) => !line.owned && (line.cost.trim() === "" || !Number.isFinite(Number(line.cost)) || Number(line.cost) < 0)).length;
  const subtotal = lines.reduce((sum,line) => sum + (!line.owned && line.cost.trim() !== "" && Number.isFinite(Number(line.cost)) && Number(line.cost) >= 0 ? Number(line.cost) : 0),0);
  return { missing, subtotal: Math.round(subtotal * 100)/100, total: missing ? null : Math.round(subtotal*100)/100 };
}
