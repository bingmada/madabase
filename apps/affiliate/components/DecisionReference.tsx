import Link from "next/link";
import type { SiteKey } from "@/lib/types";

const breezeManual = "https://cdn.shopify.com/s/files/1/0157/0150/8160/files/IM_OMNIBRZ_201021_ROW_V1.pdf?v=1630054302";
const kleinSheet = "https://data.kleintools.com/sites/all/product_assets/documents/brochures/klein/82979_Pass_Thru_Connectors_Crimpers.pdf";

type Reference = {
  id: string;
  title: string;
  intro: string;
  steps?: {label:string;detail:string}[];
  columns?: string[];
  rows?: {label:string;values:string[]}[];
  note: string;
  sources: {label:string;href:string}[];
  next?: {label:string;href:string};
};

function ReferenceCard({reference:r}: {reference:Reference}) {
  return <section className="not-prose mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-4 sm:p-5" id={r.id} aria-labelledby={`${r.id}-title`} data-decision-reference={r.id}>
    <p className="eyebrow">Decision reference</p>
    <h2 className="mt-2 text-xl font-bold" id={`${r.id}-title`}>{r.title}</h2>
    <p className="mt-3 leading-7 text-[var(--muted)]">{r.intro}</p>
    {r.steps ? <ol className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">{r.steps.map((step,index)=><li className="rounded-md bg-[var(--surface-muted)] p-4" key={step.label}><p className="text-sm font-bold">{index+1}. {step.label}</p><p className="mt-2 text-sm leading-6">{step.detail}</p></li>)}</ol> : null}
    {r.rows && r.columns ? <div className="mt-4 overflow-x-auto rounded-md border border-[var(--border)]" role="region" aria-label={r.title} tabIndex={0}><table className="w-full min-w-[600px] text-left text-sm"><caption className="sr-only">{r.title}</caption><thead className="bg-[var(--surface-muted)]"><tr><th scope="col" className="p-3">Path or component</th>{r.columns.map(column=><th scope="col" className="p-3" key={column}>{column}</th>)}</tr></thead><tbody>{r.rows.map(row=><tr className="border-t border-[var(--border)]" key={row.label}><th scope="row" className="p-3 align-top">{row.label}</th>{row.values.map((value,index)=><td className="p-3 align-top leading-6" key={index}>{value}</td>)}</tr>)}</tbody></table></div> : null}
    <p className="mt-4 text-sm leading-6">{r.note}</p>
    <p className="mt-3 text-sm leading-6">Sources: {r.sources.map((source,index)=><span key={source.href}>{index ? " · " : ""}<a className="font-semibold underline underline-offset-4" href={source.href}>{source.label}</a></span>)}</p>
    {r.next ? <Link className="button-secondary mt-4" href={r.next.href}>{r.next.label}</Link> : null}
  </section>;
}

const displayReference:Reference = {
  id:"display-diagnostic-flow",title:"Which display path are you actually using?",
  intro:"Identify the hardware path before installing a driver or replacing the monitor. Use one known-good connection at a time.",
  steps:[
    {label:"Read the exact host-port specification",detail:"Find DisplayPort Alt Mode, Thunderbolt or an explicit display-output specification for that computer port. A USB-C shape, charging symbol or data-speed label alone is insufficient."},
    {label:"Read the monitor or dock input specification",detail:"Native USB-C video, HDMI and DisplayLink USB graphics are different paths. A DisplayLink driver needs supported DisplayLink hardware; it cannot add video to a data-only USB-C port."},
    {label:"Test native video with the specified cable",detail:"Use the display's video-capable cable and correct input. Check the monitor's power requirement. If the host has no USB-C video, try a supported HDMI input with separate power where the display permits it."},
    {label:"Use the driver only for the documented USB graphics path",detail:"When the exact model specifies DisplayLink, follow that model's OS support and installation guide. Otherwise check the native video path, input, power and GPU software before downloading unrelated drivers."}
  ],
  note:"If an existing supported cable or HDMI path solves the problem, keep it. Unclear port specifications or an unrecognized monitor model remain unresolved; they are not a reason to order a random dock.",
  sources:[{label:"ASUS: USB-C monitor video and driver paths",href:"https://www.asus.com/support/faq/1048768/"},{label:"VESA DisplayPort FAQ",href:"https://www.displayport.org/faq/"}],
  next:{label:"Check a MacBook dock and display plan",href:"/compatibility/docks"}
};

const dockReference:Reference = {
  id:"ts4-display-cable-paths",title:"TS4: draw the two display connections",
  intro:"First confirm the exact host supports two native external displays in the intended lid state and screen modes. This diagram is a wiring reference, not a compatibility result.",
  steps:[{label:"Computer → TS4 host port",detail:"Use the supplied or equivalently rated Thunderbolt host cable and connect the TS4 power supply. The host port is separate from the two downstream Thunderbolt ports."},{label:"TS4 → each monitor",detail:"Use one of the documented paths below. The front and rear ordinary USB-C data ports do not become monitor outputs because the connector fits."}],
  columns:["Display A","Display B"],rows:[
    {label:"DisplayPort + downstream Thunderbolt",values:["TS4 DisplayPort → DisplayPort monitor. For HDMI, use a suitable active DisplayPort-to-HDMI adapter.","One downstream Thunderbolt port → compatible USB-C/Thunderbolt display, or a video adapter matching the monitor input."]},
    {label:"Two downstream video paths",values:["First downstream Thunderbolt port → supported monitor or matching USB-C video adapter.","Second downstream Thunderbolt port → supported monitor or matching USB-C video adapter."]}
  ],
  note:"Count any required video cables and active adapters separately. Check direction, resolution and refresh rate at both ends. TS5 or TS5 Plus needs its own port plan. A working TS4 may already be sufficient; another native dock does not remove a host display-count limit.",
  sources:[{label:"TS4 manual, pages 5 and 12–15",href:"https://downloads.caldigit.com/TS4/CalDigit_TS4_Manual.pdf"},{label:"Current TS4 host and monitor guidance",href:"https://www.caldigit.com/thunderbolt-station-4/"}],
  next:{label:"Check my host, displays and TS4",href:"/compatibility/docks"}
};

const carrierReference:Reference = {
  id:"outward-check-card",title:"Before changing Omni Breeze to outward carry",
  intro:"Use the original Breeze diagrams and the instructions supplied with your carrier. This reminder cannot assess a child's fit.",
  steps:[{label:"Confirm all readiness and size conditions",detail:"Strong, consistent head and neck control; the complete outward size and chin-clearance checks above. Age alone does not establish readiness."},{label:"Remove the baby before changing position",detail:"Use the Breeze instructions for the seat, sliders, head support and strap routing. Recheck fasteners before loading."},{label:"Observe throughout",detail:"Keep the face visible and airway unobstructed. No outward-facing sleep; stop if the child cannot maintain the instructed position."},{label:"Leave uncertainty unresolved",detail:"Keep an appropriate inward-facing setup and ask Ergobaby for fitting help when the carrier label, instructions or readiness conditions are unclear."}],
  note:"Manual reference: IM-OMNIBRZ-201021-ROW-V1, pages 1–2. Classic and Deluxe are different models.",sources:[{label:"Original Omni Breeze manual",href:breezeManual},{label:"Ergobaby US support",href:"https://ergobaby.com/en-us/pages/customer-care"}]
};

const crimperReference:Reference = {
  id:"klein-connector-matrix",title:"VDV226-110: match the connector before the tool",
  intro:"Klein's system sheet identifies these RJ45 Pass-Thru connector families. These are reference part numbers, not a claim that every cable within a category fits.",
  columns:["Klein reference examples","Still check on the connector and cable"],rows:[
    {label:"Cat5e",values:["VDV826-728 (10), -702 (50), -762 (200)","Conductor construction and size; insulation and jacket diameter"]},
    {label:"Cat6",values:["VDV826-729 (10), -703 (50), -763 (200)","Actual conductor and cable dimensions; do not substitute an unrelated plug"]},
    {label:"Cat6A UTP",values:["VDV826-704 (50), -764 (200)","Unshielded connector fit for the actual larger cable; category alone is insufficient"]},
    {label:"Cat6A STP",values:["VDV826-705 (50), -754 (100)","Shielded connector construction, cable fit and instructed shield termination"]},
    {label:"Other RJ45 plugs",values:["Standard non-Pass-Thru or another manufacturer's system", "No assumed compatibility. Klein excludes standard non-Pass-Thru RJ45 plugs for this tool."]}
  ],
  note:"Numbers in parentheses are pack counts from sheet 82979 Rev. 06/21 A, page 2. Recheck the selected part and current instructions. Replacement blade VDV999-076 belongs to VDV226-110; VDV999-078 belongs to the different compact crimper. Inspect and test every termination. Keep factory-made patch leads when they already meet the job.",
  sources:[{label:"Klein connector-system sheet",href:kleinSheet},{label:"VDV226-110 instructions",href:"https://data.kleintools.com/sites/all/product_assets/documents/instructions/klein/VDV226-110_WEBINSTRUCTIONS.pdf"}]
};

export function DecisionReference({site,slug}: {site:SiteKey;slug:string}) {
  const reference = site === "homeoffice" && slug === "portable-monitor-usb-c-dp-alt-mode-displaylink-guide" ? displayReference
    : site === "homeoffice" && slug === "caldigit-ts4-thunderbolt-dock" ? dockReference
    : site === "baby" && slug === "ergobaby-omni-breeze-forward-facing-age-guide" ? carrierReference
    : site === "network" && slug === "pass-through-ethernet-crimping-tools-buying-guide" ? crimperReference : undefined;
  return reference ? <ReferenceCard reference={reference} /> : null;
}
