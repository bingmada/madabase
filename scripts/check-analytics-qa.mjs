import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../shared/analytics-traffic.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const scenarios = [
  ["?madabase-qa=1", true], ["?viewport-baseline", true],
  ["?utm_source=qa&utm_medium=verification", true], ["?utm_source=QA", true],
  ["?utm_medium=verification", true], ["?utm_source=google&utm_medium=organic", false],
  ["?utm_source=quora&utm_medium=referral", false], ["", false],
];
for (const component of ["affiliate/components/ClarityAnalytics.tsx", "main/components/Analytics.tsx", "wellness/components/ClarityAnalytics.tsx"]) {
  const componentSource = fs.readFileSync(new URL(`../apps/${component}`, import.meta.url), "utf8");
  const template = componentSource.match(/\{`([\s\S]*?)`\}/)?.[1];
  assert.ok(template, component);
  for (const [search, blocked] of scenarios) {
    for (const storageUnavailable of [false, true]) {
      const values = new Map();
      let loads = 0;
      const window = {
        location: { search, pathname: "/guides/example", hostname: component.startsWith("wellness") ? "wellness.madabase.com" : "madabase.com" },
        sessionStorage: { setItem(k, v) { if (storageUnavailable) throw Error("disabled"); values.set(k, v); }, getItem(k) { if (storageUnavailable) throw Error("disabled"); return values.get(k); } },
      };
      const context = vm.createContext({ exports: {}, window, URLSearchParams, document: { createElement: () => ({}), getElementsByTagName: () => [{ parentNode: { insertBefore() { loads += 1; } } }] } });
      vm.runInContext(compiled, context);
      const run = template.replace("${qaAnalyticsGuard}", context.exports.qaAnalyticsGuard).replace("${JSON.stringify(projectId)}", '"test-project"').replace("${JSON.stringify(site)}", '"homeoffice"');
      assert.equal(context.exports.isQaVisit(), blocked);
      vm.runInContext(run, context);
      assert.equal(loads, blocked ? 0 : 1, `${component} ${search}`);
      window.location.search = "";
      assert.equal(context.exports.isQaVisit(), blocked && !storageUnavailable, "QA persists on internal navigation when session storage is available");
      vm.runInContext(run, context);
      assert.equal(loads, blocked && !storageUnavailable ? 0 : blocked ? 1 : 2);
    }
  }
}
console.log("Analytics QA: 48 component/query/storage scenarios passed, including internal navigation and real referrals.");
