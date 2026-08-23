import fs from "node:fs";

const controlUrl = new URL("../config/search-recovery-control.json", import.meta.url);

export function readSearchRecoveryControl() {
  return JSON.parse(fs.readFileSync(controlUrl, "utf8"));
}

export function assertSearchRecoveryPublishingAllowed({ sites, action }) {
  const control = readSearchRecoveryControl();
  const requestedSites = Array.isArray(sites) ? sites : [sites];
  const frozenSites = new Set(control.freeze?.sites ?? []);
  const affectedSites = requestedSites.filter((site) => frozenSites.has(site));

  if (control.freeze?.active && affectedSites.length) {
    const gates = Object.entries(control.reviewGates ?? {})
      .map(([name, date]) => `${name}=${date}`)
      .join(", ");
    throw new Error(
      `Search recovery freeze blocks ${action} for ${affectedSites.join(", ")}. `
      + `Record the completed GSC gate and disable the freeze explicitly before publishing. Review gates: ${gates}`,
    );
  }
}
