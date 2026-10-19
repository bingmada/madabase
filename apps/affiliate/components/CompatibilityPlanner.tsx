"use client";
import { compareDocks, dockParts, networkDecision } from "@/lib/setup-decisions";
import { PartsBudget, type PartsWorksheet } from "./PartsBudget";
import { useEffect, useState, type FormEvent } from "react";
import { checkArm, checkDock, planMiniPc, type CompatibilityResult, type DockInput } from "@/lib/compatibility-engine";
import { armProfiles, dockProfiles, evidenceCheckedAt, evidenceSources, macProfiles, miniPcProfiles, monitorProfiles } from "@/lib/compatibility-data";
import { discoveryEvent } from "../../shared/SearchControls";

function Choice({ name, label, options, initial = "", onChange }: { name: string; label: string; options: readonly (readonly [string, string])[]; initial?: string; onChange?: (value: string) => void }) {
  return <label><span>{label}</span><select name={name} defaultValue={initial} onChange={(event) => onChange?.(event.target.value)} required><option value="" disabled>Select…</option>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></label>;
}
function NumberField({ name, label, max = 500, step = "1", initial }: { name: string; label: string; max?: number; step?: string; initial?: number }) {
  return <label><span>{label}</span><input type="number" name={name} required min="0" max={max} step={step} defaultValue={initial} inputMode="decimal" /></label>;
}
const yesNo = [["unknown", "Not confirmed"], ["yes", "Yes"], ["no", "No"]] as const;
const statusLabels = {supported:"Documented checks pass",conditional:"Conditional match",incompatible:"Requirement conflict",unknown:"Evidence incomplete"};

