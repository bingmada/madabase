import Link from "next/link";
import { findProduct } from "@/lib/content";
import type { SiteKey } from "@/lib/types";

const routes = [
  {
    family: "smart-wall-switches", slug: "tapo-p125m-matter-smart-plug",
    title: "For a plug-in lamp: compare a documented smart plug",
    body: "If the job is controlling a suitable plug-in lamp, the Tapo P125M offers a separate plug format with its own load, Wi-Fi and controller checks. It does not replace a two-button fixed wall switch, establish two-gang fit or control an arbitrary hardwired load. For fixed wiring, choose an exact regional device with the electrician instead of transferring the NillWay listing's unclear ratings.",
  },
  {
    family: "smart-water-shutoff-valves", slug: "aqara-valve-controller-t1",
    title: "For an existing compatible valve: compare Aqara T1",
    body: "Aqara Valve Controller T1 is a separate retrofit actuator for a compatible existing lever or butterfly valve, with its own Aqara-hub, clearance, manual-access and movement checks. It is not an inline DN15/DN20 replacement valve. If the plumbing itself needs replacement, have that work specified appropriately; an app command or an actuator photograph does not resolve the Owfeel mechanism and size conflict.",
  },
  {
    family: "whole-home-energy-monitors", slug: "emporia-vue-3-home-energy-monitor",
    title: "For circuit-level trends: compare Emporia Vue 3",
    body: "Vue 3 is an independently documented panel-monitoring option with its own sensor package, electrical-service fit and data route. It is not the Sungrass Home Assistant bundle or a guaranteed local Home Assistant replacement. A qualified electrician must assess the panel and sensor installation. For one plug-in appliance, an appropriate plug meter or existing utility data may answer the question with less equipment.",
  },
] as const;

export function GuideMerchant22Routes({ site, slug }: { site: SiteKey; slug: string }) {
  if (site !== "smarthome") return null;
  const roles = ["buying-guide", "vs-alternatives", "compatibility-and-fit-guide"];
  const route = routes.find(row => roles.some(role => slug === `${row.family}-${role}`));
  if (route && findProduct(site, route.slug)) {
    return <aside className="mt-6 rounded-md border border-[var(--border)] bg-white p-5" aria-label={route.title} data-merchant22-route={route.slug}>
      <h2 className="text-xl font-bold">{route.title}</h2>
      <p className="mt-3 text-sm leading-6">{route.body}</p>
      <Link className="mt-4 inline-block font-bold underline" href={`/reviews/${route.slug}`}>Review the separate model and buying conditions</Link>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Keep a suitable existing arrangement. Compare the actual function and complete system cost before changing it.</p>
    </aside>;
  }
  if (slug !== "in-wall-smart-relays-buying-guide") return null;
  return <aside className="mt-6 rounded-md border border-[var(--border)] bg-white p-5" aria-label="Resolve the Shelly US installation document" data-merchant22-route="shelly-us-documentation">
    <h2 className="text-xl font-bold">Get the matching US UL instructions before buying</h2>
    <p className="mt-3 text-sm leading-6">The selected offer now names a 15 A UL-labelled Shelly 1 Gen4. The manufacturer US page still links EU material and repeats a 16 A table. Ask Shelly and the qualified installer for the applicable US model instructions and load limits; this guide does not transfer the EU wiring diagram. Keep the existing appropriate physical control while that is clarified.</p>
    <a className="mt-4 inline-block font-bold underline" href="https://us.shelly.com/products/shelly-1-gen4-ul-certified" target="_blank" rel="noopener noreferrer">Review the manufacturer US model and documentation</a>
  </aside>;
}
