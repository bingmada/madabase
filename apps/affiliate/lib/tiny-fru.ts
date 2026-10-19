import observations from "./tiny-fru-evidence.json";
import { miniPcProfiles } from "./tiny-models";
import { activeComponentOffers } from "./upgrade-offers";

export type FruRole = "sata-cable" | "carrier" | "riser" | "retainer";
export const fruObservations = observations as (typeof observations[number] & {role:FruRole})[];
export const fruRoleLabels: Record<FruRole,string> = {"sata-cable":"SATA data/power cable",carrier:"2.5-inch drive carrier",riser:"PCIe riser / converter",retainer:"M.2 retaining part"};

export function machineIdentity(modelId:string, entered:string) {
  const model = miniPcProfiles.find((item) => item.id === modelId);
  const value = entered.toUpperCase().replace(/[\s-]/g, "");
  const type = value.slice(0,4);
  const formatValid = /^(?:[A-Z0-9]{4}|[A-Z0-9]{10})$/.test(value);
  const matches = !!model && formatValid && model.machineTypes.includes(type);
  const other = miniPcProfiles.find((item) => item.machineTypes.includes(type));
  return {model,value,type,formatValid,matches,other,candidates:matches ? fruObservations.filter((item) => item.model === modelId && item.machineType === type) : []};
}

export type FruShoppingInput = {model:string;machine:string;need:string;scope:string;cable:string;carrier:string;ownsCable:boolean;ownsCarrier:boolean;photos:string;bay:string};
export function resolveFruShopping(input:FruShoppingInput, now=Date.now()) {
  const identity = machineIdentity(input.model,input.machine);
  const cable = input.cable.trim().toUpperCase(), carrier = input.carrier.trim().toUpperCase();
  const missing = [...(!input.ownsCable ? ["one model-matched SATA cable"] : []),...(!input.ownsCarrier ? ["one model-matched 2.5-inch carrier"] : [])];
  const issues:string[] = [];
  if (!identity.matches) issues.push(!identity.formatValid ? "Enter a four-character machine type or full ten-character MTM from the label; do not enter a serial number here." : identity.other ? `This machine type is documented for ${identity.other.name}, not the selected profile. Correct the identity before shopping.` : "This machine type is not covered by the selected manual in this library. Find its exact Lenovo documentation; unlisted does not mean incompatible.");
  const noBuy = identity.matches && (input.need === "no" || (input.need === "yes" && !missing.length));
  if (!noBuy && identity.matches) {
    if (input.need !== "yes") issues.push("Establish a storage need or diagnosed drive fault first. A working, sufficient drive does not need a new installation kit.");
    if (input.scope !== "serial" && !(input.scope === "mtm" && identity.value.length === 10)) issues.push("A machine-type catalog is a candidate list. Record a match from the exact ten-character MTM or your serial-specific Lenovo As-Built / supported-substitute record first.");
    for (const [role,part] of [["sata-cable",cable],["carrier",carrier]] as const) {
      if (!identity.candidates.some((row) => row.role === role && row.part === part)) issues.push(`The recorded ${fruRoleLabels[role]} FRU is not a checked candidate for this exact machine type. Verify the number and any official substitute; no family-name substitution is made here.`);
    }
    if (input.photos !== "yes") issues.push("Match actual seller photos, connector orientation, carrier style and all retaining pieces to the unit. A listing title alone does not clear the assembly.");
    if (input.bay !== "yes") issues.push("Confirm the physical drive bay and cable path are free, including any PCIe card, riser or optional assembly. Resolve a space conflict before ordering.");
  }
  const offers = !noBuy && !issues.length ? activeComponentOffers(now).filter((offer) => offer.part === "sata-kit" && offer.models.includes(input.model) && !input.ownsCable && !input.ownsCarrier && offer.requiredFrus?.cable === cable && offer.requiredFrus?.carrier === carrier) : [];
  if (!noBuy && !issues.length && !offers.length) issues.push(missing.length === 1 ? "Only one part is missing. No verified single-part offer matches it here; do not buy a redundant two-part kit." : "No currently verified merchant option matches this exact pair of FRUs. Keep the recorded numbers and check a seller without substituting another generation's kit.");
  return {identity,cable,carrier,missing,issues,offers,noBuy,status:noBuy ? "no-buy" : offers.length ? "conditional" : "hold"};
}
