import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const loader = createRequire(import.meta.url);
loader.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true },
  }).outputText, filename);
};
const content = loader("../../lib/content.ts");
const sites = ["homeoffice", "network", "baby", "smarthome", "pet", "style", "costume"];
const inventory = sites.flatMap((site) => [
  ...content.siteGuides(site).map((value) => ({ kind: "guide", ...value })),
  ...content.siteRoundups(site).map((value) => ({ kind: "roundup", ...value })),
  ...content.siteProducts(site).map((value) => ({ kind: "product", ...value })),
]);
const output = process.argv[2] || "content-after.json";
fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), output), JSON.stringify(inventory, null, 2) + "\n");
console.log(JSON.stringify({ output, counts: Object.fromEntries(sites.map((site) => [site, inventory.filter((x) => x.site === site).length])) }));
