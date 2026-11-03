import Link from "next/link";
import type { SiteKey } from "@/lib/types";

const networkExamples = [
  {
    title: "The dock is still gigabit",
    path: [{label:"PC / USB host",rate:5},{label:"Dock Ethernet",rate:1},{label:"Switch",rate:2.5},{label:"NAS Ethernet",rate:2.5}],
    decision: "A faster switch leaves the 1GbE dock in the path. Check a supported adapter and its host connection before replacing a working 2.5GbE switch.",
  },
  {
    title: "The complete local path reaches 2.5GbE",
    path: [{label:"PC / USB host",rate:5},{label:"Ethernet adapter",rate:2.5},{label:"Switch",rate:2.5},{label:"NAS Ethernet",rate:2.5}],
    decision: "Keep the 2.5GbE switch if that ceiling meets the job. A router upgrade does not raise this same-switch PC-to-NAS path; check storage and a controlled transfer separately.",
  },
  {
    title: "BE67’s 10GbE port is assigned to WAN",
    path: [{label:"Internet plan",rate:5},{label:"BE67 WAN",rate:10},{label:"BE67 LAN",rate:2.5},{label:"PC Ethernet",rate:5}],
    decision: "This client path is capped at 2.5Gbps. BE67’s other LAN port is 1GbE; it has no second 10GbE port. Map WAN and LAN separately before choosing BE67 or BE85 for a wired 5Gbps plan.",
  },
];

