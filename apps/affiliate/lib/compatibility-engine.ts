import { miniPcParts, type PlanPart } from "./upgrade-parts";
import { armProfiles, dockProfiles, macProfiles, miniPcProfiles } from "./compatibility-data";
export type CompatibilityResult = { status: "supported" | "conditional" | "incompatible" | "unknown"; title: string; reasons: string[]; checklist: string[]; sources: string[]; href?: string; parts?: PlanPart[]; noBuy?: string };
export type DockInput = { mac: string; dock: string; screens: number; lid: string; mode: string; input: string; software: string; workload: string; powerWatts: number; clamshellReady: string };
export function checkDock(input: DockInput): CompatibilityResult {
  const mac = macProfiles.find((item) => item.id === input.mac);
  const dock = dockProfiles.find((item) => item.id === input.dock);
  if (!mac || !dock || ![1,2].includes(input.screens) || !["open", "closed"].includes(input.lid)) return { status: "unknown", title: "Identify the exact MacBook and dock first", reasons: ["This library covers the listed MacBooks and exact dock models only. An unlisted host is not an incompatible host."], checklist: [], sources: [] };
  const result: CompatibilityResult = { status: "conditional", title: "Documented route, subject to the checks below", reasons: [], checklist: [dock.wiring, "Select Extend in macOS; test both screens, sleep/wake and your normal applications during the return window."], sources: [...mac.sources, ...dock.sources], href: `/reviews/${dock.productSlug}` };
  const reject = (reason: string) => { result.status = "incompatible"; result.reasons.push(reason); };
  const unknown = (reason: string) => { if (result.status !== "incompatible") result.status = "unknown"; result.reasons.push(reason); };
  const nativeLimit = input.lid === "closed" ? mac.closed : mac.open;
  if (dock.technology === "native" && input.screens > nativeLimit) reject(`This MacBook supplies ${nativeLimit} native external display${nativeLimit === 1 ? "" : "s"} in the selected lid position. ${dock.name} cannot create another native display stream.`);
  if (input.mac === "m3" && input.lid === "closed" && input.screens === 2 && input.clamshellReady !== "yes" && dock.technology === "native") unknown("Confirm Apple's M3 macOS, power, external keyboard and pointing-device requirements before relying on two closed-lid screens.");
  if (dock.technology === "displaylink") {
    if (input.software === "no") reject("This dock needs DisplayLink software and macOS permissions. It does not provide the requested driverless route.");
    else if (input.software !== "yes") unknown("Confirm that the Mac and any company policy permit DisplayLink Manager and its screen-recording permission.");
    if (input.workload === "protected") reject("The vendor excludes HDCP-protected playback, gaming and 3D from this dock's supported use. Choose a documented native path for this requirement.");
    if (input.input === "usbc") reject("This dual-HDMI DisplayLink model does not support USB-C-only portable displays.");
  }
  if (input.input !== "hdmi" && input.dock === "ud5") unknown("The verified two-screen route for this model is two HDMI displays. Your other connector/adapter path needs separate confirmation.");
  if (input.input === "dp" && input.dock === "displaylink") unknown("A DisplayPort-only screen needs an explicitly supported active HDMI-to-DisplayPort conversion path; a common DP-to-HDMI cable works in the opposite direction.");
  if (input.input === "mixed") unknown("List both actual monitor inputs and the direction of each video adapter before treating the wiring as complete.");
  if (input.mode !== "4k60" && input.mode !== "1080p60" && input.mode !== "1440p60") unknown("This checker does not verify high-refresh, HDR, DSC or above-4K combinations. Check both the host's and dock's exact mode tables.");
  if (!Number.isFinite(input.powerWatts) || input.powerWatts <= 0) unknown("Enter the required host charging power, or treat one-cable charging as unverified.");
  else if (input.powerWatts > dock.hostWatts) result.reasons.push(`Host charging is limited to at most ${dock.hostWatts}W here, below your ${input.powerWatts}W requirement. Use a separate supported charger; this does not invalidate the display path.`);
  const nativeCeiling = Math.min(nativeLimit, dock.displays);
  result.reasons.push(`Planning ceiling: ${nativeCeiling} native external screen${nativeCeiling === 1 ? "" : "s"} for this host/lid combination${dock.technology === "displaylink" ? "; this dock instead uses a separate software-driven display path" : ""}.`, `The dock's Ethernet link is rated ${dock.ethernetGbps}Gbps; a faster NAS or switch cannot remove that endpoint limit.`);
  if (input.workload === "color" && dock.technology === "displaylink") result.reasons.push("Color-critical or motion-sensitive work needs a native path or explicit workload validation; office-display compatibility is not a quality certification.");
  if (result.status === "incompatible") result.title = "The selected requirements do not match this route";
  if (result.status === "unknown") result.title = "More evidence is needed for this combination";
  return result;
}
export function checkArm(input: { arm: string; kg: number; mm: number; vesa: string; construction: string; curved: string; clearance: string; ports?: string; travel?: string }): CompatibilityResult {
  const arm = armProfiles.find((item) => item.id === input.arm);
  if (!arm || !Number.isFinite(input.kg) || !Number.isFinite(input.mm) || input.kg <= 0 || input.mm <= 0) return { status: "unknown", title: "Measure the screen and desk first", reasons: ["Enter positive weight without stand, including attached accessories, and the combined attachment thickness."], checklist: [], sources: [] };
  const reasons: string[] = []; let status: CompatibilityResult["status"] = "conditional";
  if (input.kg < arm.minKg || input.kg > arm.maxKg) { status = "incompatible"; reasons.push(`${input.kg}kg falls outside the ${arm.minKg}–${arm.maxKg}kg spring-load range. Too light can be as unsuitable as too heavy.`); }
  if (input.mm < arm.minMm || input.mm > arm.maxMm) { status = "incompatible"; reasons.push(`${input.mm}mm falls outside this exact clamp drawing's ${arm.minMm}–${arm.maxMm}mm range. Other clamp revisions need their own drawing.`); }
  if (!arm.vesa.includes(input.vesa)) { status = "incompatible"; reasons.push("The selected VESA pattern is outside this profile. A separate adapter needs its own model-specific evidence and adds weight and leverage."); }
  if (input.construction !== "approved" || input.clearance !== "yes" || input.curved !== "flat") {
    if (status !== "incompatible") status = "unknown";
    reasons.push("Numerical fit does not verify desk strength, underside clearance or curved-screen torque. Obtain the desk maker's attachment approval and the correct pivot/accessory confirmation. Glass, hollow tops and deep curves cannot pass from dimensions alone.");
  }
  if ((input.ports && input.ports !== "yes") || (input.travel && input.travel !== "yes")) {
    if (status !== "incompatible") status = "unknown";
    reasons.push("Check whether the VESA plate, screw heads or adapters obstruct the monitor's ports, and confirm cable slack and wall clearance throughout the arm/desk travel before ordering.");
  }
  if (!reasons.length) reasons.push("Weight, VESA and this clamp's thickness range pass the entered values. Desk-maker approval and measured flat underside clearance were confirmed by you; this is not an installation safety certification.");
  return { status, title: status === "incompatible" ? "A documented limit fails" : status === "unknown" ? "Physical fit still needs confirmation" : "The entered specification checks pass conditionally", reasons, checklist: ["Include reinforcement plates in combined clamp thickness; plates do not make a hollow or glass desktop approved for clamping.", "Check recessed VESA holes, screw length and cable slack at full travel. Start with the arm retracted before adjusting tension.", "For HX deep-curved screens, confirm the specific tilt pivot with Ergotron. Matching kilograms alone does not establish tilt stability."], parts: [
    {id:"arm",name:arm.name,quantity:"1; retain an existing matching arm",check:arm.sku + "; confirm the exact arm, pivot and supplied attachment rather than a family name.",source:arm.source},
    {id:"clamp",name:"Approved attachment / standard clamp",quantity:"1 complete assembly",check:"Match the exact drawing, desk approval and measured thickness; include plate thickness only when required and approved.",source:`${arm.id}-clamp`},
    {id:"vesa",name:"VESA plate, correct screws and any approved spacers",quantity:"1 set",check:"Use the monitor maker's thread, length and recess specification; account for accessory weight and port obstruction. Never force an unverified screw or adapter.",source:arm.source},
    {id:"slack",name:"Cable slack and unobstructed travel",quantity:"One route per cable",check:"Reuse cables if they reach through every arm and desk position without tension. A reinforcement plate cannot fix a weak desktop or a blocked monitor connector.",source:`${arm.id}-clamp`},
  ], sources: [arm.source, `${arm.id}-clamp`], href: arm.href };
}
export function planMiniPc(input: { model: string; task: string; pcie: string; hasKit: string; ramGb: number; modules?: readonly number[] }): CompatibilityResult {
  const model = miniPcProfiles.find((item) => item.id === input.model);
  if (!model) return { status: "unknown", title: "Choose the exact Tiny model", reasons: ["Tiny, SFF and Tower use different boards and memory layouts."], checklist: [], sources: [] };
  let status: CompatibilityResult["status"] = "conditional";
  const reasons: string[] = [model.note]; const checklist: string[] = [];
  if (input.task === "sata") {
    if (input.pcie === "yes") { status = "incompatible"; reasons.push("The selected PCIe expansion and internal 2.5-inch drive need the same space. Choose one route, or use an appropriately connected external drive."); }
    if (input.pcie === "unknown") { status = "unknown"; reasons.push("Inspect the machine for a PCIe card before planning the 2.5-inch bay."); }
    checklist.push("A suitable 2.5-inch SATA drive, the correct model-specific drive carrier, SATA cable, board connector and retaining hardware. Confirm all are in the seller's actual photos.");
    if (input.hasKit !== "yes") { if (status !== "incompatible") status = "unknown"; reasons.push("The carrier/cable kit is not confirmed. A compatible drive alone is not a complete upgrade; exact FRU remains unverified until matched to the machine type."); }
  } else if (input.task === "nvme" || input.task === "second-nvme") {
    if (input.task === "second-nvme" && model.nvmeSlots < 2) { status = "incompatible"; reasons.push("This profile has one storage M.2 socket. The WLAN socket and an unpopulated footprint do not provide a second supported NVMe position."); }
    else checklist.push("Check which storage socket is already occupied, the accepted 2242/2280 length, retaining clip/screw and the actual thermal clearance. A photographed board is required for a used system.");
  } else if (input.task === "ram") {
    checklist.push("Record both installed SO-DIMMs and the required total capacity. Use DDR4 SO-DIMMs, not full-size desktop DIMMs; confirm CPU speed and module compatibility.");
    if (input.modules && (input.modules.length !== 2 || input.modules.some((n) => ![0,4,8,16].includes(n)))) { status = "unknown"; reasons.push("Inspect and record both current memory slots first. The required module quantity and a mixed-module purchase cannot be resolved from total RAM alone."); }
    if (![8,16,32].includes(input.ramGb)) { status = "unknown"; reasons.push("The quantity planner covers 8GB, 16GB and 32GB totals. Other targets need a separately verified module layout; no automatic component offer is shown."); }
    if (!Number.isFinite(input.ramGb) || input.ramGb <= 0 || input.ramGb > model.validatedRamGb) { status = "unknown"; reasons.push("The cited factory validation is 32GB, not proof of an absolute hardware ceiling. A larger target needs exact modules, CPU/BIOS and separately attributed evidence; no 64GB guarantee is made here."); }
  } else { status = "unknown"; reasons.push("Choose a supported upgrade task. CPU swaps, unqualified PCIe cards and operating-system support need separate evidence."); }
  checklist.push(`Adapter check: ${model.adapters}. Verify the actual voltage, connector, wattage and configuration; do not choose an adapter only because the plug appears to fit.`, "Back up data, shut down and disconnect power before opening the machine. Follow the exact hardware maintenance manual and ESD procedure.");
  return { status, title: status === "incompatible" ? "This upgrade route conflicts with the selected configuration" : status === "unknown" ? "Complete the missing checks before ordering" : "A documented upgrade route with parts to verify", reasons, checklist, sources: [model.id, `${model.id}-hmm`, `kingston-${model.id}`, "lenovo-parts"], parts: miniPcParts(model.id, input.task, input.ramGb, input.modules), noBuy: input.task === "ram" && input.modules?.length === 2 && input.ramGb > 0 && input.modules.every((n) => [0,4,8,16].includes(n)) && input.modules.reduce((a,b) => a+b,0) >= input.ramGb ? "Your existing memory capacity meets the stated target. Keep it unless you have a separately diagnosed fault; buying more RAM is unnecessary for this capacity target." : undefined, href: `/guides/${model.guide}` };
}
export function planEthernet(input: { pc: number; adapter: number; switchRate: number; nas: number; devices: number; ports: number; uplinks: number }) {
  const rates = [input.pc, input.adapter, input.switchRate, input.nas];
  if (rates.some((value) => ![0.1,1,2.5,5,10].includes(value)) || !Number.isInteger(input.devices) || input.devices < 1 || !Number.isInteger(input.ports) || input.ports < 1 || !Number.isInteger(input.uplinks) || input.uplinks < 0) return null;
  const gbps = Math.min(...rates); const portNeed = input.devices + input.uplinks;
  return { gbps, theoreticalMBps: gbps * 1000 / 8, portNeed, sparePorts: input.ports - portNeed, bottlenecks: ["PC / host connection", "Ethernet adapter or NIC", "Switch port on this path", "NAS port"].filter((_, index) => rates[index] === gbps) };
}