function Result({ result }: { result: CompatibilityResult }) {
  const [copied,setCopied] = useState(false);
  const [copyFallback,setCopyFallback] = useState("");
  const [worksheet,setWorksheet] = useState<PartsWorksheet | null>(null);
  useEffect(() => { setCopied(false); setCopyFallback(""); },[worksheet]);
  const decision = result.noBuy ? "Buy nothing for this stated goal" : result.status === "incompatible" ? "Do not order this combination" : result.status === "unknown" ? "Hold the purchase until the missing checks are resolved" : "Reuse working parts; buy only the missing items below";
  const checklist = [result.context,result.title,decision,result.noBuy,...result.reasons,...(result.parts ?? []).map((part) => `${part.name}: ${part.quantity}. ${part.check}`),...result.checklist,...(worksheet ? ["Your current reuse and delivered-cost worksheet:",...worksheet.lines.map((line) => `${line.name}: ${line.owned ? "Already have / no purchase needed" : `${line.quantity}; delivered line cost ${line.cost.trim() || "unknown"} ${worksheet.currency}`}`)] : []),...evidenceSources(result.sources).map((source) => `${source.title}: ${source.url}`)].filter(Boolean).join("\n\n");
  async function copy() {
    try { await navigator.clipboard.writeText(checklist); setCopied(true); }
    catch { setCopyFallback(checklist); }
  }
  return <section className="compat-result" id="compatibility-result" style={{scrollMarginTop:110}} tabIndex={-1} aria-label="Your setup result" data-compatibility-status={result.status}>
    <p className="eyebrow">{statusLabels[result.status]}</p><p className="evidence-note">{result.context}</p><h3>{result.title}</h3>
    <div className="discovery-card mt-4"><h3>{decision}</h3>{result.noBuy ? <p>{result.noBuy}</p> : <p>{result.status === "conditional" || result.status === "supported" ? "This is a planning checklist, subject to the exact component and assembly checks below." : "The parts list is a reference for a revised plan, not approval to buy the unresolved combination."}</p>}</div>
    <ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
    {!result.noBuy && result.parts?.length ? <><h3>What to buy, reuse or verify</h3><ul>{result.parts.map((part) => <li key={part.id}><strong>{part.name}: {part.quantity}</strong>{part.id === "memory" ? <p>{part.check}</p> : null}</li>)}</ul></> : null}
    {result.checklist.length ? <><h3 className="mt-5">{result.status === "incompatible" ? "Checks for a revised setup" : "Your next checks"}</h3><ol>{result.checklist.map((item) => <li key={item}>{item}</li>)}</ol></> : null}
    <button type="button" className="decision-button" onClick={copy}>Copy this checklist</button><span role="status" className="evidence-note">{copied ? " Checklist copied. Keep it with the seller's exact parts and return details." : ""}</span>
    {copyFallback ? <label className="checklist-copy">Select and copy your checklist<textarea readOnly value={copyFallback} rows={8} /></label> : null}
    {!result.noBuy && result.parts?.length ? <PartsBudget key={JSON.stringify(result.parts)} parts={result.parts} allowComponents={result.status === "conditional" && result.sources.includes("lenovo-parts")} onWorksheetChange={setWorksheet} /> : null}
    {result.href ? <p className="mt-5"><a href={result.href} onClick={() => discoveryEvent("compatibility_detail_click", result.status)}>{result.hrefLabel ?? "Read the exact model and alternatives"} →</a></p> : null}
    <p className="evidence-note mt-4">Official-spec planning · sources checked {evidenceCheckedAt} · no hands-on test or installation certification</p><ul className="evidence-note">{evidenceSources(result.sources).map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.locator}</li>)}</ul>
  </section>;
}
export type PlannerTopic = "docks" | "monitor-arms" | "mini-pcs" | "ethernet";
export function CompatibilityPlanner({ topic, initialModel = "" }: { topic: PlannerTopic; initialModel?: string }) {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [ready,setReady] = useState(false);
  useEffect(() => { setReady(true); },[]);
  const [comparison, setComparison] = useState<ReturnType<typeof compareDocks> | null>(null);
  const [dockRequest,setDockRequest] = useState<DockInput | null>(null);
  const [monitorId, setMonitorId] = useState("custom");
  const [task,setTask] = useState("");
  const [selectedMac,setSelectedMac] = useState("");
  const [selectedLid,setSelectedLid] = useState("");
  const [networkPath,setNetworkPath] = useState("same-switch");
  const monitor = monitorProfiles.find((item) => item.id === monitorId);
  useEffect(() => {
    if (!result && !comparison) return;
    const node = document.getElementById(result ? "compatibility-result" : "dock-comparison");
    node?.focus({preventScroll:true}); node?.scrollIntoView({behavior:"smooth",block:"start"});
  },[result,comparison]);
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const str = (name: string) => String(data.get(name) ?? "");
    const num = (name: string, fallback = 0) => data.has(name) ? Number(data.get(name)) : fallback;
    let next: CompatibilityResult;
    if (topic === "docks") {
      const input = { mac: str("mac"), dock: str("dock"), screens: num("screens"), lid: str("lid"), mode: str("mode"), input: str("input"), software: str("software"), workload: str("workload"), powerWatts: num("powerWatts"), clamshellReady: str("clamshellReady") };
      const compared = compareDocks(input,str("existingRoute"));
      setComparison(compared); setDockRequest(input);
      if (input.dock === "compare") {
        setResult(compared.noBuy ? {status:"conditional",title:"Keep the display route you already use",context:`${macProfiles.find((item) => item.id === input.mac)?.name} · ${input.screens} displays · ${input.mode}`,reasons:["You confirmed the current setup runs this display mode and workload. The optional comparisons below do not establish a need to replace it."],checklist:["Reuse working cables and power connections. Assess a new dock only for an additional function you actually need."],sources:macProfiles.find((item) => item.id === input.mac)?.sources ?? [],noBuy:compared.noBuy} : null);
        discoveryEvent("compatibility_complete","docks:compared"); return;
      }
      next = {...checkDock(input),parts:dockParts(input),noBuy:compared.noBuy};
    } else if (topic === "monitor-arms") {
      next = checkArm({ arm: str("arm"), kg: num("kg"), mm: num("mm"), vesa: str("vesa"), construction: str("construction"), curved: str("curved"), clearance: str("clearance"), ports:str("portsClear"), travel:str("travel"),alreadyOwned:str("alreadyOwned") });
      if (monitor) next.sources.push(monitor.source);
    } else if (topic === "mini-pcs") next = planMiniPc({ model: str("model"), task: str("task"), pcie: str("pcie"), hasKit: str("hasKit"), ramGb: num("ramGb"), modules: [num("module1",-1),num("module2",-1)],storageNeed:str("storageNeed"),storageReady:str("storageReady") });
    else next = networkDecision({ pc:num("pc"), adapter:num("adapter"), switchRate:num("switchRate",1), nas:num("nas",1), devices:num("devices",1), ports:num("ports",1), uplinks:num("uplinks"),path:str("path"),routerLan:num("routerLan",1),routerWan:num("routerWan",1),internet:num("internet",1),target:num("target"),cable:str("cable") });
    setResult(next); discoveryEvent("compatibility_complete", `${topic}:${next.status}`);
  }
  function chooseDock(id: string) {
    if (!dockRequest || !comparison) return;
    const input = {...dockRequest,dock:id};
    setResult({...checkDock(input),parts:dockParts(input),noBuy:comparison.noBuy});
    discoveryEvent("compatibility_detail_click",`dock-checklist:${id}`);
  }
  const title = { docks: "Check a MacBook and dock", "monitor-arms": "Check the monitor, arm and desk", "mini-pcs": "Build the upgrade checklist", ethernet: "Map your PC-to-NAS path" }[topic];
  const rates = [["0.1", "100Mbps"], ["1", "1Gbps"], ["2.5", "2.5Gbps"], ["5", "5Gbps"], ["10", "10Gbps"]] as const;
  const memory = [["-1","Not inspected"],["0","Empty"],["4","4GB"],["8","8GB"],["16","16GB"],["32","32GB — separate module evidence needed"]] as const;
  return <section className="compat-panel" id="compatibility-checker" aria-label={title}>
    <p className="eyebrow">Your equipment, your constraints</p><h2>{title}</h2><p>Start with the exact equipment and the job you need. Changing an answer clears the previous result.</p>
    <details className="guide-toc"><summary>Where to find the details before starting</summary>{topic === "mini-pcs" ? <p>Read the Tiny model and machine type from the chassis label. For RAM, inspect both module labels rather than dividing total memory by two; follow the exact maintenance manual with power disconnected. For storage, check free capacity, occupied storage sockets, carrier/cable and retaining clip. Enter a serial only on Lenovo Parts Lookup, never here.</p> : topic === "docks" ? <p>On the Mac, open Apple menu → About This Mac and read the complete chip name, including Pro or Max. Check the monitor’s actual input and requested resolution/refresh rate. Read the host-output wattage separately from charger input power. If company policy controls software, confirm DisplayLink permission before ordering.</p> : topic === "monitor-arms" ? <p>Use the monitor maker’s weight without stand, adding carried accessories. Read VESA spacing and screw requirements from its manual. Measure the actual clamp stack and underside; get the desk maker’s approval for that attachment location. Model presets are references, not a complete-device database.</p> : <p>Choose one physical traffic path. Record negotiated port rates, not just package claims; for a built-in NIC use its rate in both PC and NIC fields. For a USB adapter, include its host-link ceiling. Count only actual wired switch devices and uplinks. WAN and NAS inputs appear only when that path uses them.</p>}</details>
    {!ready ? <p role="status">Loading the planner… The model reference below is available now.</p> : null}
    <form onSubmit={calculate} onChange={() => { setResult(null); setComparison(null); setDockRequest(null); }}>
      <fieldset className="compat-form" disabled={!ready}><legend className="sr-only">Equipment and task details</legend>
      {topic === "docks" ? <>
        <Choice name="mac" label="MacBook model / chip" onChange={setSelectedMac} options={macProfiles.map((item) => [item.id, item.name])} />
        <Choice name="dock" label="Dock to check, or compare the listed routes" initial="compare" options={[["compare","Compare all three — I have not chosen a dock"],...dockProfiles.map((item): [string,string] => [item.id, item.name])]} />
        <Choice name="screens" label="Independent external displays" options={[["1", "One"], ["2", "Two"]]} />
        <Choice name="lid" label="Laptop lid while working" onChange={setSelectedLid} options={[["open", "Open — keep laptop screen"], ["closed", "Closed — clamshell"]]} />
        <Choice name="mode" label="Target on each external screen" options={[["1080p60", "1080p at 60Hz"], ["1440p60", "1440p at 60Hz"], ["4k60", "4K at 60Hz"], ["other", "Higher refresh / resolution / mixed modes"]]} />
        <Choice name="input" label="Monitor video input" options={[["hdmi", "HDMI on both screens"], ["dp", "DisplayPort"], ["usbc", "USB-C / Thunderbolt only"], ["mixed", "Mixed or not confirmed"]]} />
        <Choice name="software" label="DisplayLink software and permissions allowed?" options={yesNo} initial="unknown" />
        <Choice name="workload" label="Must support this workload" options={[["office", "Documents, coding, calls and dashboards"], ["protected", "HDCP video, gaming or 3D"], ["color", "Color-critical / motion-sensitive media"]]} />
        <Choice name="existingRoute" label="Current setup already runs these displays, mode and workload?" options={yesNo} initial="unknown" />
        <NumberField name="powerWatts" label="Required host charging (W; 0 if unknown)" max={240} />
        {selectedMac === "m3" && selectedLid === "closed" ? <Choice name="clamshellReady" label="M3 closed-lid software, power and peripherals checked?" options={yesNo} initial="unknown" /> : null}
      </> : topic === "monitor-arms" ? <>
        <label className="compat-wide"><span>Monitor model, or enter your own measurements</span><select value={monitorId} onChange={(event) => setMonitorId(event.target.value)}><option value="custom">My monitor — enter its official weight and VESA below</option>{monitorProfiles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><span className="evidence-note">Presets fill panel-only weight and VESA. Add carried accessories; confirm your actual unit and mounting recess.</span></label>
        <Choice name="arm" label="Exact arm and clamp profile" options={armProfiles.map((item) => [item.id, item.name])} />
        <Choice name="alreadyOwned" label="Already own this exact arm and its correct attachment?" options={yesNo} initial="unknown" />
        <Choice key={`vesa-${monitorId}`} name="vesa" label="Monitor VESA pattern (mm)" initial={monitor?.vesa} options={[["75x75", "75 × 75"], ["100x100", "100 × 100"], ["200x100", "200 × 100"], ["200x200", "200 × 200"], ["other", "Other / adapter / unknown"]]} />
        <NumberField key={`weight-${monitorId}`} name="kg" label="Weight without stand + attached accessories (kg)" initial={monitor?.kg} max={50} step="0.01" />
        <NumberField name="mm" label="Desk + reinforcement plates at clamp (mm)" max={150} step="0.1" />
        <Choice name="construction" label="Desk maker approves this attachment location?" options={[["unknown", "Not confirmed / hollow top / glass"], ["approved", "Yes — construction and clamp location approved"]]} initial="unknown" />
        <Choice key={`curve-${monitorId}`} name="curved" label="Screen depth / curvature" initial={monitor?.curved} options={[["flat", "Flat screen"], ["curved", "Curved or unusually deep"], ["unknown", "Not confirmed"]]} />
        <Choice name="clearance" label="Flat underside, rear clearance and screws checked?" options={yesNo} initial="unknown" />
        <Choice name="portsClear" label="VESA plate and screws leave monitor ports accessible?" options={yesNo} initial="unknown" />
        <Choice name="travel" label="Wall clearance and cable slack checked at full arm/desk travel?" options={yesNo} initial="unknown" />
      </> : topic === "mini-pcs" ? <>
        <Choice name="model" label="Exact Tiny model — not SFF or Tower" initial={initialModel} options={miniPcProfiles.map((item) => [item.id, item.name])} />
        <Choice name="task" label="Upgrade task" onChange={setTask} options={[["nvme", "Replace the existing NVMe drive"], ["sata", "Add a 2.5-inch SATA drive"], ["second-nvme", "Add a second internal NVMe drive"], ["ram", "Increase memory"]]} />
        {task === "ram" ? <>
          <Choice name="module1" label="Current memory slot 1 (GB)" options={memory} initial="-1" />
          <Choice name="module2" label="Current memory slot 2 (GB)" options={memory} initial="-1" />
          <Choice name="ramGb" label="Target total memory (GB)" options={[["8","8GB"],["16","16GB"],["32","32GB"],["64","64GB — separate evidence required"],["-1","Other — no verified quantity plan"]]} />
        </> : task ? <>
          <Choice name="storageNeed" label="Need more usable storage or a replacement for a diagnosed drive fault?" options={[["unknown","Not confirmed — check free space and the actual problem"],["yes","Yes — additional capacity or a diagnosed replacement is needed"],["no","No — current storage already meets the job"]]} initial="unknown" />
          {task === "sata" ? <>
            <Choice name="pcie" label="PCIe expansion card installed or planned?" options={yesNo} initial="unknown" />
            <Choice name="hasKit" label="Free SATA bay, model-matched carrier, cable and hardware confirmed?" options={yesNo} initial="unknown" />
          </> : <Choice name="storageReady" label="Intended storage socket, correct retainer and drive clearance confirmed?" options={yesNo} initial="unknown" />}
        </> : <p className="compat-wide evidence-note">Choose the task to see only its required checks. No storage-kit questions are needed for a RAM plan.</p>}
      </> : <>
        <Choice name="path" label="Which traffic path are you checking?" options={[["same-switch","PC → same switch → NAS (same LAN/subnet)"],["router-transit","PC → switch → router LAN → NAS"],["direct","Dedicated PC → NAS cable"],["internet","PC → switch → router LAN/WAN → internet"]]} initial="same-switch" onChange={setNetworkPath} />
        <Choice name="target" label="Required link-rate target (not file-copy speed)" options={rates} />
        <Choice name="pc" label="PC NIC or upstream host-link ceiling" options={rates} />
        <Choice name="adapter" label="Ethernet adapter / NIC negotiated rate" options={rates} />
        {networkPath !== "direct" ? <Choice name="switchRate" label="Slowest switch port on this path" options={rates} /> : null}
        {networkPath !== "internet" ? <Choice name="nas" label="NAS negotiated Ethernet rate" options={rates} /> : null}
        {["router-transit","internet"].includes(networkPath) ? <Choice name="routerLan" label="Slowest router LAN port on the path" options={rates} /> : null}
        {networkPath === "internet" ? <><Choice name="routerWan" label="Router WAN port" options={rates} /><NumberField name="internet" label="Internet plan download rate (Gbps; 500Mbps = 0.5)" max={100} step="0.01" /></> : null}
        <Choice name="cable" label="Cable path and negotiated rates verified?" options={yesNo} initial="unknown" />
        {networkPath !== "direct" ? <><NumberField name="devices" label="Devices wired to this switch (including NAS when present)" max={96} /><NumberField name="uplinks" label="Upstream links from this switch" max={8} /><NumberField name="ports" label="Total switch ports" max={128} /></> : null}
      </>}
      <div className="compat-wide"><button type="submit">Check my setup</button><p className="evidence-note mt-3">No account needed. Answers stay in this page; analytics records completion and result type, not your raw inputs.</p></div>
      </fieldset>
    </form>
    {result ? <Result key={JSON.stringify(result)} result={result} /> : null}
    {comparison ? <section className="mt-6" id="dock-comparison" style={{scrollMarginTop:110}} tabIndex={-1} aria-label="Dock comparison results"><h3 className="text-xl font-bold">Compare all three docks with these same requirements</h3><p>{comparison.guidance}</p><p>Choose a route below to see its exact wiring, missing pieces and cost worksheet. A conflict or unknown result is a reason to hold that purchase.</p><div className="discovery-grid">{comparison.candidates.map(({id,name,result:candidate}) => <article className="discovery-card" key={id}><h3>{name}</h3><p><strong>{statusLabels[candidate.status]}</strong> · {candidate.title}</p><ul>{candidate.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><button type="button" className="decision-button" onClick={() => chooseDock(id)}>Show checklist for {name}</button><p><a href={candidate.href}>Read exact model</a></p></article>)}</div></section> : null}
    {!result && !comparison ? <p className="evidence-note mt-4">Choose your equipment and submit to see the result. No model is recommended before these checks.</p> : null}
  </section>;
}