export function DecisionWorkedExamples({ site, slug }: { site: SiteKey; slug: string }) {
  if (site === "network" && slug === "deco-be63-vs-be67-vs-be85-buying-guide") return <section className="mt-8 scroll-mt-24 rounded-md border border-[var(--border)] bg-white p-5" id="worked-examples" data-decision-resource="ethernet-paths">
    <p className="eyebrow">Worked network plans</p>
    <h2 className="mt-2 text-2xl font-bold">Will the more expensive mesh change your wired path?</h2>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Calculated examples use the stated link rates. The lowest rate on the selected traffic path sets a line-rate ceiling. File copies and internet downloads can be slower.</p>
    <div className="mt-5 space-y-5">{networkExamples.map(example => {
      const ceiling = Math.min(...example.path.map(hop => hop.rate));
      return <article className="rounded-md border border-[var(--border)] p-4" key={example.title}>
        <h3 className="font-bold">{example.title}</h3>
        <ol className="mt-3 grid gap-2 sm:grid-cols-4" aria-label="Traffic path">{example.path.map((hop,index) => <li className="rounded-md bg-[var(--surface-muted)] p-3 text-sm" key={hop.label}><span className="block text-xs text-[var(--muted)]">Step {index+1}: {hop.label}</span><strong className="mt-1 block">{hop.rate} Gbps</strong></li>)}</ol>
        <p className="mt-3 font-bold">Line-rate ceiling: {ceiling} Gbps · {ceiling*1000/8} MB/s before overhead</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{example.decision}</p>
      </article>;
    })}</div>
    <p className="mt-4 text-sm leading-6">The local examples exclude WAN because that traffic stays on the switch. The internet example includes WAN and excludes the NAS. Link aggregation and simultaneous multi-client traffic need a separate model.</p>
    <Link className="button-secondary mt-4" href="/compatibility/ethernet">Check your own Ethernet path and port count</Link>
    <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Port references: <a className="underline" href="https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be67/" target="_blank" rel="noopener noreferrer">TP-Link BE67</a> and <a className="underline" href="https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be85/" target="_blank" rel="noopener noreferrer">BE85</a>. Example inputs: Gbps × 1000 ÷ 8 gives MB/s before overhead.</p>
  </section>;

  if (site === "homeoffice" && slug === "dual-screen-portable-monitors-vs-alternatives") return <section className="mt-8 scroll-mt-24 rounded-md border border-[var(--border)] bg-white p-5" id="worked-examples" data-decision-resource="portable-display-paths">
    <p className="eyebrow">Three connection decisions</p>
    <h2 className="mt-2 text-2xl font-bold">Two panels do not always give you two independent desktops</h2>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Work through the host, cable, display mode and power supply as one setup. The examples below follow each documented connection path.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <article className="rounded-md bg-[var(--surface-muted)] p-4"><h3 className="font-bold">INVPM009 with HDMI only</h3><p className="mt-3 text-sm leading-6">Laptop HDMI → monitor HDMI, with separate power.</p><p className="mt-3 text-sm leading-6">The November 1 exact-listing observation described duplicate or split-screen output on this path. Do not buy it on the assumption that HDMI creates two independent external desktops.</p></article>
      <article className="rounded-md bg-[var(--surface-muted)] p-4"><h3 className="font-bold">A Mac that cannot install the driver</h3><p className="mt-3 text-sm leading-6">Exact Mac model → its native display limit → approved connection.</p><p className="mt-3 text-sm leading-6">INVPM009’s retailer-described independent Mac mode needs its Mac Extend software path. If installation is blocked, compare one supported native screen or another documented design. An adapter alone does not establish an extra independent display.</p></article>
      <article className="rounded-md bg-[var(--surface-muted)] p-4"><h3 className="font-bold">Windows with documented USB-C video</h3><p className="mt-3 text-sm leading-6">Supported video port → full-function signal lead + required power → extend mode.</p><p className="mt-3 text-sm leading-6">Check that Windows exposes two separately arranged panels at the required resolution. The INVPM009 listing described driver-free Windows extension on its appropriate USB-C path; confirm the supplied model and instructions.</p></article>
    </div>
    <p className="mt-4 text-sm leading-6">Before ordering, record the laptop model and OS, required independent screen count, allowed drivers, every signal and power cable, and the smallest desk you will use. Keep one screen when that completes the task.</p>
    <div className="mt-4 flex flex-wrap gap-3"><Link className="button-secondary" href="/compatibility/docks">Check the laptop and display path</Link><Link className="font-bold underline self-center" href="/guides/portable-monitor-usb-c-dp-alt-mode-displaylink-guide">Native video or USB graphics?</Link></div>
    <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Host reference: <a className="underline" href="https://support.apple.com/en-us/102555" target="_blank" rel="noopener noreferrer">Apple’s display connection guide</a>. INVPM009 mode descriptions retain the separately dated November 1 retailer evidence in this guide’s source list; the exact manual and software publisher still need matching.</p>
  </section>;

  if (site === "homeoffice" && slug === "logitech-litra-glow-vs-elgato-key-light-neo") return <section className="panel scroll-mt-24 p-5" id="worked-examples" data-decision-resource="lighting-power">
    <p className="eyebrow">Plan the complete setup</p>
    <h2 className="mt-2 text-2xl font-bold">Which Neo output belongs in your comparison?</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <article className="rounded-md border border-[var(--border)] p-4"><h3 className="font-bold">Use the included USB-A cable</h3><p className="mt-2 text-sm leading-6">Elgato lists up to 400 lumens. Compare that mode with Litra Glow’s listed 250-lumen maximum when you want a computer-powered setup without a separate Neo power supply.</p></article>
      <article className="rounded-md border border-[var(--border)] p-4"><h3 className="font-bold">Use a suitable USB-C computer port</h3><p className="mt-2 text-sm leading-6">Elgato lists up to 700 lumens and a separately supplied USB-C cable. Confirm the actual port and cable; a shared dock’s spare power is not established by its connector shape.</p></article>
      <article className="rounded-md border border-[var(--border)] p-4"><h3 className="font-bold">Budget for the maximum mode</h3><p className="mt-2 text-sm leading-6">The listed 1,000-lumen mode needs an external 5V supply rated for at least 3A. Elgato says that supply is not included. Compare the complete purchase and an available outlet.</p></article>
    </div>
    <p className="mt-4 text-sm leading-6">These are manufacturer output specifications. Face exposure, glare, comfort and webcam image quality also depend on placement and the camera. Check camera framing and placement before choosing more output.</p>
    <p className="mt-3 text-xs leading-5 text-[var(--muted)]">References rechecked November 3, 2026: <a className="underline" href="https://help.elgato.com/hc/en-us/articles/25946490270477-Elgato-Key-Light-Neo-Brightness-Information" target="_blank" rel="noopener noreferrer">Elgato power modes</a> · <a className="underline" href="https://support.logi.com/hc/en-gb/articles/4418106727447-Specification-Litra-Glow" target="_blank" rel="noopener noreferrer">Logitech specifications</a>.</p>
  </section>;
  return null;
}
