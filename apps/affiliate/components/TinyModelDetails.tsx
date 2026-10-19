import { evidenceSources } from "@/lib/compatibility-data";
import { miniPcProfiles } from "@/lib/tiny-models";

export function TinyModelDetails() {
  return <section aria-label="Tiny model evidence and limits">
    <h2>Model-specific upgrade references</h2>
    <p>Select the full model and generation. These are official-spec references, not tested builds. A machine type identifies a product range; the serial-specific As-Built list and supported substitutes still decide a particular machine’s parts.</p>
    <p><a href="#tiny-fru-check">Resolve the parts for your machine before shopping →</a></p>
    <div className="discovery-grid">{miniPcProfiles.map((model) => <article className="discovery-card" id={`tiny-model-${model.id}`} style={{scrollMarginTop:110}} key={model.id}>
      <h3>{model.name}</h3>
      <dl><dt><strong>Memory</strong></dt><dd>{model.memory}. Documented capacity: {model.validatedRamGb}GB. {model.memoryGeneration === "DDR5" ? "DDR4 modules will not fit this DDR5 plan." : "DDR5 modules will not fit this DDR4 plan."}</dd>
        <dt><strong>Storage positions</strong></dt><dd>{model.nvmeSlots} storage M.2 position(s), {model.sataBays} SATA bay. Count WLAN separately; confirm a real free connector, drive length and retaining hardware.</dd>
        <dt><strong>Expansion and bay limits</strong></dt><dd>{model.note}</dd>
        <dt><strong>Power to retain or verify</strong></dt><dd>{model.adapters}. A working, correctly specified adapter is not an upgrade target.</dd>
        <dt><strong>Network</strong></dt><dd>{model.ethernet}</dd>
        <dt><strong>Machine types in the linked manual</strong></dt><dd>{model.machineTypes.join(", ")}. An unlisted type needs its own documentation; it is not automatically incompatible.</dd></dl>
      <p>{model.extra}</p>
      <p className="evidence-note">Not established here: actual fitted FRUs, seller assembly, thermals, noise, sustained performance, OS/driver suitability or long-term stability.</p>
      <ul>{evidenceSources([model.id,`${model.id}-hmm`,...(model.id.includes("gen3") ? ["tiny-gen3-types"] : [])]).map((source) => <li key={source.id}><a href={source.url}>{source.title}</a> — {source.locator}</li>)}</ul>
    </article>)}</div>
  </section>;
}
