import { fruObservations, fruRoleLabels } from "@/lib/tiny-fru";
import { miniPcProfiles } from "@/lib/tiny-models";

export function TinyFruReference({modelId}:{modelId?:string} = {}) {
  const rows = fruObservations.filter((row) => !modelId || row.model === modelId);
  return <section id="tiny-fru-reference" style={{scrollMarginTop:110}}>
    <h2>FRUs checked in exact machine-type catalogs</h2>
    <p>These are candidates observed in Lenovo’s Machine Type tab on October 19, 2026. They are not the As-Built bill of materials for every unit in the range. Enter the serial privately on Lenovo, or use the exact ten-character MTM, then inspect the actual machine and supported substitutes.</p>
    <div className="compat-table-wrap"><table className="compat-table"><caption>Catalog identity, evidence scope and next verification</caption><thead><tr><th>Model / exact type</th><th>Part and catalog identity</th><th>Official verification</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.machineType}-${row.part}`}><th scope="row">{miniPcProfiles.find((model) => model.id === row.model)?.name}<p>{row.machineType}</p></th><td><strong>{fruRoleLabels[row.role]} · {row.part}</strong><p>{row.name}</p></td><td><a href={row.url}>Open Lenovo’s catalog for {row.machineType}</a><p>Machine Type tab; search {row.part}. Confirm the exact MTM/serial record and fitted assembly. No universal substitute is asserted.</p></td></tr>)}</tbody></table></div>
    <p><strong>Same cable, different carrier:</strong> the checked 11T3 and 11U5 catalogs list cable 00XL211 with carrier 5M11C16880; checked 10T7/10RU/10S0 list carrier 01MN886, while 10MQ/10MU list 01EF683. A shared cable number is not evidence that the complete kits interchange.</p>
    <p><strong>Risers remain card-specific:</strong> the checked M920x 10S0 catalog includes both 01AJ929 and 01AJ940. The catalog names are identifiers, not proof of lane wiring, GPU/NIC qualification, required rear bracket or thermal/power fit. No riser purchase button is enabled.</p>
  </section>;
}
