import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const offersPath = path.join(affiliateDir, "lib", "cj-offers.ts");
const transpiled = ts.transpileModule(fs.readFileSync(offersPath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: offersPath,
}).outputText;
const { authorizedCjOffers } = await import(`data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`);
const releaseTokens = new Set([
  "bc-babycare-portable-fan",
  "bc-babycare-airy-silicone-bib",
  "bc-babycare-clarvion-bundle",
  "bc-babycare-baby-food-maker-blue-extra",
  "bc-babycare-potty-chair-green",
]);
const offers = authorizedCjOffers.filter((offer) => releaseTokens.has(offer.token));
if (offers.length !== 5) throw new Error(`Expected five CJ Baby release offers; found ${offers.length}`);

const results = [];
for (const offer of offers) {
  const errors = [];
  try {
    const trackingUrl = new URL(offer.trackingUrl);
    trackingUrl.searchParams.set("sid", `release_audit_${offer.token}`);
    const response = await fetch(trackingUrl, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 Chrome/124 Safari/537.36" },
      signal: AbortSignal.timeout(30_000),
    });
    const finalUrl = new URL(response.url);
    const expectedUrl = new URL(offer.destinationUrl);
    const expectedVariant = expectedUrl.searchParams.get("variant");
    const finalVariant = finalUrl.searchParams.get("variant");
    if (!response.ok) errors.push(`HTTP ${response.status}`);
    if (!response.redirected) errors.push("CJ link did not redirect");
    if (!offer.allowedDestinationHosts.includes(finalUrl.hostname)) errors.push(`unexpected host ${finalUrl.hostname}`);
    const approvedPottyAlias = offer.token === "bc-babycare-potty-chair-green"
      && ["/products/potty-chair", "/products/3-in-1-potty-chair"].includes(finalUrl.pathname);
    if (finalUrl.pathname !== expectedUrl.pathname && !approvedPottyAlias) errors.push(`unexpected path ${finalUrl.pathname}`);
    if (expectedVariant && finalVariant && finalVariant !== expectedVariant) errors.push(`variant changed to ${finalVariant}`);
    results.push({ token: offer.token, catalogSku: offer.catalogSku, status: response.status, finalUrl: finalUrl.toString(), errors });
  } catch (error) {
    results.push({ token: offer.token, catalogSku: offer.catalogSku, errors: [error instanceof Error ? error.message : String(error)] });
  }
}

const failures = results.filter((result) => result.errors.length);
console.log("CJ Baby release-link audit");
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), offers: results.length, passed: results.length - failures.length, failed: failures.length, failures, results }, null, 2));
if (failures.length) process.exit(1);
console.log("\nCJ Baby release-link audit passed.");
