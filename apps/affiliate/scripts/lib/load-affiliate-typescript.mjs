import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

// CLI tools inspect runtime modules rather than reconstructing a second catalog.
const loader = createRequire(import.meta.url);
loader.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      esModuleInterop: true, resolveJsonModule: true,
    },
  }).outputText, filename);
};

export function loadAffiliateTypescript(relativePath) {
  return loader(relativePath);
}
