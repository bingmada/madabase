"use client";
import { useState, type FormEvent } from "react";
import { checkArm, checkDock, planEthernet, planMiniPc, type CompatibilityResult } from "@/lib/compatibility-engine";
import { armProfiles, dockProfiles, evidenceCheckedAt, evidenceSources, macProfiles, miniPcProfiles, monitorProfiles } from "@/lib/compatibility-data";
import { discoveryEvent } from "../../shared/SearchControls";

function Choice({ name, label, options, initial = "" }: { name: string; label: string; options: readonly (readonly [string, string])[]; initial?: string }) {
  return <label><span>{label}</span><select name={name} defaultValue={initial} required><option value="" disabled>Select…</option>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></label>;
}
function NumberField({ name, label, max = 500, step = "1", initial }: { name: string; label: string; max?: number; step?: string; initial?: number }) {
  return <label><span>{label}</span><input type="number" name={name} required min="0" max={max} step={step} defaultValue={initial} inputMode="decimal" /></label>;
}
const yesNo = [["unknown", "Not confirmed"], ["yes", "Yes"], ["no", "No"]] as const;
function Result({ result }: { result: CompatibilityResult }) {
  return <div className="compat-result" role="status" aria-live="polite" data-compatibility-status={result.status}><p className="eyebrow">{result.status === "conditional" ? "Conditional match" : result.status === "incompatible" ? "Requirement conflict" : "Evidence incomplete"}</p><h3>{result.title}</h3><ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>{result.checklist.length ? <><h3 className="mt-5">{result.status === "incompatible" ? "Checks for a revised setup" : "Before you buy"}</h3>{result.status === "incompatible" ? <p>Resolve the conflict above first. This reference checklist does not approve the selected combination.</p> : null}<ol>{result.checklist.map((item) => <li key={item}>{item}</li>)}</ol></> : null}
    {result.href ? <p className="mt-5"><a href={result.href} onClick={() => discoveryEvent("compatibility_detail_click", result.status)}>Read the exact model and alternatives →</a></p> : null}
    <p className="evidence-note mt-4">Official-spec planning · sources checked {evidenceCheckedAt} · no hands-on test or installation certification</p><ul className="evidence-note">{evidenceSources(result.sources).map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.locator}</li>)}</ul>
  </div>;
}
export type PlannerTopic = "docks" | "monitor-arms" | "mini-pcs" | "ethernet";
export function CompatibilityPlanner({ topic }: { topic: PlannerTopic }) {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [monitorId, setMonitorId] = useState("custom");
  const monitor = monitorProfiles.find((item) => item.id === monitorId);
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const str = (name: string) => String(data.get(name) ?? "");
    const num = (name: string) => Number(data.get(name));
    let next: CompatibilityResult;
    if (topic === "docks") next = checkDock({ mac: str("mac"), dock: str("dock"), screens: num("screens"), lid: str("lid"), mode: str("mode"), input: str("input"), software: str("software"), workload: str("workload"), powerWatts: num("powerWatts"), clamshellReady: str("clamshellReady") });
    else if (topic === "monitor-arms") {
      next = checkArm({ arm: str("arm"), kg: num("kg"), mm: num("mm"), vesa: str("vesa"), construction: str("construction"), curved: str("curved"), clearance: str("clearance") });
      if (monitor) next.sources.push(monitor.source);
    }
    else if (topic === "mini-pcs") next = planMiniPc({ model: str("model"), task: str("task"), pcie: str("pcie"), hasKit: str("hasKit"), ramGb: num("ramGb") });
    else {
      const plan = planEthernet({ pc: num("pc"), adapter: num("adapter"), switchRate: num("switchRate"), nas: num("nas"), devices: num("devices"), ports: num("ports"), uplinks: num("uplinks") });
      next = plan ? { status: plan.sparePorts < 0 ? "incompatible" : "conditional", title: `${plan.gbps}Gbps link-rate ceiling · ${plan.portNeed} switch ports needed`, reasons: [`Lowest selected link: ${plan.bottlenecks.join(", ")}.`, `${plan.theoreticalMBps}MB/s is a theoretical line-rate conversion, not measured file-copy speed. Protocol overhead, disks, CPU and shared traffic reduce it.`, plan.sparePorts < 0 ? `You are short of ${-plan.sparePorts} switch ports. Count each physical upstream cable once.` : `${plan.sparePorts} ports remain after the devices and upstream links you entered.`], checklist: ["Use negotiated link rates, not product-box totals. For an integrated PC NIC, enter the same rate for PC and NIC; for USB Ethernet, the PC field represents its upstream USB link ceiling.", "Map the local PC → switch → NAS path separately from internet/WAN speed. This planner assumes one switch, one data path, no link aggregation and compatible cabling.", "USB bandwidth is shared with displays and storage on a dock. Check actual negotiated Ethernet speed and a local throughput test before ordering another switch.", "For an M720q/M920q/M920x with its original 1GbE port, a multi-gig switch alone does not make the endpoint multi-gig. Check a supported NIC or adapter and its driver first."], sources: ["netgear-multigig", "netgear-ms305", "tplink-ue302c"], href: "https://homeoffice.madabase.com/compatibility/mini-pcs" } : { status: "unknown", title: "Enter supported rates and whole port counts", reasons: ["The calculation requires positive link rates and device/port counts."], checklist: [], sources: [] };
    }
    setResult(next); discoveryEvent("compatibility_complete", `${topic}:${next.status}`);
  }
  const title = { docks: "Check a MacBook and dock", "monitor-arms": "Check the monitor, arm and desk", "mini-pcs": "Build the upgrade checklist", ethernet: "Map your PC-to-NAS path" }[topic];
  const rates = [["0.1", "100Mbps"], ["1", "1Gbps"], ["2.5", "2.5Gbps"], ["5", "5Gbps"], ["10", "10Gbps"]] as const;
  return <section className="compat-panel" id="compatibility-checker" aria-label={title}><p className="eyebrow">Your equipment, your constraints</p><h2>{title}</h2><p>Use the exact model and your intended setup. Missing evidence remains visible; changing an answer clears the previous result.</p>
    <form className="compat-form" onSubmit={calculate} onChange={() => setResult(null)}>
      {topic === "docks" ? <>
        <Choice name="mac" label="MacBook model / chip" options={macProfiles.map((item) => [item.id, item.name])} />
        <Choice name="dock" label="Exact dock" options={dockProfiles.map((item) => [item.id, item.name])} />
        <Choice name="screens" label="Independent external displays" options={[["1", "One"], ["2", "Two"]]} />
        <Choice name="lid" label="Laptop lid while working" options={[["open", "Open — keep laptop screen"], ["closed", "Closed — clamshell"]]} />
        <Choice name="mode" label="Target on each external screen" options={[["1080p60", "1080p at 60Hz"], ["1440p60", "1440p at 60Hz"], ["4k60", "4K at 60Hz"], ["other", "Higher refresh / resolution / mixed modes"]]} />
        <Choice name="input" label="Monitor video input" options={[["hdmi", "HDMI on both screens"], ["dp", "DisplayPort"], ["usbc", "USB-C / Thunderbolt only"], ["mixed", "Mixed or not confirmed"]]} />
        <Choice name="software" label="DisplayLink software and permissions allowed?" options={yesNo} initial="unknown" />
        <Choice name="workload" label="Must support this workload" options={[["office", "Documents, coding, calls and dashboards"], ["protected", "HDCP video, gaming or 3D"], ["color", "Color-critical / motion-sensitive media"]]} />
        <NumberField name="powerWatts" label="Required host charging (W; 0 if unknown)" max={240} />
        <Choice name="clamshellReady" label="M3 closed-lid software, power and peripherals checked?" options={yesNo} initial="unknown" />
      </> : topic === "monitor-arms" ? <>
        <label className="compat-wide"><span>Monitor model, or enter your own measurements</span><select value={monitorId} onChange={(event) => setMonitorId(event.target.value)}><option value="custom">My monitor — enter its official weight and VESA below</option>{monitorProfiles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><span className="evidence-note">Model presets fill panel-only weight and VESA. Add attached accessories to weight; confirm your actual unit and mounting recess.</span></label>
        <Choice name="arm" label="Exact arm and clamp profile" options={armProfiles.map((item) => [item.id, item.name])} />
        <Choice key={`vesa-${monitorId}`} name="vesa" label="Monitor VESA pattern (mm)" initial={monitor?.vesa} options={[["75x75", "75 × 75"], ["100x100", "100 × 100"], ["200x100", "200 × 100"], ["200x200", "200 × 200"], ["other", "Other / adapter / unknown"]]} />
        <NumberField key={`weight-${monitorId}`} name="kg" label="Weight without stand + attached accessories (kg)" initial={monitor?.kg} max={50} step="0.01" />
        <NumberField name="mm" label="Desk + reinforcement plates at clamp (mm)" max={150} step="0.1" />
        <Choice name="construction" label="Desk maker approves this attachment location?" options={[["unknown", "Not confirmed / hollow top / glass"], ["approved", "Yes — construction and clamp location approved"]]} initial="unknown" />
        <Choice key={`curve-${monitorId}`} name="curved" label="Screen depth / curvature" initial={monitor?.curved} options={[["flat", "Flat screen"], ["curved", "Curved or unusually deep"], ["unknown", "Not confirmed"]]} />
        <Choice name="clearance" label="Flat underside, rear clearance and screws checked?" options={yesNo} initial="unknown" />
      </> : topic === "mini-pcs" ? <>
        <Choice name="model" label="Exact Tiny model — not SFF or Tower" options={miniPcProfiles.map((item) => [item.id, item.name])} />
        <Choice name="task" label="Upgrade task" options={[["sata", "Add a 2.5-inch SATA drive"], ["second-nvme", "Add a second internal NVMe drive"], ["ram", "Increase memory"]]} />
        <Choice name="pcie" label="PCIe expansion card installed or planned?" options={yesNo} initial="unknown" />
        <Choice name="hasKit" label="Correct SATA carrier, cable and hardware confirmed?" options={yesNo} initial="unknown" />
        <NumberField name="ramGb" label="Target total memory (GB; 0 for storage-only plan)" max={128} />
      </> : <>
        <Choice name="pc" label="PC NIC or upstream host-link ceiling" options={rates} />
        <Choice name="adapter" label="Ethernet adapter / NIC negotiated rate" options={rates} />
        <Choice name="switchRate" label="Slowest switch port on this local path" options={rates} />
        <Choice name="nas" label="NAS negotiated Ethernet rate" options={rates} />
        <NumberField name="devices" label="Devices wired to this switch (including NAS)" max={96} />
        <NumberField name="uplinks" label="Upstream links from this switch" max={8} />
        <NumberField name="ports" label="Total switch ports" max={128} />
      </>}
      <div className="compat-wide"><button type="submit">Check my setup</button><p className="evidence-note mt-3">No account needed. Your equipment answers stay in this page; analytics records completion and result type, not your raw inputs.</p></div>
    </form>{result ? <Result result={result} /> : <p className="evidence-note mt-4">Choose your equipment and submit to see the result. No model is recommended before these checks.</p>}
  </section>;
}
